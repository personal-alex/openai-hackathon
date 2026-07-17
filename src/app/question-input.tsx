"use client";

import { useId, useState, type FormEvent } from "react";
import type { FactValue, QuestionDefinition, TypedQuestionInput } from "@/domain-contracts";

export type TypedAnswerResult =
  | { success: true; value: FactValue }
  | { success: false; error: string };

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Parses catalog-defined typed input before it can update the local planning context. */
export function validateTypedAnswer(input: TypedQuestionInput, rawValue: string): TypedAnswerResult {
  const value = rawValue.trim();
  if (!value) return { success: false, error: input.validationMessage };

  if (input.kind === "text") {
    if ((input.minLength !== undefined && value.length < input.minLength) || (input.maxLength !== undefined && value.length > input.maxLength)) return { success: false, error: input.validationMessage };
    return { success: true, value };
  }

  if (input.kind === "date") {
    if (!isCalendarDate(value) || (input.min !== undefined && value < input.min) || (input.max !== undefined && value > input.max)) return { success: false, error: input.validationMessage };
    return { success: true, value };
  }

  const number = Number(value);
  if (!Number.isFinite(number) || (input.min !== undefined && number < input.min) || (input.max !== undefined && number > input.max)) return { success: false, error: input.validationMessage };
  return { success: true, value: number };
}

function inputType(input: TypedQuestionInput): "text" | "date" | "number" {
  return input.kind;
}

export function QuestionInput({ question, onAnswer }: { question: QuestionDefinition; onAnswer: (value: FactValue | undefined, label: string) => void }) {
  const { presentation } = question;
  const inputId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState<string>();

  if (presentation.options) {
    const hasExplicitUnknown = presentation.options.some((option) => option.value === undefined);
    return <div className="answer-list answer-list--replies">
      {presentation.options.map((option) => <button key={option.label} type="button" className="answer-button answer-button--reply" onClick={() => onAnswer(option.value, option.label)}>{option.label}</button>)}
      {question.allowSkip && !hasExplicitUnknown && <button type="button" className="answer-button answer-button--reply" onClick={() => onAnswer(undefined, "Skip for now")}>Skip for now</button>}
    </div>;
  }

  if (!presentation.input) return null;
  const input = presentation.input;
  const describedBy = [presentation.description ? descriptionId : undefined, input.formatHelp ? `${inputId}-help` : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateTypedAnswer(input, rawValue);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError(undefined);
    onAnswer(result.value, rawValue.trim());
  }

  return <form className="answer-list answer-list--typed-reply" onSubmit={submit} noValidate>
    {presentation.description && <p id={descriptionId}>{presentation.description}</p>}
    <label className="sr-only" htmlFor={inputId}>{presentation.prompt}</label>
    <input
      id={inputId}
      name={`answer-${question.id}`}
      type={inputType(input)}
      value={rawValue}
      onChange={(event) => { setRawValue(event.target.value); setError(undefined); }}
      placeholder={"placeholder" in input ? input.placeholder : undefined}
      min={"min" in input ? input.min : undefined}
      max={"max" in input ? input.max : undefined}
      step={input.kind === "number" ? input.step : undefined}
      required={!question.allowSkip}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    />
    {input.formatHelp && <p id={`${inputId}-help`}>{input.formatHelp}</p>}
    {error && <p id={errorId} role="alert">{error}</p>}
    <button type="submit" className="answer-button answer-button--reply">Continue</button>
    {question.allowSkip && <button type="button" className="answer-button answer-button--reply" onClick={() => onAnswer(undefined, "Skip for now")}>Skip for now</button>}
  </form>;
}
