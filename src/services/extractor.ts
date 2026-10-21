import type { Meeting, RawActionItem } from "@/lib/carryover/types";
export interface ActionItemExtractor {
  extract(meeting: Meeting): Promise<RawActionItem[]>;
}
// A production LLM extractor would implement this interface and validate its output.
export class SeedExtractor implements ActionItemExtractor {
  async extract(meeting: Meeting) {
    return structuredClone(meeting.rawItems);
  }
}
