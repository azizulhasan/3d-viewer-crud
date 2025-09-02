// components/Shared.js
import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";


// =====================
// Shared UI Components
// =====================
export const Shell = ({ children }) => (
  <div className="art-min-h-screen art-bg-gradient-to-b art-from-slate-100 art-via-slate-50 art-to-white art-text-slate-800 art-font-inter">
    <header className="art-sticky art-top-0 art-z-10 art-bg-white/70 art-backdrop-blur-xl art-border-b art-shadow-sm">
      <nav className="art-max-w-6xl art-mx-auto art-px-4 art-py-4 art-flex art-items-center art-justify-between">
        <div className="art-font-bold art-text-xl art-tracking-tight art-text-slate-900">
          🚀 3D Model Viewer
        </div>
        <div className="art-flex art-flex-wrap art-gap-2 art-text-sm">
          <Tab to="/">Home</Tab>
          <Tab to="/hotspots">Hotspots</Tab>
          <Tab to="/dimensions">Dimensions</Tab>
          <Tab to="/variants">Variants</Tab>
          <Tab to="/camera">Camera</Tab>
          <Tab to="/slider">Slider</Tab>
          <Tab to="/accordion">Accordion</Tab>
          
        </div>
      </nav>
    </header>
    <main className="art-max-w-6xl art-mx-auto art-px-4 art-py-10 art-space-y-8">{children}</main>
  </div>
);

export const Tab = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `art-px-4 art-py-2 art-rounded-xl art-border art-transition-all art-duration-200 ${
        isActive
          ? " art-text-black art-border-slate-900 art-shadow-md"
          : "art-bg-white/80 hover:art-bg-slate-100 art-border-slate-300"
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
    className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-6 hover:art-shadow-lg art-transition"
  >
    <h2 className="art-text-2xl art-font-semibold art-mb-2 art-text-slate-800">{title}</h2>
    {description ? (
      <p className="art-text-sm art-text-slate-600 art-mb-4">{description}</p>
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
    <div className="art-w-full">
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
