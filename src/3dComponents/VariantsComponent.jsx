import React from "react";
import { useState } from "react";
import { Section } from "./Shared";
import { motion } from "framer-motion";
import "@google/model-viewer";
import { MV } from "./Shared";
import { useRef,useEffect } from "react";


export const VariantsComponent = () => {
  const mvRef = useRef(null);
  const [variants, setVariants] = useState([]);
  const [current, setCurrent] = useState("");
  const [showAnno, setShowAnno] = useState(true);

  // 🚗 Lamborghini models
  const models = {
    huracan: "/src/Components/apartment.glb",
    aventador: "/src/Components/lambo_aventador.glb",
    urus: "/src/Components/lambo_urus.glb",
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
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Model Selector */}
        <label className="text-sm flex items-center gap-2">
          Model:
          <select
            className="rounded border px-2 py-1"
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
        <label className="text-sm flex items-center gap-2">
          Material Variant:
          <select
            className="rounded border px-2 py-1"
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
        <label className="text-sm flex items-center gap-2">
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
              className="Hotspot"
            >
              <div>Engine</div>
            </button>
            <button
              slot="hotspot-wheel"
              data-position="0.35 0.02 0.0"
              data-normal="0 1 0"
              data-visibility-attribute="visible"
              className="Hotspot"
            >
              <div>Wheel</div>
            </button>
          </>
        )}
      </MV>
    </Section>
  );
};