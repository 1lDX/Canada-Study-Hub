import assert from "node:assert/strict";
import test from "node:test";
import { courseMatchScore, isLanguageEligible, validateLanguageScore } from "../src/lib/domain.ts";
import { createDemoState } from "../src/lib/demo-data.ts";

test("course matching and language gates stay independent", () => {
  const state = createDemoState();
  const course = state.courses[0];
  const interest = state.interests[0];
  assert.equal(courseMatchScore(course, interest), 65);
  assert.equal(isLanguageEligible(undefined, course.requiredCefr), false);
  assert.equal(
    isLanguageEligible(
      {
        id: "language",
        studentId: "student-demo",
        testType: "IELTS",
        scoreValue: 6,
        scoreScale: "0-9",
        testDate: "2026-01-01",
        proofName: "result.pdf",
        proofSize: 100,
        status: "verified",
        verifiedCefr: "B1",
        submittedAt: "2026-01-01T00:00:00Z",
      },
      course.requiredCefr,
    ),
    true,
  );
});

test("language score rules reject invalid values", () => {
  assert.equal(validateLanguageScore("IELTS", 6.3, "0-9") !== null, true);
  assert.equal(validateLanguageScore("TOEFL iBT", 5.5, "1-6"), null);
  assert.equal(validateLanguageScore("Duolingo English Test", 160, "10-160"), null);
});
