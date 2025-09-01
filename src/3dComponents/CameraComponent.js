import React, { useRef } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";

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

  return React.createElement(
    Section,
    {
      title: "Camera Fly-to",
      description: "Jump the camera to preset targets/orbits.",
    },
    React.createElement(
      "div",
      { className: "art-flex art-flex-wrap art-gap-2 art-mb-3" },
      targets.map((t) =>
        React.createElement(
          "button",
          {
            key: t.name,
            onClick: () => flyTo(t),
            className:
              "art-px-4 art-py-2 art-rounded-xl art-border art-bg-white hover:art-bg-slate-100 art-text-sm art-shadow-sm art-transition",
          },
          t.name
        )
      )
    ),
    React.createElement(
      MV,
      {
        ref: mv,
        src: "3dModels/Astronaut.glb",
        "camera-controls": true,
        "auto-rotate": true,
      },
      React.createElement(
        "button",
        {
          slot: "hotspot-front",
          "data-position": "0 0.05 0.2",
          "data-normal": "0 1 0",
          "data-visibility-attribute": "visible",
          className: "art-Hotspot",
        },
        React.createElement("div", null, "Front Target")
      ),
      React.createElement(
        "button",
        {
          slot: "hotspot-side",
          "data-position": "0.2 0.05 0",
          "data-normal": "0 1 0",
          "data-visibility-attribute": "visible",
          className: "art-Hotspot",
        },
        React.createElement("div", null, "Side Target")
      )
    )
  );
};
