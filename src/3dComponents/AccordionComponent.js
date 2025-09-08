import React, { useState, useRef, useEffect, useCallback } from "react";
import AccordionIcon from "../activeAccordion/Accordion.js";
import HotspotsComponent from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { MV } from "./Shared.js";

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

  // Ref for wrapper, svg and model-viewer
  const viewerWrapRef = useRef(null);
  const modelViewerRef = useRef(null);
  const svgRef = useRef(null);

  // SVG line refs
  const lineXRef = useRef(null);
  const lineYRef = useRef(null);
  const lineZRef = useRef(null);

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
      orbit: { theta: "45deg", phi: "60deg", radius: "1.2m" },
      autoRotate: true,
      autoRotateDelay: 0,
      fieldOfView: "30deg",
    },
    newHotspot: {
      id: "",
      label: "",
      position: "0 0 0",
      normal: "0 0 1",
      visible: true,
    },
  });

  // ---------- UI helpers ----------
  const toggleAccordion = (key) =>{
    setActiveAccordion((prev) => (prev === key ? null : key));
  }

  // ---------- Hotspot CRUD ----------
  const updateHotspot = (index, updates) => {
    setProductModel((prev) => {
      const newHotspots = [...prev.hotspots];
      if (newHotspots[index]) {
        newHotspots[index] = {
          id: "",
          label: "",
          position: "0 0 0",
          normal: "0 0 1",
          visible: true,
          ...newHotspots[index],
          ...updates,
        };
      }
      return { ...prev, hotspots: newHotspots };
    });
  };

  const addHotspot = (hotspotData) => {
    const completeHotspot = {
      id: "",
      label: "",
      position: "0 0 0",
      normal: "0 0 1",
      visible: true,
      ...hotspotData,
    };

    setProductModel((prev) => ({
      ...prev,
      hotspots: [...prev.hotspots, completeHotspot],
      newHotspot: {
        id: "",
        label: "",
        position: "0 0 0",
        normal: "0 0 1",
        visible: true,
      },
    }));
  };

  const removeHotspot = (index) => {
    setProductModel((prev) => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index),
    }));
  };

  // Attach click listener to model
  useEffect(() => {
    const modelviewer = document.getElementById('atlas_ar_model_viewer')
    console.log({modelviewer});
    
    if (!modelviewer) return;
    const handle3DClick = (event) => {
      if (!modelviewer.positionAndNormalFromPoint) return;
      const hit = modelviewer.positionAndNormalFromPoint(event.clientX, event.clientY);
      if (!hit) return;
      const { position, normal } = hit;
      setProductModel((prev) => ({
        ...prev,
        newHotspot: {
          ...prev.newHotspot,
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
    const modelviewer = document.getElementById('atlas_ar_model_viewer')
    console.log({modelviewer});
    if (!modelviewer) return;

    const size = modelviewer.getDimensions ? modelviewer.getDimensions() : { x: 0, y: 0, z: 0 }; // meters
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

  // drawLines: compute coords relative to the SVG/wrapper, not relative to the model-viewer element
  const drawLines = useCallback(() => {
    const modelviewer = document.getElementById('atlas_ar_model_viewer')

    const svgEl = svgRef.current;
    const wrapperEl = viewerWrapRef.current;
    if (!modelviewer || !svgEl || !wrapperEl) return;

    // bounding rect of the container that the SVG is absolutely positioned within
    const baseRect = svgEl.getBoundingClientRect();

    // helper to find a slotted element inside model-viewer by slot name
    const q = (slot) => {
      // First try to find the slotted node inside the model-viewer light DOM
      let el = modelviewer.querySelector(`[slot="${slot}"]`);
      // fallback to searching globally (rare cases)
      if (!el) el = document.querySelector(`[slot="${slot}"]`);
      return el;
    };

    // center of an element relative to the SVG container (baseRect)
    const centerOf = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - baseRect.left,
        y: r.top + r.height / 2 - baseRect.top,
      };
    };

    const X0 = centerOf(q("hotspot-dim-x-start"));
    const X1 = centerOf(q("hotspot-dim-x-end"));
    const Z0 = centerOf(q("hotspot-dim-z-start"));
    const Z1 = centerOf(q("hotspot-dim-z-end"));
    const Y0 = centerOf(q("hotspot-dim-y-start"));
    const Y1 = centerOf(q("hotspot-dim-y-end"));

    const stroke = productModel.dimensions.color || "#16a5e6";

    const setLine = (ref, A, B) => {
      const el = ref.current;
      if (!el) return;
      if (!(A && B)) {
        el.setAttribute("visibility", "hidden");
        return;
      }
      el.setAttribute("visibility", "visible");
      // prevent NaN values
      const x1 = Number.isFinite(A.x) ? A.x : 0;
      const y1 = Number.isFinite(A.y) ? A.y : 0;
      const x2 = Number.isFinite(B.x) ? B.x : 0;
      const y2 = Number.isFinite(B.y) ? B.y : 0;

      el.setAttribute("x1", String(x1));
      el.setAttribute("y1", String(y1));
      el.setAttribute("x2", String(x2));
      el.setAttribute("y2", String(y2));
      el.setAttribute("stroke", stroke);
      el.setAttribute("stroke-width", "2");
      el.setAttribute("stroke-dasharray", "6 6");
      el.setAttribute("stroke-linecap", "round");
    };

    setLine(lineXRef, X0, X1);
    setLine(lineZRef, Z0, Z1);
    setLine(lineYRef, Y0, Y1);
  }, [productModel.dimensions.color]);

  useEffect(() => {
    const modelviewer = document.getElementById('atlas_ar_model_viewer')
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
                      onUpdateHotspot={updateHotspot}
                      onAddHotspot={addHotspot}
                      onRemoveHotspot={removeHotspot}
                      newHotspot={productModel.newHotspot}
                      setNewHotspot={(updater) =>
                        setProductModel((prev) => ({
                          ...prev,
                          newHotspot: { ...prev.newHotspot, ...updater },
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
            </>
          )}
        </div>

        {/* Right Panel */}
        <div
          ref={viewerWrapRef}
          className="art-col-span-8 art-bg-white art-rounded-xl art-shadow-md art-p-2 relative"
        >
          <MV src={productModel.src}>
            {productModel.hotspots
              .filter((h) => h && h.visible !== false)
              .map((h, index) => (
                <button
                  key={h.id || `hotspot-${index}`}
                  slot={`hotspot-${h.id || index}`}
                  data-position={h.position || "0 0 0"}
                  data-normal={h.normal || "0 0 1"}
                  data-visibility-attribute="visible"
                  className="art-Hotspot"
                >
                  <div>{h.label || `Hotspot ${index + 1}`}</div>
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

          {/* SVG overlay for dashed lines */}
          <svg
            ref={svgRef}
            className={`dimensionLineContainer ${
              productModel.dimensions.show ? "" : "hide"
            }`}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
            aria-hidden="true"
          >
            <line id="dimension_line_x" ref={lineXRef} className="dimensionLine" visibility="hidden" />
            <line id="dimension_line_z" ref={lineZRef} className="dimensionLine" visibility="hidden" />
            <line id="dimension_line_y" ref={lineYRef} className="dimensionLine" visibility="hidden" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AccordionComponent;
