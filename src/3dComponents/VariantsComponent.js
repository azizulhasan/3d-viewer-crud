// VariantsComponent.js
import React, { useState, useEffect } from "react";
import { Section } from "./Shared.js";

export const VariantsComponent = ({ variant, onUpdateVariant }) => {
  const [variants, setVariants] = useState([]);

  // Helper to always grab <model-viewer> (try id first, then fallback to first model-viewer)
  const getMV = () =>
    document.getElementById("atlas_ar_model_viewer") ||
    document.querySelector("model-viewer");

  // Load available variants when model loads (robust to "load already fired")
  useEffect(() => {
    const modelViewer = getMV();
    if (!modelViewer) return;

    const handleLoad = () => {
      const names = modelViewer.availableVariants || [];
      // console.debug("model-viewer availableVariants:", names);
      setVariants(names);
      // NOTE: we do NOT auto-change the active variant here — keep "Default" unless user picks another.
    };

    // If the model has already populated availableVariants (load happened earlier), call immediately.
    const already = modelViewer.availableVariants;
    if (Array.isArray(already) && already.length > 0) {
      handleLoad();
    } else {
      modelViewer.addEventListener("load", handleLoad);
    }

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
    };
    // onUpdateVariant is included so linter won't complain; the effect only needs to run when mounted.
  }, [onUpdateVariant]);

  // Apply selected variant whenever it changes
  useEffect(() => {
    const modelViewer = getMV();
    if (!modelViewer) return;

    // model-viewer expects `null` to mean the original/default material.
    modelViewer.variantName = !variant || variant === "default" ? null : variant;
  }, [variant]);

  return (
    <Section title="Variants" description="Switch between available material variants.">
      <div className="art-flex art-flex-wrap art-items-center art-gap-3 art-mb-3">
        <label className="art-text-sm art-flex art-items-center art-gap-2">
          Variant:
          <select
            className="art-rounded art-border art-px-2 art-py-1"
            value={variant || "default"}
            onChange={(e) => onUpdateVariant(e.target.value)}
          >
            {/* Keep "Default" option */}
            <option value="default">Default</option>

            {/* then the real variants discovered on the model */}
            {variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Section>
  );
};
