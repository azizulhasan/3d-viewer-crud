import React, { useState, useEffect } from "react";
import AccordionIcon from "../activeAccordion/Accordion.js";
import HotspotsComponent from "./HotspotsComponent.js";
import DimensionsComponent from "./DimensionsComponent.js"
import { VariantsComponent } from "./VariantsComponent.js";
import { MV } from "./Shared.js";
import { CameraComponent } from "./CameraComponent.js";

const AccordionComponent = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [productModel, setProductModel] = useState({
    src: "3dModels/Shoe.glb",
    dimensions: {
      show: true,
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
    hotspots: [],
    variant: "default",
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

  // Update dimension function for DimensionsComponent
  const updateDimension = (key, value) => {
    setProductModel((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }));
  };

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
                setNewHotspot={(hs) =>
                    setProductModel((prev) => ({ ...prev, new_hotspot: hs }))
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
                      productModel={productModel}
                      setProductModel={setProductModel}
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

              {/* Variants Accordion */}
              <div className="art-border art-rounded">
                <button
                  type="button"
                  onClick={() => toggleAccordion("variants")}
                  className="art-flex art-justify-between art-items-center art-w-full art-p-3 art-font-semibold"
                >
                  <span>Variants</span>
                  <AccordionIcon status={activeAccordion === "variants"} />
                </button>

                {activeAccordion === "variants" && (
                  <div className="art-p-4 art-bg-gray-50">
                    <VariantsComponent
                      variant={productModel.variant}
                      onUpdateVariant={(val) =>
                        setProductModel((prev) => ({ ...prev, variant: val }))
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
                  key={`hotspot-${index}`}
                  slot={`hotspot-${(hotspot.label || `hs${index}`).replace(/\s+/g, "_")}`} //slot changes
                  data-position={hotspot.position || "0 0 0"}
                  data-normal={hotspot.normal || "0 0 1"}
                  className="hotspot"
                >
                  <div className='annotation'>{hotspot.label || `Hotspot ${index + 1}`}</div>
                </button>
              ))}

            {/* Dimension labels & invisible endpoints */}
            {/*{productModel.dimensions.show && (*/}
                <>
                  {/*<button slot="hotspot-dim-width" className="dim">*/}
                  {/*  {productModel.dimensions.width.value.toFixed(2)}{" "}*/}
                  {/*  {productModel.dimensions.width.unit}*/}
                  {/*</button>*/}
                  {/*<button slot="hotspot-dim-height" className="dim">*/}
                  {/*  {productModel.dimensions.height.value.toFixed(2)}{" "}*/}
                  {/*  {productModel.dimensions.height.unit}*/}
                  {/*</button>*/}
                  {/*<button slot="hotspot-dim-length" className="dim">*/}
                  {/*  {productModel.dimensions.length.value.toFixed(2)}{" "}*/}
                  {/*  {productModel.dimensions.length.unit}*/}
                  {/*</button>*/}

                  {/*<div slot="hotspot-dim-x-start" className="dot"/>*/}
                  {/*<div slot="hotspot-dim-x-end" className="dot"/>*/}
                  {/*<div slot="hotspot-dim-z-start" className="dot"/>*/}
                  {/*<div slot="hotspot-dim-z-end" className="dot"/>*/}
                  {/*<div slot="hotspot-dim-y-start" className="dot"/>*/}
                  {/*<div slot="hotspot-dim-y-end" className="dot"/>*/}
                  {/* SVG overlay for dashed lines with circular clipping */}
                  {/*<svg*/}
                  {/*    id="dimension-svg"*/}
                  {/*    className={`dimensionLineContainer ${productModel.dimensions.show ? "" : "hide"}`}*/}
                  {/*    width="100%"*/}
                  {/*    height="100%"*/}
                  {/*    style={{position: "absolute", inset: 0, pointerEvents: "none"}}*/}
                  {/*    aria-hidden="true"*/}
                  {/*>*/}
                  {/*  <defs>*/}
                  {/*    <clipPath id="viewer-clip">*/}
                  {/*      <circle id="viewer-clip-circle" cx="50%" cy="50%" r="40%"/>*/}
                  {/*    </clipPath>*/}
                  {/*  </defs>*/}
                  {/*  <g clipPath="url(#viewer-clip)">*/}
                  {/*    <line id="dimension_line_x" className="dimensionLine" visibility="hidden"/>*/}
                  {/*    <line id="dimension_line_z" className="dimensionLine" visibility="hidden"/>*/}
                  {/*    <line id="dimension_line_y" className="dimensionLine" visibility="hidden"/>*/}
                  {/*  </g>*/}
                  {/*</svg>*/}

                  <button slot="hotspot-dot+X-Y+Z" className="dot" data-position="1 -1 1" data-normal="1 0 0"></button>
                  <button slot="hotspot-dim+X-Y" className="dim" data-position="1 -1 0" data-normal="1 0 0"></button>
                  <button slot="hotspot-dot+X-Y-Z" className="dot" data-position="1 -1 -1" data-normal="1 0 0"></button>
                  <button slot="hotspot-dim+X-Z" className="dim" data-position="1 0 -1" data-normal="1 0 0"></button>
                  <button slot="hotspot-dot+X+Y-Z" className="dot" data-position="1 1 -1" data-normal="0 1 0"></button>
                  <button slot="hotspot-dim+Y-Z" className="dim" data-position="0 -1 -1" data-normal="0 1 0"></button>
                  <button slot="hotspot-dot-X+Y-Z" className="dot" data-position="-1 1 -1" data-normal="0 1 0"></button>
                  <button slot="hotspot-dim-X-Z" className="dim" data-position="-1 0 -1" data-normal="-1 0 0"></button>
                  <button slot="hotspot-dot-X-Y-Z" className="dot" data-position="-1 -1 -1" data-normal="-1 0 0"></button>
                  <button slot="hotspot-dim-X-Y" className="dim" data-position="-1 -1 0" data-normal="-1 0 0"></button>
                  <button slot="hotspot-dot-X-Y+Z" className="dot" data-position="-1 -1 1" data-normal="-1 0 0"></button>
                  <svg id="dimLines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="dimensionLineContainer">
                    <line className="dimensionLine"></line>
                    <line className="dimensionLine"></line>
                    <line className="dimensionLine"></line>
                    <line className="dimensionLine"></line>
                    <line className="dimensionLine"></line>
                  </svg>
                </>
            {/*)}*/}
          </MV>


        </div>
      </div>
    </div>
  );
};

export default AccordionComponent;