// components/Shared.js
import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";


// =====================
// Shared UI Components
// =====================
export const Shell = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-800 font-inter">
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight text-slate-900">
          🚀 3D Model Viewer
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Tab to="/">Home</Tab>
          <Tab to="/hotspots">Hotspots</Tab>
          <Tab to="/dimensions">Dimensions</Tab>
          <Tab to="/variants">Variants</Tab>
          <Tab to="/camera">Camera</Tab>
          <Tab to="/slider">Slider</Tab>
        </div>
      </nav>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">{children}</main>
  </div>
);

export const Tab = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-xl border transition-all duration-200 ${
        isActive
          ? "bg-slate-900 text-white border-slate-900 shadow-md"
          : "bg-white/80 hover:bg-slate-100 border-slate-300"
      }`
    }
    end
  >
    {children}
  </NavLink>
);

export const Section = ({ title, children, description }) => (
  <div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition"
  >
    <h2 className="text-2xl font-semibold mb-2 text-slate-800">{title}</h2>
    {description ? (
      <p className="text-sm text-slate-600 mb-4">{description}</p>
    ) : null}
    {children}
  </div>
);

// =====================
// Reusable ModelViewer wrapper
// =====================
export const MV = React.forwardRef(function MV({ src, children, style, ...rest }, refFromProps) {
  const innerRef = useRef(null);
  useEffect(() => {
    if (!refFromProps) return;
    if (typeof refFromProps === "function") refFromProps(innerRef.current);
    else refFromProps.current = innerRef.current;
  }, [refFromProps]);
  return (
    <div className="w-full">
      <model-viewer
        ref={innerRef}
        src={src}
        ar
        camera-controls
        environment-image="neutral"
        tone-mapping="aces"
        exposure="1"
        shadow-intensity="1"
        style={{
          width: "100%",
          height: "520px",
          borderRadius: "1rem",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {children}
      </model-viewer>
    </div>
  );
});

  