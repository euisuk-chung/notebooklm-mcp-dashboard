import { useState } from "react";

export function useAutoRefresh() {
  const [enabled, setEnabled] = useState(false);
  const [intervalMs, setIntervalMs] = useState(30000);
  return { enabled, setEnabled, intervalMs, setIntervalMs };
}
