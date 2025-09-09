import React, { useEffect } from "react";
import { Section } from "./Shared.js";

export const CameraComponent = ({ cameraSettings, onUpdateCameraSetting }) => {
  const defaultOrbit = "45deg 60deg 1.2m";

  const targets = [
    { name: "Isometric", target: "0 0.05 0", orbit: "45deg 60deg 1.2m", fov: "35deg" },
    { name: "Front Close", target: "0 0.05 0.2", orbit: "0deg 10deg 0.6m", fov: "30deg" },
    { name: "Top", target: "0 0.2 0", orbit: "0deg 90deg 0.9m", fov: "45deg" },
    { name: "Side", target: "0.2 0.05 0", orbit: "90deg 10deg 0.8m", fov: "30deg" },
  ];

  const getMV = () => document.getElementById("atlas_ar_model_viewer");

  const flyTo = (t) => {
    const el = getMV();
    if (!el) return;
    el.setAttribute("camera-target", t.target);
    el.setAttribute("camera-orbit", t.orbit);
    el.setAttribute("field-of-view", t.fov);

    onUpdateCameraSetting("orbit", t.orbit);
    onUpdateCameraSetting("fieldOfView", t.fov);
  };

  const handleCameraChange = (field, value) => {
    onUpdateCameraSetting(field, value);
    const el = getMV();
    if (!el) return;

    if (field === "orbit") el.setAttribute("camera-orbit", value);
    if (field === "fieldOfView") el.setAttribute("field-of-view", value);
    if (field === "autoRotate") {
      if (value) {
        el.setAttribute("auto-rotate", "");
      } else {
        el.removeAttribute("auto-rotate");
      }
    }
  };

  // --- Sync autoRotate on initial render ---
  useEffect(() => {
    const el = getMV();
    if (!el) return;
    if (cameraSettings.autoRotate) {
      el.setAttribute("auto-rotate", "");
    } else {
      el.removeAttribute("auto-rotate");
    }
  }, [cameraSettings.autoRotate]);

  return (
    <Section title="Camera Controls" description="Adjust camera settings or jump to preset views.">
      {/* Controls */}
      <div className="art-grid art-grid-cols-2 art-gap-4 art-mb-4">
        <div className="art-flex art-items-center art-gap-2">
          <input
            type="checkbox"
            checked={cameraSettings.autoRotate || false}
            onChange={(e) => handleCameraChange("autoRotate", e.target.checked)}
            className="art-rounded"
          />
          <label className="art-text-sm">Auto Rotate</label>
        </div>

        <div>
          <label className="art-block art-text-sm art-font-medium art-mb-1">Field of View</label>
          <input
            type="range"
            min="10"
            max="100"
            value={parseInt(cameraSettings.fieldOfView) || 35}
            onChange={(e) => handleCameraChange("fieldOfView", `${e.target.value}deg`)}
            className="art-w-full"
          />
          <span className="art-text-xs">{cameraSettings.fieldOfView || "35deg"}</span>
        </div>

        <div className="art-col-span-2">
          <label className="art-block art-text-sm art-font-medium art-mb-1">Camera Orbit</label>
          <input
            type="text"
            value={cameraSettings.orbit || defaultOrbit}
            onChange={(e) => handleCameraChange("orbit", e.target.value)}
            className="art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm"
            placeholder={defaultOrbit}
          />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="art-flex art-flex-wrap art-gap-2 art-mb-4">
        {targets.map((t) => (
          <button
            key={t.name}
            onClick={() => flyTo(t)}
            className="art-px-4 art-py-2 art-rounded-xl art-border art-bg-white hover:art-bg-slate-100 art-text-sm art-shadow-sm art-transition"
          >
            {t.name}
          </button>
        ))}
      </div>
    </Section>
  );
};
