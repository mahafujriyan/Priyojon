"use client";

import { CountdownDisplay, type CountdownPageData } from "./CountdownDisplay";
import { SecretCodeGate } from "./SecretCodeGate";

type Props = {
  accessPath: string;
  unlocked: boolean;
  data: CountdownPageData | null;
};

export function CountdownPortal({ accessPath, unlocked, data }: Props) {
  if (!unlocked || !data) {
    return <SecretCodeGate accessPath={accessPath} />;
  }

  return <CountdownDisplay data={data} />;
}
