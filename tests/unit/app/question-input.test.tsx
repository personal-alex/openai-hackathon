import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { QuestionDefinition } from "@/domain-contracts";
import { QuestionInput, validateTypedAnswer } from "@/app/question-input";

const typedQuestion: QuestionDefinition = {
  id: "planning_date_question",
  factId: "planning_date",
  promptKey: "question.planning_date",
  rationaleKey: "why.planning_date",
  answerType: "string",
  allowSkip: true,
  presentation: {
    prompt: "What date should this plan consider?",
    description: "This is optional and does not create a deadline.",
    rationale: "A date can make a timing window easier to read.",
    input: { kind: "date", formatHelp: "Use YYYY-MM-DD.", validationMessage: "Enter a valid calendar date." }
  }
};

describe("catalog-driven typed question input", () => {
  it("renders the catalog label, description, optional state, and neutral skip control", () => {
    const markup = renderToStaticMarkup(createElement(QuestionInput, { question: typedQuestion, onAnswer: () => undefined }));
    expect(markup).toContain('type="date"');
    expect(markup).toContain("What date should this plan consider?");
    expect(markup).toContain("This is optional and does not create a deadline.");
    expect(markup).toContain("Use YYYY-MM-DD.");
    expect(markup).toContain("Skip for now");
    expect(markup).not.toContain("required");
  });

  it("rejects invalid typed values before context mutation and normalizes valid values", () => {
    const input = typedQuestion.presentation.input!;
    expect(validateTypedAnswer(input, "2026-02-30")).toEqual({ success: false, error: "Enter a valid calendar date." });
    expect(validateTypedAnswer(input, " 2026-07-17 ")).toEqual({ success: true, value: "2026-07-17" });
  });

  it("makes required behavior data-driven for a non-skippable input", () => {
    const requiredQuestion: QuestionDefinition = { ...typedQuestion, allowSkip: false };
    const markup = renderToStaticMarkup(createElement(QuestionInput, { question: requiredQuestion, onAnswer: () => undefined }));
    expect(markup).toContain("required");
    expect(markup).not.toContain("Skip for now");
  });

  it("keeps choice question rendering generic", () => {
    const choiceQuestion: QuestionDefinition = {
      ...typedQuestion,
      id: "planning_preference_question",
      factId: "planning_preference",
      presentation: { prompt: "Would a planning view help?", rationale: "This chooses an optional presentation path.", options: [{ label: "Yes", value: "yes" }, { label: "Not sure" }] }
    };
    const markup = renderToStaticMarkup(createElement(QuestionInput, { question: choiceQuestion, onAnswer: () => undefined }));
    expect(markup).toContain("Would a planning view help?");
    expect(markup).toContain("Yes");
    expect(markup).toContain("Not sure");
  });
});
