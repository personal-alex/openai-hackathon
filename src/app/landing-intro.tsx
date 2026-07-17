"use client";

import { useCallback, useEffect, useState } from "react";

const firstLine = "Life doesn’t come with instructions.";
const firstLineCharacters = Array.from(firstLine.replaceAll(" ", ""));
const glyphs = "·:+×◇□△";
const revealIntervalMs = 58;
const secondLineDelayMs = 900;
const completedHoldMs = 2500;
const exitDurationMs = 420;

type LandingIntroProps = {
  onComplete: () => void;
};

function transientGlyph(index: number, tick: number) {
  return glyphs[(index * 5 + tick) % glyphs.length];
}

/** A calm first-load statement; it never supplies roadmap content or application state. */
export function LandingIntro({ onComplete }: LandingIntroProps) {
  const [revealedCharacters, setRevealedCharacters] = useState(0);
  const [glyphTick, setGlyphTick] = useState(0);
  const [phase, setPhase] = useState<"revealing" | "line_resolved" | "complete" | "leaving">("revealing");

  const leaveIntro = useCallback((immediate = false) => {
    setPhase("leaving");
    window.setTimeout(onComplete, immediate ? 120 : exitDurationMs);
  }, [onComplete]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const glyphTimer = window.setInterval(() => setGlyphTick((current) => current + 1), revealIntervalMs);
    const revealTimer = window.setInterval(() => {
      setRevealedCharacters((current) => {
        if (current >= firstLineCharacters.length) {
          window.clearInterval(revealTimer);
          setPhase("line_resolved");
          return current;
        }
        return current + 1;
      });
    }, revealIntervalMs);

    return () => {
      window.clearInterval(glyphTimer);
      window.clearInterval(revealTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase !== "line_resolved") return;
    const secondLineTimer = window.setTimeout(() => setPhase("complete"), secondLineDelayMs);
    return () => window.clearTimeout(secondLineTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete") return;
    const holdTimer = window.setTimeout(() => leaveIntro(), completedHoldMs);
    return () => window.clearTimeout(holdTimer);
  }, [leaveIntro, phase]);

  const isLineResolved = phase !== "revealing";
  const isComplete = phase === "complete" || phase === "leaving";

  return (
    <section className={`landing-intro landing-intro--${phase}`} data-testid="landing-intro" aria-labelledby="landing-intro-title">
      <div className="landing-intro__content">
        <p className="landing-intro__eyebrow">Life Navigator</p>
        <h1 id="landing-intro-title" className="landing-intro__headline">
          <span className="sr-only">Life doesn’t come with instructions. Now it does.</span>
          <span aria-hidden="true" className="landing-intro__line">
            {firstLine.split(" ").map((word, wordIndex) => {
              const startIndex = firstLine.split(" ").slice(0, wordIndex).join("").length;
              return <span className="landing-intro__word" key={`${word}-${wordIndex}`}>
                {Array.from(word).map((character, characterOffset) => {
                  const index = startIndex + characterOffset;
                  const isCurrent = index === revealedCharacters && !isLineResolved;
                  const isRevealed = index < revealedCharacters || isLineResolved;
                  return (
                    <span className={isRevealed ? "is-resolved" : isCurrent ? "is-cycling" : "is-pending"} key={`${character}-${index}`}>
                      {isRevealed ? character : isCurrent ? transientGlyph(index, glyphTick) : " "}
                    </span>
                  );
                })}
                {wordIndex < firstLine.split(" ").length - 1 ? " " : ""}
              </span>;
            })}
          </span>
          <span aria-hidden="true" data-testid="landing-intro-second-line" className={`landing-intro__second-line${isComplete ? " is-visible" : ""}`}>Now it does.</span>
        </h1>
      </div>
      <button type="button" className="landing-intro__skip" onClick={() => leaveIntro(true)}>Skip intro</button>
    </section>
  );
}
