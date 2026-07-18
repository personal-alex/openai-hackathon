/** Server-only request identity. Neither value is included in classifier telemetry. */
export type ClassificationRequestIdentity = Readonly<{
  sessionId: string;
  /** Present only when a trusted deployment supplies it. */
  ip?: string;
}>;

export type ClassificationControlConfig = Readonly<{
  maxInputChars: number;
  sessionClassificationCap: number;
  sessionClassificationHourlyCap: number;
  sessionTotalCap: number;
  sessionTotalHourlyCap: number;
  ipClassificationCap: number;
  ipClassificationHourlyCap: number;
  ipTotalCap: number;
  ipTotalHourlyCap: number;
}>;

export type ClassificationControlInput = Readonly<{
  identity: ClassificationRequestIdentity;
  inputLength: number;
}>;

export type ClassificationControlDecision =
  | Readonly<{ allowed: true }>
  | Readonly<{
      allowed: false;
      reason: "input_too_long" | "session_classification_cap" | "session_total_cap" | "ip_classification_cap" | "ip_total_cap";
      retryAfterSeconds?: number;
    }>;

type AttemptPolicy = readonly [key: string, limit: number, windowMs: number, reason: Exclude<ClassificationControlDecision, { allowed: true }> ["reason"]];

/**
 * Clearly labelled development-only fallback. It stores opaque identifiers and
 * timestamps in process memory only; deployed environments must use a shared
 * server-side guard before live calls are enabled.
 */
export class InMemoryClassificationControls {
  private readonly attempts = new Map<string, number[]>();

  constructor(
    private readonly config: ClassificationControlConfig,
    private readonly now: () => number = Date.now
  ) {
    assertPositiveConfig(config);
  }

  consume(input: ClassificationControlInput): ClassificationControlDecision {
    if (input.inputLength > this.config.maxInputChars) return { allowed: false, reason: "input_too_long" };

    const now = this.now();
    const policies: AttemptPolicy[] = [
      [`session:${input.identity.sessionId}:classification`, this.config.sessionClassificationCap, 600_000, "session_classification_cap"],
      [`session:${input.identity.sessionId}:classification`, this.config.sessionClassificationHourlyCap, 3_600_000, "session_classification_cap"],
      [`session:${input.identity.sessionId}:all`, this.config.sessionTotalCap, 600_000, "session_total_cap"],
      [`session:${input.identity.sessionId}:all`, this.config.sessionTotalHourlyCap, 3_600_000, "session_total_cap"]
    ];
    if (input.identity.ip) policies.push(
      [`ip:${input.identity.ip}:classification`, this.config.ipClassificationCap, 600_000, "ip_classification_cap"],
      [`ip:${input.identity.ip}:classification`, this.config.ipClassificationHourlyCap, 3_600_000, "ip_classification_cap"],
      [`ip:${input.identity.ip}:all`, this.config.ipTotalCap, 600_000, "ip_total_cap"],
      [`ip:${input.identity.ip}:all`, this.config.ipTotalHourlyCap, 3_600_000, "ip_total_cap"]
    );

    const blocked = policies.flatMap(([key, limit, windowMs, reason]) => {
      const history = (this.attempts.get(key) ?? []).filter((at) => at > now - windowMs);
      this.attempts.set(key, history);
      return history.length >= limit ? [{ reason, retryAfterSeconds: Math.max(1, Math.ceil((history[0] + windowMs - now) / 1000)) }] : [];
    });
    if (blocked.length) {
      const retryAfterSeconds = Math.max(...blocked.map((item) => item.retryAfterSeconds));
      return { allowed: false, reason: blocked[0].reason, retryAfterSeconds };
    }

    for (const key of new Set(policies.map(([key]) => key))) this.attempts.set(key, [...(this.attempts.get(key) ?? []), now]);
    return { allowed: true };
  }
}

export type ControlledClassificationResult<T> =
  | Readonly<{ kind: "executed"; value: T }>
  | Readonly<{ kind: "blocked"; decision: Exclude<ClassificationControlDecision, { allowed: true }> }>;

/** Runs the provider operation only when every applicable control grants an allowance. */
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
