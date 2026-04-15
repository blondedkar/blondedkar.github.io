import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import MainWebsite from "./pages/MainSite";
import SiteProject from "./pages/SiteProject";
import RastProject from "./pages/RastProject";
import SkubalProject from "./pages/SkubalProject";
import FogBackground from "./components/FogBackground";
import GlobalChrome from "./components/GlobalChrome";
import "./transitions.css";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="relative isolate min-h-screen w-full">
      <FogBackground />
      <div className="AppTransitionShell relative z-10">
        <GlobalChrome />

        <div className="AppRouteContent">
          <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/home" element={<MainWebsite />} />
            <Route path="/SiteProject" element={<SiteProject />} />
            <Route path="/RastProject" element={<RastProject />} />
            <Route path="/SkubalProject" element={<SkubalProject />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
