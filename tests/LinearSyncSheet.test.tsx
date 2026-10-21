// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { LinearSyncSheet } from "@/components/LinearSyncSheet";
import { planLinearSync } from "@/lib/carryover/linearPlan";
import { replayMeetings } from "@/lib/carryover/replay";
import { initialLinearLinks, meetings } from "@/lib/seed";
it("shows review counts and confirms deliberately", async () => {
  const vs = replayMeetings(meetings, initialLinearLinks).byMeeting.m3;
  const confirm = vi.fn().mockResolvedValue({
    issues: ["ENG-201", "ENG-202", "ENG-203"],
    commented: 2,
  });
  render(
    <LinearSyncSheet
      plan={planLinearSync(vs)}
      updateCount={1}
      onConfirm={confirm}
      onClose={() => {}}
    />,
  );
  expect(
    screen.getByText("3 new · 2 already tracked · 1 update"),
  ).toBeInTheDocument();
  expect(confirm).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm sync" }));
  await waitFor(() => expect(confirm).toHaveBeenCalledTimes(1));
  expect(await screen.findByText("Sync complete")).toBeInTheDocument();
});
