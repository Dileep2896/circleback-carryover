import type { Meeting, Person, RawActionItem } from "./carryover/types";
const person = (
  profileId: string,
  name: string,
  title: string,
  companyName = "Acme Robotics",
): Person => ({
  profileId,
  name,
  title,
  companyName,
  email: `${profileId}@example.test`,
});
export const people = [
  person("priya", "Priya Shah", "Head of Product"),
  person("marcus", "Marcus Lee", "Account Executive"),
  person("dana", "Dana Kim", "Engineering Lead"),
  person("sam", "Sam Ortiz", "Designer"),
  person("john", "John Appleseed", "Head of Operations", "Initech"),
];
const [priya, marcus, dana, sam, john] = people;
const descriptions: Record<string, string> = {
  pricing:
    "Include the annual volume discount and implementation fee for John’s procurement review.",
  soc: "Provide the current audit report through the approved secure document link.",
  sso: "Confirm SAML support, identity provider requirements, and the implementation estimate.",
  pilot:
    "Agree on weekly active operators and the target reduction in manual inspection time.",
  rollout:
    "Find a 45-minute slot with the operations team to plan the factory rollout.",
  usage: "Summarize weekly adoption and the most-used inspection workflows.",
  contract:
    "Check renewal language and the proposed service-level agreement with legal.",
  access:
    "Create a test environment with sample production-line data and read-only credentials.",
  mapping: "Map the factory sensor payload fields to the ingestion schema.",
  csv: "Large exports exceed the request limit; move generation into the background queue.",
  webhook:
    "Add exponential backoff and a dead-letter path after the fifth failed delivery.",
  empty:
    "Show a helpful first-run state before a workspace has its first inspection.",
  a11y: "Check focus order and visible focus states throughout the dashboard.",
  roadmap: "Share the agreed priorities and sequencing for the next quarter.",
  events: "Track the first completed inspection and dashboard invitation.",
  interview:
    "Schedule research sessions with operators who joined in the last month.",
  globex:
    "Send commercial terms for the separate warehouse automation evaluation.",
  procurement:
    "List vendor registration, security review, and purchase-order requirements.",
  demo: "Capture a short narrated product walkthrough for the customer enablement library.",
};
function raw(
  id: string,
  title: string,
  assignee: Person,
  dueDate = "2026-10-16",
): RawActionItem {
  return {
    id,
    title,
    description: descriptions[id] ?? "",
    assignee,
    dueDate,
    status: "PENDING",
  };
}
const first = [
  raw("pricing", "Send Initech the updated pricing deck", marcus, "2026-09-26"),
  raw("soc", "Share SOC 2 report with John", marcus, "2026-09-28"),
  raw("sso", "Scope SSO requirement", priya),
  raw("pilot", "Confirm Initech pilot success criteria", priya),
  raw("rollout", "Schedule Initech rollout workshop", marcus),
  raw("usage", "Review Initech usage analytics", priya),
  raw("contract", "Review Initech contract terms", marcus),
  raw("access", "Provision Initech sandbox access", dana),
  raw("mapping", "Document Initech data mapping", dana),
];
const product = [
  raw("csv", "Fix CSV export timeout", dana, "2026-10-03"),
  raw("webhook", "Open PR for webhook retries", dana),
  raw("empty", "Draft onboarding empty states", sam),
  raw("a11y", "Audit keyboard navigation", sam),
  raw("roadmap", "Publish Q4 product roadmap", priya),
  raw("events", "Instrument activation events", dana),
  raw("interview", "Recruit five usability participants", priya),
];
const repeat = (
  item: RawActionItem,
  id: string,
  overrides: Partial<RawActionItem> = {},
) => ({ ...item, id, ...overrides });
export const meetings: Meeting[] = [
  {
    id: "m1",
    title: "Initech weekly sync #1",
    date: "2026-09-23T10:00:00Z",
    duration: 32,
    seriesId: "customer",
    companyId: "initech",
    attendees: [marcus, priya, john],
    rawItems: first,
  },
  {
    id: "m2",
    title: "Product standup",
    date: "2026-09-30T09:30:00Z",
    duration: 24,
    seriesId: "product",
    companyId: "acme",
    attendees: [priya, dana, sam],
    rawItems: product,
  },
  {
    id: "m3",
    title: "Initech weekly sync #2",
    date: "2026-10-07T10:00:00Z",
    duration: 38,
    seriesId: "customer",
    companyId: "initech",
    attendees: [marcus, priya, john],
    rawItems: [
      repeat(first[0], "m3-pricing", {
        title: "Share revised pricing slides with Initech",
      }),
      repeat(first[1], "m3-soc", { title: "Send SOC 2 report to John" }),
      repeat(first[2], "m3-sso", { assignee: dana }),
      repeat(first[3], "m3-pilot"),
      repeat(first[4], "m3-rollout"),
      raw("globex", "Send Globex the pricing deck", marcus, "2026-10-12"),
      raw(
        "procurement",
        "Prepare Initech procurement checklist",
        priya,
        "2026-10-15",
      ),
      raw(
        "demo",
        "Record a walkthrough of the reporting dashboard",
        sam,
        "2026-10-16",
      ),
    ],
  },
  {
    id: "m4",
    title: "Product standup + Initech recap",
    date: "2026-10-14T09:30:00Z",
    duration: 29,
    seriesId: "product",
    companyId: "acme",
    attendees: [priya, dana, marcus],
    rawItems: [
      repeat(first[0], "m4-pricing", { title: "Pricing deck to Initech" }),
      repeat(first[1], "m4-soc", { title: "Send SOC 2 report to John" }),
      repeat(product[0], "m4-csv", {
        title: "CSV export timeout fix",
        dueDate: "2026-10-17",
      }),
      repeat(product[1], "m4-webhook", { title: "PR for webhook retries" }),
      repeat(product[2], "m4-empty"),
      repeat(product[3], "m4-a11y"),
      repeat(product[4], "m4-roadmap"),
    ],
  },
];
export const initialLinearLinks: Record<string, string> = {
  pricing: "ENG-142",
  soc: "ENG-151",
};
