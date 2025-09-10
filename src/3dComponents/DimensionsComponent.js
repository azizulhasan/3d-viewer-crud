import React, { useState, useEffect, useCallback } from "react";

// ---------- Utility for unit conversion ----------
const convertLength = (valueInMeters, unit) => {
  switch (unit) {
    case "m":
      return valueInMeters;
    case "cm":
      return valueInMeters * 100;
    case "inch":
      return valueInMeters * 39.3701;
    default:
      return valueInMeters;
  }
};

export const DimensionsComponent = ({ 
  productModel, 
  setProductModel, 
  onUpdateDimension 
}) => {
  const [showEditor] = useState(true);

  // ---------- Dimensions Logic ----------
  const updateDimensionState = useCallback(() => {
    const modelviewer = document.getElementById("atlas_ar_model_viewer");
    if (!modelviewer) return;

    const size = modelviewer.getDimensions ? modelviewer.getDimensions() : { x: 0, y: 0, z: 0 };
    const center = modelviewer.getBoundingBoxCenter ? modelviewer.getBoundingBoxCenter() : { x: 0, y: 0, z: 0 };
    const unit = productModel.dimensions.unit;

    const width = convertLength(size.x, unit);
    const height = convertLength(size.y, unit);
    const length = convertLength(size.z, unit);

    const x2 = size.x / 2,
      y2 = size.y / 2,
      z2 = size.z / 2;

    // Define corners
    const X_A = { x: center.x - x2, y: center.y - y2, z: center.z + z2 };
    const X_B = { x: center.x + x2, y: center.y - y2, z: center.z + z2 };

    const Z_A = { x: center.x + x2, y: center.y - y2, z: center.z - z2 };
    const Z_B = { x: center.x + x2, y: center.y - y2, z: center.z + z2 };

    const Y_A = { x: center.x + x2, y: center.y - y2, z: center.z + z2 };
    const Y_B = { x: center.x + x2, y: center.y + y2, z: center.z + z2 };

    const setHS = (name, p) =>
      modelviewer.updateHotspot ? modelviewer.updateHotspot({ name, position: `${p.x} ${p.y} ${p.z}` }) : null;

    setHS("hotspot-dim-x-start", X_A);
    setHS("hotspot-dim-x-end", X_B);
    setHS("hotspot-dim-z-start", Z_A);
    setHS("hotspot-dim-z-end", Z_B);
    setHS("hotspot-dim-y-start", Y_A);
    setHS("hotspot-dim-y-end", Y_B);

    const mid = (A, B) => ({
      x: (A.x + B.x) / 2,
      y: (A.y + B.y) / 2,
      z: (A.z + B.z) / 2,
    });
    setHS("hotspot-dim-width", mid(X_A, X_B));
    setHS("hotspot-dim-length", mid(Z_A, Z_B));
    setHS("hotspot-dim-height", mid(Y_A, Y_B));

    setProductModel((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        width: { value: width, unit },
        height: { value: height, unit },
        length: { value: length, unit },
      },
    }));

    requestAnimationFrame(drawLines);
  }, [productModel.dimensions.unit, setProductModel]);

  // drawLines with clipping
  const drawLines = useCallback(() => {
    const modelviewer = document.getElementById("atlas_ar_model_viewer");
    const svgEl = document.getElementById("dimension-svg");
    const wrapperEl = document.getElementById("viewer-wrap");

    if (!modelviewer || !svgEl || !wrapperEl) return;

    const baseRect = svgEl.getBoundingClientRect();
    const modelRect = modelviewer.getBoundingClientRect();

    // Calculate the circular clipping area
    const centerX = modelRect.left + modelRect.width / 2 - baseRect.left;
    const centerY = modelRect.top + modelRect.height / 2 - baseRect.top;
    const radius = Math.min(modelRect.width, modelRect.height) / 2;

    // Update the clipping circle
    const clipCircle = document.getElementById("viewer-clip-circle");
    if (clipCircle) {
      clipCircle.setAttribute("cx", centerX);
      clipCircle.setAttribute("cy", centerY);
      clipCircle.setAttribute("r", radius);
    }

    const q = (slot) => modelviewer.querySelector(`[slot="${slot}"]`) || document.querySelector(`[slot="${slot}"]`);

    const centerOf = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - baseRect.left, y: r.top + r.height / 2 - baseRect.top };
    };

    const X0 = centerOf(q("hotspot-dim-x-start"));
    const X1 = centerOf(q("hotspot-dim-x-end"));
    const Z0 = centerOf(q("hotspot-dim-z-start"));
    const Z1 = centerOf(q("hotspot-dim-z-end"));
    const Y0 = centerOf(q("hotspot-dim-y-start"));
    const Y1 = centerOf(q("hotspot-dim-y-end"));

    const stroke = productModel.dimensions.color || "#16a5e6";

    const setLine = (id, A, B) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!(A && B)) {
        el.setAttribute("visibility", "hidden");
        return;
      }
      el.setAttribute("visibility", "visible");
      el.setAttribute("x1", String(A.x || 0));
      el.setAttribute("y1", String(A.y || 0));
      el.setAttribute("x2", String(B.x || 0));
      el.setAttribute("y2", String(B.y || 0));
      el.setAttribute("stroke", stroke);
      el.setAttribute("stroke-width", "2");
      el.setAttribute("stroke-dasharray", "6 6");
      el.setAttribute("stroke-linecap", "round");
    };

    setLine("dimension_line_x", X0, X1);
    setLine("dimension_line_z", Z0, Z1);
    setLine("dimension_line_y", Y0, Y1);
  }, [productModel.dimensions.color]);

  // Effect to handle model viewer events
  useEffect(() => {
    const modelviewer = document.getElementById("atlas_ar_model_viewer");
    if (!modelviewer) return;

    const onUpdate = () => {
      if (productModel.dimensions.show) updateDimensionState();
    };

    modelviewer.addEventListener("load", onUpdate);
    modelviewer.addEventListener("camera-change", onUpdate);
    window.addEventListener("resize", drawLines);

    if (productModel.dimensions.show) updateDimensionState();

    return () => {
      modelviewer.removeEventListener("load", onUpdate);
      modelviewer.removeEventListener("camera-change", onUpdate);
      window.removeEventListener("resize", drawLines);
    };
  }, [drawLines, updateDimensionState, productModel.dimensions.show]);

  // Effect to update dimensions when unit or show changes
  useEffect(() => {
    if (productModel.dimensions.show) {
      updateDimensionState();
    }
  }, [productModel.dimensions.unit, productModel.dimensions.show, updateDimensionState]);

  // UI handlers
  const toggleDimensions = (visible) => {
    onUpdateDimension("show", visible);
    if (visible && !productModel.dimensions.unit) {
      onUpdateDimension("unit", "cm");
    }
  };

  const handleUnitChange = (e) => {
    onUpdateDimension("unit", e.target.value);
  };

  return (
    <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4">
      <div className="art-flex art-items-center art-justify-between art-mb-4">
        <h3 className="art-font-semibold art-text-lg art-text-slate-800">Dimensions</h3>
        <div className="art-flex art-items-center art-gap-2 art-text-sm">
          <label htmlFor="unitSelect">Unit:</label>
          <select
            id="unitSelect"
            value={productModel.dimensions.unit || "cm"}
            onChange={handleUnitChange}
            className="art-border art-rounded art-px-2 art-py-1"
          >
            <option value="inch">Inch</option>
            <option value="cm">Centimeter</option>
            <option value="m">Meter</option>
          </select>
        </div>
      </div>

      {showEditor && (
        <div className="art-space-y-4">
          {/* Checkbox */}
          <label className="art-flex art-items-center art-gap-2 art-text-sm">
            <input
              type="checkbox"
              checked={productModel.dimensions.show !== false}
              onChange={(e) => toggleDimensions(e.target.checked)}
              className="art-rounded"
            />
            Show Dimensions
          </label>

          {/* Display current dimensions if available */}
          {productModel.dimensions.show && (
            <div className="art-space-y-2 art-text-sm art-text-slate-600">
              <div>Width: {productModel.dimensions.width?.value?.toFixed(2) || 0} {productModel.dimensions.width?.unit || productModel.dimensions.unit}</div>
              <div>Height: {productModel.dimensions.height?.value?.toFixed(2) || 0} {productModel.dimensions.height?.unit || productModel.dimensions.unit}</div>
              <div>Length: {productModel.dimensions.length?.value?.toFixed(2) || 0} {productModel.dimensions.length?.unit || productModel.dimensions.unit}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DimensionsComponent;