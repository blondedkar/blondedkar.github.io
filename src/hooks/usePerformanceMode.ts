import { useEffect, useState } from "react";
import {
  getPerformanceMode,
  subscribeToPerformanceMode,
  type PerformanceMode
} from "../utils/performanceMode";

export function usePerformanceMode() {
  const [mode, setMode] = useState<PerformanceMode>(() => getPerformanceMode());

  useEffect(() => subscribeToPerformanceMode(setMode), []);

  return mode;
}
