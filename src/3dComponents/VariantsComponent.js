import React, { useState, useRef, useEffect } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";

export const VariantsComponent = ({ src }) => {
  const mvRef = useRef(null);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState("default");
  

  // Load available variants from the GLB after the model fully loads
  useEffect(() => {
    const modelViewer = mvRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      const names = modelViewer.availableVariants || [];
      setVariants(names);

      // Set default variant
      setCurrentVariant(names.length ? names[0] : "default");
    };

    modelViewer.addEventListener("load", handleLoad);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
    };
  }, [src]);

  // Apply selected variant to model-viewer
  useEffect(() => {
    const modelViewer = mvRef.current;
    if (!modelViewer) return;

    modelViewer.variantName =
      currentVariant === "default" ? null : currentVariant;
  }, [currentVariant]);

  return (
    <Section
      title="Variants & Annotations"
      description="Switch between available material variants."
    >
      <div className="art-flex art-flex-wrap art-items-center art-gap-3 art-mb-3">
        {/* Variant Selector */}
        <label className="art-text-sm art-flex art-items-center art-gap-2">
          Variant:
          <select
            className="art-rounded art-border art-px-2 art-py-1"
            value={currentVariant}
            onChange={(e) => setCurrentVariant(e.target.value)}
          >
            <option value="default">Default</option>
            {variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

      </div>

      {/* Model Viewer */}
      <MV
        ref={mvRef}
        src={src}
        id="shoe"
        camera-controls
        touch-action="pan-y"
        ar
        alt="3D Shoe Model"
      >
      </MV>
    </Section>
  );
};
