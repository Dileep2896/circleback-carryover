import { expect, it } from "vitest";
import { normalize, companyEntities } from "@/lib/carryover/normalize";
it("normalizes punctuation, filler, stemming and synonyms", () => {
  expect(
    normalize("I'll share the revised pricing slides with Initech"),
  ).toEqual(normalize("Send Initech the updated pricing deck"));
  expect(normalize("Follow up on the pull request")).toEqual(
    normalize("Check in on PR"),
  );
  expect(normalize("Fix retries")).toEqual(normalize("Fix retry"));
});
it("extracts whole company entities, case insensitively", () => {
  expect(companyEntities("INITECH pricing", ["Initech", "Globex"])).toEqual([
    "initech",
  ]);
  expect(companyEntities("Globexy", ["Globex"])).toEqual([]);
});
