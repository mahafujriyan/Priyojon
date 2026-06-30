"use client";

import { CountdownDisplay, type CountdownPageData } from "./CountdownDisplay";
import { SecretCodeGate } from "./SecretCodeGate";
import type { EventType } from "@/generated/prisma/client";

type Props = {
  accessPath: string;
  personName: string;
  eventType: EventType;
  unlocked: boolean;
  data: CountdownPageData | null;
};

export function CountdownPortal({
  accessPath,
  personName,
  eventType,
  unlocked,
  data,
}: Props) {
  if (!unlocked || !data) {
    return (
      <SecretCodeGate
        accessPath={accessPath}
        personName={personName}
        eventType={eventType}
      />
    );
  }

  return <CountdownDisplay data={data} />;
}
