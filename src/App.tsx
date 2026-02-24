import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import MainWebsite from "./pages/MainSite";


export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<MainWebsite />} />
      </Routes>
    </div>
  );
}