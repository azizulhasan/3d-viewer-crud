import React, { useState, useEffect, useCallback } from "react";
import AccordionIcon from "../activeAccordion/Accordion.js";
import HotspotsComponent from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { MV } from "./Shared.js";
import { CameraComponent } from "./CameraComponent.js";

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

const AccordionComponent = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [productModel, setProductModel] = useState({
    src: "3dModels/Shoe.glb",
    hotspots: [],
    dimensions: {
      show: false,
      length: { value: 0, unit: "m" },
      width: { value: 0, unit: "m" },
      height: { value: 0, unit: "m" },
      color: "#16a5e6",
      labelBackground: "#ffffff",
      unit: "m",
    },
    camera: {
      orbit: "45deg 90deg 2m",
      autoRotate: true,
      autoRotateDelay: 0,
      fieldOfView: "30deg",
    },
    new_hotspot: {
      id: "",
      label: "",
      position: "0 0 0",
      normal: "0 0 1",
      visible: true,
    },
  });

  // ---------- UI helpers ----------
  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  // Attach click listener to model
  useEffect(() => {
    const modelviewer = document.getElementById("atlas_ar_model_viewer");
    if (!modelviewer) return;

    const handle3DClick = (event) => {
      if (!modelviewer.positionAndNormalFromPoint) return;
      const hit = modelviewer.positionAndNormalFromPoint(event.clientX, event.clientY);
      if (!hit) return;
      const { position, normal } = hit;
      setProductModel((prev) => ({
        ...prev,
        new_hotspot: {
          ...prev.new_hotspot,
          position: `${position.x.toFixed(3)} ${position.y.toFixed(3)} ${position.z.toFixed(3)}`,
          normal: `${normal.x.toFixed(3)} ${normal.y.toFixed(3)} ${normal.z.toFixed(3)}`,
        },
      }));
    };

    modelviewer.addEventListener("click", handle3DClick);
    return () => modelviewer.removeEventListener("click", handle3DClick);
  }, []);

  // ---------- Dimensions ----------
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
  }, [productModel.dimensions.unit]);

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

  const updateDimension = (key, value) => {
    setProductModel((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }));
  };

  useEffect(() => {
    if (productModel.dimensions.show) {
      updateDimensionState();
    }
  }, [productModel.dimensions.unit, productModel.dimensions.show, updateDimensionState]);

  return (
    <div className="art-w-full">
      {/* Tabs */}
      <div className="art-flex art-gap-2 art-border-b art-mb-4">
        <button
          className={`art-px-4 art-py-2 ${activeTab === "settings" ? "art-border-b-2 art-border-blue-500 art-font-bold" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`art-px-4 art-py-2 ${activeTab === "slider" ? "art-border-b-2 art-border-blue-500 art-font-bold" : ""}`}
          onClick={() => setActiveTab("slider")}
        >
          Slider
        </button>
      </div>

      <div className="art-grid art-grid-cols-12 art-gap-6">
        {/* Left Panel */}
        <div className="art-col-span-4 art-space-y-2">
          {activeTab === "settings" && (
            <>
              {/* Hotspot Accordion */}
              <div className="art-border art-rounded">
                <button
                  type="button"
                  onClick={() => toggleAccordion("hotspot")}
                  className="art-flex art-justify-between art-items-center art-w-full art-p-3 art-font-semibold"
                >
                  <span>Hotspot</span>
                  <AccordionIcon status={activeAccordion === "hotspot"} />
                </button>
                {activeAccordion === "hotspot" && (
                  <div className="art-p-4 art-bg-gray-50">
                    <HotspotsComponent
                      hotspots={productModel.hotspots}
                      setProductModel={setProductModel}
                      new_hotspot={productModel.new_hotspot}
                      setNewHotspot={(updater) =>
                        setProductModel((prev) => ({
                          ...prev,
                          new_hotspot: { ...prev.new_hotspot, ...updater },
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* Dimensions Accordion */}
              <div className="art-border art-rounded">
                <button
                  type="button"
                  onClick={() => toggleAccordion("dimensions")}
                  className="art-flex art-justify-between art-items-center art-w-full art-p-3 art-font-semibold"
                >
                  <span>Dimensions</span>
                  <AccordionIcon status={activeAccordion === "dimensions"} />
                </button>
                {activeAccordion === "dimensions" && (
                  <div className="art-p-4 art-bg-gray-50">
                    <DimensionsComponent
                      dimensions={productModel.dimensions}
                      onUpdateDimension={updateDimension}
                    />
                  </div>
                )}
              </div>

                {/* Camera Accordion */}
                <div className="art-border art-rounded">
                <button
                    type="button"
                    onClick={() => toggleAccordion("camera")}
                    className="art-flex art-justify-between art-items-center art-w-full art-p-3 art-font-semibold"
                >
                    <span>Camera</span>
                    <AccordionIcon status={activeAccordion === "camera"} />
                </button>

                {activeAccordion === "camera" && (
                    <div className="art-p-4 art-bg-gray-50">
                    <CameraComponent
                        cameraSettings={productModel.camera}
                        onUpdateCameraSetting={(field, value) =>
                        setProductModel((prev) => ({
                            ...prev,
                            camera: { ...prev.camera, [field]: value },
                        }))
                        }
                    />
                    </div>
                )}
                </div>



            </>
          )}
        </div>

        {/* Right Panel */}
        <div
          id="viewer-wrap"
          className="art-col-span-8 art-bg-white art-rounded-xl art-shadow-md art-p-2 relative art-overflow-hidden"
        >
          <MV src={productModel.src}>
            {productModel.hotspots
              .filter((hotspot) => hotspot && hotspot.visible !== false)
              .map((hotspot, index) => (
                <button
                  key={hotspot.id || `hotspot-${index}`}
                  slot={`hotspot-${hotspot.id || index}`}
                  data-position={hotspot.position || "0 0 0"}
                  data-normal={hotspot.normal || "0 0 1"}
                  data-visibility-attribute="visible"
                  className="art-Hotspot"
                >
                  <div>{hotspot.label || `Hotspot ${index + 1}`}</div>
                </button>
              ))}

            {/* Dimension labels & invisible endpoints */}
            {productModel.dimensions.show && (
              <>
                <button slot="hotspot-dim-width" className="dim">
                  {productModel.dimensions.width.value.toFixed(2)}{" "}
                  {productModel.dimensions.width.unit}
                </button>
                <button slot="hotspot-dim-height" className="dim">
                  {productModel.dimensions.height.value.toFixed(2)}{" "}
                  {productModel.dimensions.height.unit}
                </button>
                <button slot="hotspot-dim-length" className="dim">
                  {productModel.dimensions.length.value.toFixed(2)}{" "}
                  {productModel.dimensions.length.unit}
                </button>

                <div slot="hotspot-dim-x-start" className="dot" />
                <div slot="hotspot-dim-x-end" className="dot" />
                <div slot="hotspot-dim-z-start" className="dot" />
                <div slot="hotspot-dim-z-end" className="dot" />
                <div slot="hotspot-dim-y-start" className="dot" />
                <div slot="hotspot-dim-y-end" className="dot" />
              </>
            )}
          </MV>

          {/* SVG overlay for dashed lines with circular clipping */}
          <svg
            id="dimension-svg"
            className={`dimensionLineContainer ${productModel.dimensions.show ? "" : "hide"}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            aria-hidden="true"
          >
            <defs>
              <clipPath id="viewer-clip">
                <circle id="viewer-clip-circle" cx="50%" cy="50%" r="40%" />
              </clipPath>
            </defs>
            <g clipPath="url(#viewer-clip)">
              <line id="dimension_line_x" className="dimensionLine" visibility="hidden" />
              <line id="dimension_line_z" className="dimensionLine" visibility="hidden" />
              <line id="dimension_line_y" className="dimensionLine" visibility="hidden" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AccordionComponent;