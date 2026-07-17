import { ClassifierProviderSchema, type ClassifierProvider } from "./contracts";

export type LlmConfig = {
  provider: ClassifierProvider;
  model: string;
  ollamaBaseUrl: string;
  ollamaClassifierModel: string;
  openAiClassifierModel: string;
  geminiClassifierModel: string;
  timeoutMs: number;
  maxInputChars: number;
  maxOutputTokens: number;
  maxRetries: number;
  sessionClassificationCap: number;
  sessionTotalCap: number;
};

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** All model and request policy configuration stays server-only and centralized here. */
export function getLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig {
  const provider = ClassifierProviderSchema.catch("ollama").parse(env.LLM_PROVIDER);
  const ollamaClassifierModel = env.OLLAMA_CLASSIFIER_MODEL ?? "qwen3.5:9b";
  const openAiClassifierModel = env.OPENAI_CLASSIFIER_MODEL ?? env.OPENAI_MODEL ?? "gpt-5.6";
  const geminiClassifierModel = env.GEMINI_CLASSIFIER_MODEL ?? "gemini-2.5-flash";
  const model = env.LLM_MODEL ?? (provider === "ollama" ? ollamaClassifierModel : provider === "openai" ? openAiClassifierModel : geminiClassifierModel);
  return {
    provider,
    model,
    ollamaBaseUrl: env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    ollamaClassifierModel,
    openAiClassifierModel,
    geminiClassifierModel,
    timeoutMs: positiveInt(env.LLM_TIMEOUT_MS, 10_000),
    maxInputChars: positiveInt(env.LLM_MAX_INPUT_CHARS, 2_000),
    maxOutputTokens: positiveInt(env.LLM_MAX_OUTPUT_TOKENS, 300),
    maxRetries: positiveInt(env.LLM_MAX_RETRIES, 1),
    sessionClassificationCap: positiveInt(env.LLM_SESSION_CLASSIFICATION_CAP, 3),
    sessionTotalCap: positiveInt(env.LLM_SESSION_TOTAL_CAP, 5)
  };
}
