import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import SmoothScrollProvider from "./LenisProvider";
import {
  getGraphicsAccelerationInfo,
  getPerformanceMode,
  initializePerformanceMode,
  setPerformanceModeOverride,
} from "./utils/performanceMode";

initializePerformanceMode();

(window as typeof window & {
  __getPerformanceMode?: () => string;
  __getGraphicsAccelerationInfo?: () => unknown;
  __setPerformanceModeOverride?: (mode: "default" | "reduced" | "auto") => string;
}).__getPerformanceMode = () => getPerformanceMode();

(window as typeof window & {
  __getPerformanceMode?: () => string;
  __getGraphicsAccelerationInfo?: () => unknown;
  __setPerformanceModeOverride?: (mode: "default" | "reduced" | "auto") => string;
}).__setPerformanceModeOverride = (mode) => setPerformanceModeOverride(mode);

(window as typeof window & {
  __getPerformanceMode?: () => string;
  __getGraphicsAccelerationInfo?: () => unknown;
  __setPerformanceModeOverride?: (mode: "default" | "reduced" | "auto") => string;
}).__getGraphicsAccelerationInfo = () => getGraphicsAccelerationInfo();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SmoothScrollProvider>
        <App />
      </SmoothScrollProvider>
    </BrowserRouter>
  </React.StrictMode>
);
