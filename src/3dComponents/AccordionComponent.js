import { useState, useRef, useEffect } from "react";
import AccordionIcon from "../activeAccordion/Accordion.js";
import HotspotsComponent from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { CameraComponent } from "./CameraComponent.js";
import { VariantsComponent } from "./VariantsComponent.js";
import { MV } from "./Shared.js";

const AccordionComponent = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const modelViewerRef = useRef(null);

  const [productModel, setProductModel] = useState({
    src: "3dModels/Shoe.glb",
    alt: "",
    hotspots: [
      { id: "top", label: "Top", position: "0 0.2 0", normal: "0 1 0", visible: true },
      { id: "front", label: "Front", position: "0 0.05 0.15", normal: "0 0 1", visible: true },
      { id: "side", label: "Side", position: "0.15 0.05 0", normal: "1 0 0", visible: true },
    ],
    dimensions: { show: false, length: { value: 0, unit: 'm' }, width: { value: 0, unit: 'm' }, height: { value: 0, unit: 'm' }, color: '#ff0000', labelBackground: '#ffffff' },
    camera: { orbit: { theta: '45deg', phi: '60deg', radius: '1.2m' }, autoRotate: true, autoRotateDelay: 0, fieldOfView: '30deg' },
    variants: [],
    currentVariant: null,
  });

  const toggleAccordion = (key) => setActiveAccordion((prev) => (prev === key ? null : key));

  // --- Hotspot handlers ---
  const updateHotspot = (index, updates) => {
    setProductModel(prev => {
      const newHotspots = [...prev.hotspots];
      newHotspots[index] = { ...newHotspots[index], ...updates };
      return { ...prev, hotspots: newHotspots };
    });
  };

  const addHotspot = (newHotspotData) => {
    setProductModel(prev => ({ ...prev, hotspots: [...prev.hotspots, newHotspotData] }));
  };

  const removeHotspot = (index) => {
    setProductModel(prev => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index)
    }));
  };

  // --- Click-to-add hotspot using <model-viewer> API ---
  const handle3DClick = async (event) => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const hit = await mv.positionAndNormalFromPoint(event.clientX, event.clientY);
    if (!hit) return;

    const { position, normal } = hit;

    const newHotspot = {
      id: `hotspot-${Date.now()}`,
      label: `Hotspot ${productModel.hotspots.length + 1}`,
      position: `${position.x.toFixed(3)} ${position.y.toFixed(3)} ${position.z.toFixed(3)}`,
      normal: `${normal.x.toFixed(3)} ${normal.y.toFixed(3)} ${normal.z.toFixed(3)}`,
      visible: true,
    };

    addHotspot(newHotspot);
  };

  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    mv.addEventListener("click", handle3DClick);
    return () => mv.removeEventListener("click", handle3DClick);
  }, [productModel.hotspots]);

  // --- Dimension updater ---
  const updateDimension = (key, value) => {
    setProductModel(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value }
    }));
  };


  useEffect(() => {
  const mv = modelViewerRef.current;
  if (!mv) return;

  const updateDimensions = () => {
    const size = mv.getDimensions();
    const center = mv.getBoundingBoxCenter();

    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    const positions = {
      "hotspot-dot+X-Y+Z": `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
      "hotspot-dot+X-Y-Z": `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
      "hotspot-dot+X+Y-Z": `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
      "hotspot-dot-X+Y-Z": `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
      "hotspot-dot-X-Y-Z": `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
      "hotspot-dot-X-Y+Z": `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
    };

    Object.entries(positions).forEach(([name, pos]) => mv.updateHotspot({ name, position: pos }));

    // Update parent dimension values
    setProductModel(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        width: { value: size.x, unit: "m" },
        height: { value: size.y, unit: "m" },
        length: { value: size.z, unit: "m" }
      }
    }));
  };

  mv.addEventListener("load", updateDimensions);
  mv.addEventListener("camera-change", updateDimensions);

  return () => {
    mv.removeEventListener("load", updateDimensions);
    mv.removeEventListener("camera-change", updateDimensions);
  };
}, [modelViewerRef]);


  return (
    <div className="art-w-full">
      {/* --- Top Tabs --- */}
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
        {/* LEFT: Accordions */}
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
                      src={productModel.src}
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
                      camera={productModel.camera}
                      setCamera={(cam) => setProductModel(prev => ({ ...prev, camera: cam }))}
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
                      variants={productModel.variants}
                      currentVariant={productModel.currentVariant}
                      setCurrentVariant={(v) => setProductModel(prev => ({ ...prev, currentVariant: v }))}
                      setVariants={(v) => setProductModel(prev => ({ ...prev, variants: v }))}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
{/* RIGHT: 3D Model Viewer */}
<div className="art-col-span-8 art-bg-white art-rounded-xl art-shadow-md art-p-2">
  <MV src={productModel.src} poster="" ref={modelViewerRef}>
    {/* Hotspots */}
    {productModel.hotspots.filter(h => h.visible).map(h => (
      <button
        key={h.id}
        slot={`hotspot-${h.id}`}
        data-position={h.position}
        data-normal={h.normal}
        data-visibility-attribute="visible"
        className="art-Hotspot"
      >
        <div>{h.label}</div>
      </button>
    ))}

    {/* Dimension Hotspots */}
    {productModel.dimensions.show && (
      <>
        <button slot="hotspot-dim+X-Y" className="dim">{(productModel.dimensions.width.value * 100).toFixed(0)} cm</button>
        <button slot="hotspot-dim+X-Z" className="dim">{(productModel.dimensions.height.value * 100).toFixed(0)} cm</button>
        <button slot="hotspot-dim+Y-Z" className="dim">{(productModel.dimensions.length.value * 100).toFixed(0)} cm</button>
        <button slot="hotspot-dim-X-Z" className="dim">{(productModel.dimensions.height.value * 100).toFixed(0)} cm</button>
        <button slot="hotspot-dim-X-Y" className="dim">{(productModel.dimensions.width.value * 100).toFixed(0)} cm</button>

        {/* Optional SVG Lines */}
        <svg id="dimLines" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
        </svg>
      </>
    )}
  </MV>
</div>

    </div>
    </div>
  );
};

export default AccordionComponent;
