import React from "react";
import { useState } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";
import { useRef, useEffect } from "react";

export const VariantsComponent = () => {
  const mvRef = useRef(null);
  const [variants, setVariants] = useState([]);
  const [current, setCurrent] = useState("");
  const [showAnno, setShowAnno] = useState(true);

  // 🚗 Lamborghini models
  const models = {
    huracan: "3dModels/apartment.glb",
    aventador: "3dModels/lambo_aventador.glb",
    urus: "3dModels/lambo_urus.glb",
  };
  const [selectedModel, setSelectedModel] = useState("huracan");

  // Detect material variants inside the current model
  useEffect(() => {
    const el = mvRef.current;
    if (!el) return;
    function onLoad() {
      const list = el.availableVariants || [];
      setVariants(list);
      if (list.length) setCurrent(list[0]);
    }
    el.addEventListener("load", onLoad);
    return () => el.removeEventListener("load", onLoad);
  }, [selectedModel]);

  // Apply material variant
  useEffect(() => {
    const el = mvRef.current;
    if (!el) return;
    if (current) el.variantName = current;
  }, [current]);

  return (
    <Section
      title="Variants & Annotations"
      description="Switch between Lamborghini models and their material variants."
    >
      <div className="art-flex art-flex-wrap art-items-center art-gap-3 art-mb-3">
        {/* Model Selector */}
        <label className="art-text-sm art-flex art-items-center art-gap-2">
          Model:
          <select
            className="art-rounded art-border art-px-2 art-py-1"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {Object.keys(models).map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </label>

        {/* Variant Selector */}
        <label className="art-text-sm art-flex art-items-center art-gap-2">
          Material Variant:
          <select
            className="art-rounded art-border art-px-2 art-py-1"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          >
            {variants.length === 0 && (
              <option value="">(no variants found)</option>
            )}
            {variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        {/* Annotation Toggle */}
        <label className="art-text-sm art-flex art-items-center art-gap-2">
          <input
            type="checkbox"
            checked={showAnno}
            onChange={(e) => setShowAnno(e.target.checked)}
          />{" "}
          Show annotations
        </label>
      </div>

      {/* Model Viewer */}
      <MV ref={mvRef} src={models[selectedModel]} reveal="interaction">
        {showAnno && (
          <>
            <button
              slot="hotspot-engine"
              data-position="0.2 0.08 0.35"
              data-normal="0 1 0"
              data-visibility-attribute="visible"
              className="art-Hotspot"
            >
              <div>Engine</div>
            </button>
            <button
              slot="hotspot-wheel"
              data-position="0.35 0.02 0.0"
              data-normal="0 1 0"
              data-visibility-attribute="visible"
              className="art-Hotspot"
            >
              <div>Wheel</div>
            </button>
          </>
        )}
      </MV>
    </Section>
  );
};
