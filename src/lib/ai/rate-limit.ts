/** Server-only request identity. Neither value is included in classifier telemetry. */
export type ClassificationRequestIdentity = Readonly<{
  sessionId: string;
  ip: string;
}>;

export type ClassificationControlConfig = Readonly<{
  maxInputChars: number;
  sessionClassificationCap: number;
  sessionTotalCap: number;
  ipClassificationCap: number;
}>;

export type ClassificationControlInput = Readonly<{
  identity: ClassificationRequestIdentity;
  inputLength: number;
}>;

export type ClassificationControlDecision =
  | Readonly<{ allowed: true }>
  | Readonly<{
      allowed: false;
      reason: "input_too_long" | "session_classification_cap" | "session_total_cap" | "ip_classification_cap";
    }>;

/**
 * A small counter-store abstraction lets deployed hosts replace the local
 * in-memory implementation without changing the classification gateway.
 */
export interface ClassificationCounterStore {
  get(scope: "session_classification" | "session_total" | "ip_classification", key: string): number;
  increment(scope: "session_classification" | "session_total" | "ip_classification", key: string): void;
}

export class InMemoryClassificationCounterStore implements ClassificationCounterStore {
  private readonly counters = new Map<string, number>();

  get(scope: "session_classification" | "session_total" | "ip_classification", key: string): number {
    return this.counters.get(`${scope}:${key}`) ?? 0;
  }

  increment(scope: "session_classification" | "session_total" | "ip_classification", key: string): void {
    const counterKey = `${scope}:${key}`;
    this.counters.set(counterKey, this.get(scope, key) + 1);
  }
}

/**
 * Consumes a classifier allowance only after all limits have passed. The raw
 * input is deliberately not accepted or retained: callers supply its length.
 */
export class InMemoryClassificationControls {
  constructor(
    private readonly config: ClassificationControlConfig,
    private readonly counters: ClassificationCounterStore = new InMemoryClassificationCounterStore()
  ) {
    assertPositiveConfig(config);
  }

  consume(input: ClassificationControlInput): ClassificationControlDecision {
    if (input.inputLength > this.config.maxInputChars) return { allowed: false, reason: "input_too_long" };

    const { sessionId, ip } = input.identity;
    if (this.counters.get("session_classification", sessionId) >= this.config.sessionClassificationCap) {
      return { allowed: false, reason: "session_classification_cap" };
    }
    if (this.counters.get("session_total", sessionId) >= this.config.sessionTotalCap) {
      return { allowed: false, reason: "session_total_cap" };
    }
    if (this.counters.get("ip_classification", ip) >= this.config.ipClassificationCap) {
      return { allowed: false, reason: "ip_classification_cap" };
    }

    this.counters.increment("session_classification", sessionId);
    this.counters.increment("session_total", sessionId);
    this.counters.increment("ip_classification", ip);
    return { allowed: true };
  }
}

export type ControlledClassificationResult<T> =
  | Readonly<{ kind: "executed"; value: T }>
  | Readonly<{ kind: "blocked"; decision: Exclude<ClassificationControlDecision, { allowed: true }> }>;

/** Runs the provider operation only when the injected controls grant an allowance. */
export async function runWithClassificationControls<T>(
  controls: Pick<InMemoryClassificationControls, "consume">,
  input: ClassificationControlInput,
  operation: () => Promise<T>
): Promise<ControlledClassificationResult<T>> {
  const decision = controls.consume(input);
  if (!decision.allowed) return { kind: "blocked", decision };
  return { kind: "executed", value: await operation() };
}

function assertPositiveConfig(config: ClassificationControlConfig): void {
  for (const value of Object.values(config)) {
    if (!Number.isInteger(value) || value <= 0) throw new Error("Classification control values must be positive integers.");
  }
}
