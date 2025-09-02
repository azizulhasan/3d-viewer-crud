import React, { useRef } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";

export const CameraComponent = ({ cameraSettings, onUpdateCameraSetting, src}) => {
  const mv = useRef(null);

  const defaultOrbit = "45deg 90deg 10m"

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
    
    // Update the model viewer
    el.setAttribute("camera-target", t.target);
    el.setAttribute("camera-orbit", t.orbit);
    el.setAttribute("field-of-view", t.fov);
    
    // Update the parent state with the new camera settings
    onUpdateCameraSetting('orbit', t.orbit);
    onUpdateCameraSetting('fieldOfView', t.fov);
    // Note: You might want to add 'target' to your cameraSettings if needed
  };

  // Handler for manual camera setting changes
  const handleCameraChange = (field, value) => {
    onUpdateCameraSetting(field, value);
    
    // Also update the model viewer in real-time
    const el = mv.current;
    if (el) {
      if (field === 'orbit') {
        el.setAttribute("camera-orbit", value);
      } else if (field === 'fieldOfView') {
        el.setAttribute("field-of-view", value);
      } else if (field === 'autoRotate') {
        if (value) {
          el.setAttribute("auto-rotate", "");
        } else {
          el.removeAttribute("auto-rotate");
        }
      }

    }
  };

  return React.createElement(
    Section,
    {
      title: "Camera Controls",
      description: "Adjust camera settings or jump to preset views.",
    },
    // Camera Settings Controls
    React.createElement(
      "div",
      { className: "art-grid art-grid-cols-2 art-gap-4 art-mb-4" },
      // Auto Rotate
      React.createElement(
        "div",
        { className: "art-flex art-items-center art-gap-2" },
        React.createElement("input", {
          type: "checkbox",
          id: "autoRotate",
          checked: cameraSettings.autoRotate,
          onChange: (e) => handleCameraChange('autoRotate', e.target.checked),
          className: "art-rounded"
        }),
        React.createElement(
          "label",
          { htmlFor: "autoRotate", className: "art-text-sm" },
          "Auto Rotate"
        )
      ),
      // Field of View
      React.createElement(
        "div",
        null,
        React.createElement(
          "label",
          { className: "art-block art-text-sm art-font-medium art-mb-1" },
          "Field of View"
        ),
        React.createElement("input", {
          type: "range",
          min: "10",
          max: "100",
          value: parseInt(cameraSettings.fieldOfView) || 30,
          onChange: (e) => handleCameraChange('fieldOfView', `${e.target.value}deg`),
          className: "art-w-full"
        }),
        React.createElement(
          "span",
          { className: "art-text-xs" },
          cameraSettings.fieldOfView
        )
      ),
      // Camera Orbit (Manual Input)
      React.createElement(
        "div",
        { className: "art-col-span-2" },
        React.createElement(
          "label",
          { className: "art-block art-text-sm art-font-medium art-mb-1" },
          "Camera Position"
        ),
        React.createElement("input", {
          type: "text",
          value:
            typeof cameraSettings.orbit === "string" && cameraSettings.orbit.trim() !== ""
              ? cameraSettings.orbit
              : defaultOrbit,   // ✅ fallback to "45deg 90deg 10m"
          onChange: (e) => handleCameraChange("orbit", e.target.value),
          className: "art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm",
          placeholder: defaultOrbit,
        })

      )
    ),
    
    // Preset Buttons
    React.createElement(
      "div",
      { className: "art-flex art-flex-wrap art-gap-2 art-mb-4" },
      targets.map((t) =>
        React.createElement(
          "button",
          {
            key: t.name,
            onClick: () => flyTo(t),
            className: "art-px-4 art-py-2 art-rounded-xl art-border art-bg-white hover:art-bg-slate-100 art-text-sm art-shadow-sm art-transition",
          },
          t.name
        )
      )
    ),
    
    // Model Viewer
      React.createElement(MV, {
        ref: mv,
        src: src,
        "camera-controls": true,
        ...(cameraSettings.autoRotate ? { "auto-rotate": true } : {}),
        "camera-orbit":
          typeof cameraSettings.orbit === "string" && cameraSettings.orbit.trim() !== ""
            ? cameraSettings.orbit
            : defaultOrbit,   // ✅ fallback
        "field-of-view": cameraSettings.fieldOfView || "35deg",
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