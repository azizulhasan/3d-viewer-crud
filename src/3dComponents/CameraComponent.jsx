import React from "react";
import { useState } from "react";
import { Section } from "./Shared";
import { motion } from "framer-motion";
import "@google/model-viewer";
import { MV } from "./Shared";
import { useRef } from "react";





export const CameraComponent = () => {
  const mv = useRef(null);
  const targets = [
    {
      name: "Isometric",
      target: "0m 0.05m 0m",
      orbit: "45deg 60deg 1.2m",
      fov: "35deg",
    },
    {
      name: "Front Close",
      target: "0m 0.05m 0.2m",
      orbit: "0deg 10deg 0.6m",
      fov: "30deg",
    },
    {
      name: "Top",
      target: "0m 0.2m 0m",
      orbit: "0deg 90deg 0.9m",
      fov: "45deg",
    },
    {
      name: "Side",
      target: "0.2m 0.05m 0m",
      orbit: "90deg 10deg 0.8m",
      fov: "30deg",
    },
  ];

  const flyTo = (t) => {
    const el = mv.current;
    if (!el) return;
    el.setAttribute("camera-target", t.target);
    el.setAttribute("camera-orbit", t.orbit);
    el.setAttribute("field-of-view", t.fov);
  };

  return (
    <Section
      title="Camera Fly-to"
      description="Jump the camera to preset targets/orbits."
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {targets.map((t) => (
          <button
            key={t.name}
            onClick={() => flyTo(t)}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-100 text-sm shadow-sm transition"
          >
            {t.name}
          </button>
        ))}
      </div>
      <MV ref={mv} src="/src/Components/Astronaut.glb" camera-controls auto-rotate>
        <button
          slot="hotspot-front"
          data-position="0 0.05 0.2"
          data-normal="0 1 0"
          data-visibility-attribute="visible"
          className="Hotspot"
        >
          <div>Front Target</div>
        </button>
        <button
          slot="hotspot-side"
          data-position="0.2 0.05 0"
          data-normal="0 1 0"
          data-visibility-attribute="visible"
          className="Hotspot"
        >
          <div>Side Target</div>
        </button>
      </MV>
    </Section>
  );
};