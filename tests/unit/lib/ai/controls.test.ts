import { describe, expect, it, vi } from "vitest";
import {
  InMemoryClassificationControls,
  runWithClassificationControls,
  type ClassificationControlConfig
} from "@/lib/ai/rate-limit";
import { InMemoryClassificationTelemetry, type ClassificationTelemetryEvent } from "@/lib/ai/telemetry";

const config: ClassificationControlConfig = {
  maxInputChars: 32,
  sessionClassificationCap: 3,
  sessionClassificationHourlyCap: 6,
  sessionTotalCap: 5,
  sessionTotalHourlyCap: 10,
  ipClassificationCap: 8,
  ipClassificationHourlyCap: 16,
  ipTotalCap: 12,
  ipTotalHourlyCap: 24
};

function controls(): InMemoryClassificationControls {
  return new InMemoryClassificationControls(config);
}

describe("classification request controls", () => {
  it("stops the provider after the session classification threshold", async () => {
    const limiter = controls();
    const provider = vi.fn(async () => "classified");
    const input = { identity: { sessionId: "opaque-session", ip: "203.0.113.9" }, inputLength: 12 };

    await runWithClassificationControls(limiter, input, provider);
    await runWithClassificationControls(limiter, input, provider);
    await runWithClassificationControls(limiter, input, provider);
    const blocked = await runWithClassificationControls(limiter, input, provider);

    expect(provider).toHaveBeenCalledTimes(3);
    expect(blocked).toEqual({ kind: "blocked", decision: { allowed: false, reason: "session_classification_cap", retryAfterSeconds: 600 } });
  });

  it("rejects oversized input before it consumes an allowance", () => {
    const limiter = controls();
    const oversized = limiter.consume({ identity: { sessionId: "opaque-session", ip: "203.0.113.9" }, inputLength: 33 });
    const next = limiter.consume({ identity: { sessionId: "opaque-session", ip: "203.0.113.9" }, inputLength: 12 });

    expect(oversized).toEqual({ allowed: false, reason: "input_too_long" });
    expect(next).toEqual({ allowed: true });
  });

  it("applies an independent per-IP threshold across sessions", () => {
    const limiter = new InMemoryClassificationControls({ ...config, ipClassificationCap: 1 });
    const first = limiter.consume({ identity: { sessionId: "session-a", ip: "203.0.113.9" }, inputLength: 12 });
    const second = limiter.consume({ identity: { sessionId: "session-b", ip: "203.0.113.9" }, inputLength: 12 });

    expect(first).toEqual({ allowed: true });
    expect(second).toEqual({ allowed: false, reason: "ip_classification_cap", retryAfterSeconds: 600 });
  });

  it("restores a session allowance after the ten-minute sliding window", () => {
    let now = 0;
    const limiter = new InMemoryClassificationControls(config, () => now);
    const input = { identity: { sessionId: "opaque-session" }, inputLength: 12 };

    for (let index = 0; index < 3; index += 1) expect(limiter.consume(input)).toEqual({ allowed: true });
    expect(limiter.consume(input)).toMatchObject({ allowed: false, reason: "session_classification_cap" });
    now = 600_001;
    expect(limiter.consume(input)).toEqual({ allowed: true });
  });
});

describe("classification telemetry", () => {
  it("retains approved metadata only and never receives raw request text", () => {
    const telemetry = new InMemoryClassificationTelemetry();
    const rawRequestText = "private event statement that must never be logged";

    telemetry.record({
      requestId: "request-1",
      timestamp: "2026-07-18T12:00:00.000Z",
      operation: "classify_event",
      provider: "ollama",
      model: "qwen3.5:9b",
      latencyMs: 14,
      validationOutcome: "success",
      retryCount: 0,
      deploymentVersion: "test-sha",
      rawRequestText
    } as ClassificationTelemetryEvent & { rawRequestText: string });

    expect(JSON.stringify(telemetry.entries())).not.toContain(rawRequestText);
    expect(telemetry.entries()[0]).toEqual({
      requestId: "request-1",
      timestamp: "2026-07-18T12:00:00.000Z",
      operation: "classify_event",
      provider: "ollama",
      model: "qwen3.5:9b",
      latencyMs: 14,
      validationOutcome: "success",
      retryCount: 0,
      deploymentVersion: "test-sha"
    });
  });
});
