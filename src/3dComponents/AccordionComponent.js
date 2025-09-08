import { useState, useRef, useEffect } from "react";
import AccordionIcon from "../activeAccordion/Accordion.js";
import HotspotsComponent from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { MV } from "./Shared.js";

// Utility for unit conversion
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
  const modelViewerRef = useRef(null);

  const [productModel, setProductModel] = useState({
    src: "3dModels/Shoe.glb",
    // src: "3dModels/Astronaut.glb",
    hotspots: [],
    dimensions: {
      show: false,
      length: { value: 0, unit: "m" },
      width: { value: 0, unit: "m" },
      height: { value: 0, unit: "m" },
      color: "#3b82f6",
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

  // Toggle accordion sections
  const toggleAccordion = (key) =>
    setActiveAccordion((prev) => (prev === key ? null : key));

  // Hotspot handlers
  const updateHotspot = (index, updates) => {
    setProductModel((prev) => {
      const newHotspots = [...prev.hotspots];
      // Ensure the hotspot exists and has all required properties
      if (newHotspots[index]) {
        newHotspots[index] = { 
          id: "",
          label: "",
          position: "0 0 0",
          normal: "0 0 1",
          visible: true,
          ...newHotspots[index], 
          ...updates 
        };
      }
      return { ...prev, hotspots: newHotspots };
    });
  };

  const addHotspot = (hotspotData) => {
    // Ensure all required properties are present
    const completeHotspot = {
      id: "",
      label: "",
      position: "0 0 0",
      normal: "0 0 1",
      visible: true,
      ...hotspotData
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

  // Update newHotspot from 3D click
  const handle3DClick = (event) => {
    const mv = modelViewerRef.current;
    if (!mv || !mv.positionAndNormalFromPoint) return;

    // Get 3D position & normal from click
    const hit = mv.positionAndNormalFromPoint(event.clientX, event.clientY);
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

  // Safe setter for newHotspot that ensures all properties are defined
  const setNewHotspot = (updater) => {
    setProductModel((prev) => {
      const currentNewHotspot = {
        id: "",
        label: "",
        position: "0 0 0",
        normal: "0 0 1",
        visible: true,
        ...prev.newHotspot
      };
      
      const newHotspot = typeof updater === 'function' 
        ? updater(currentNewHotspot)
        : updater;
      
      return {
        ...prev,
        newHotspot: {
          id: "",
          label: "",
          position: "0 0 0",
          normal: "0 0 1",
          visible: true,
          ...newHotspot
        }
      };
    });
  };

  // Attach click listener to model
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    mv.addEventListener("click", handle3DClick);
    return () => mv.removeEventListener("click", handle3DClick);
  }, []);

  // Dimension updates
  const updateDimension = (key, value) => {
    setProductModel((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }));
  };

  // Update 3D dimension hotspots whenever model loads or camera changes
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const updateDimensions = () => {
      const size = mv.getDimensions(); // size in meters
      const center = mv.getBoundingBoxCenter();
      const unit = productModel.dimensions.unit;

      const width = convertLength(size.x, unit);
      const height = convertLength(size.y, unit);
      const length = convertLength(size.z, unit);

      const x2 = size.x / 2,
        y2 = size.y / 2,
        z2 = size.z / 2;

      mv.updateHotspot({ name: "hotspot-dim-width", position: `${center.x + x2} ${center.y - y2} ${center.z}` });
      mv.updateHotspot({ name: "hotspot-dim-height", position: `${center.x} ${center.y + y2} ${center.z}` });
      mv.updateHotspot({ name: "hotspot-dim-length", position: `${center.x} ${center.y - y2} ${center.z + z2}` });

      setProductModel((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          width: { value: width, unit },
          height: { value: height, unit },
          length: { value: length, unit },
        },
      }));
    };

    mv.addEventListener("load", updateDimensions);
    mv.addEventListener("camera-change", updateDimensions);

    if (productModel.dimensions.show) updateDimensions();

    return () => {
      mv.removeEventListener("load", updateDimensions);
      mv.removeEventListener("camera-change", updateDimensions);
    };
  }, [modelViewerRef, productModel.dimensions.show, productModel.dimensions.unit]);

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
                      setNewHotspot={setNewHotspot}
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
        <div className="art-col-span-8 art-bg-white art-rounded-xl art-shadow-md art-p-2 relative">
          <MV src={productModel.src} poster="" ref={modelViewerRef}>
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

            {/* Dimension hotspots */}
            {productModel.dimensions.show && (
              <>
                <button slot="hotspot-dim-width" className="dim">
                  {productModel.dimensions.width.value.toFixed(2)} {productModel.dimensions.width.unit}
                </button>
                <button slot="hotspot-dim-height" className="dim">
                  {productModel.dimensions.height.value.toFixed(2)} {productModel.dimensions.height.unit}
                </button>
                <button slot="hotspot-dim-length" className="dim">
                  {productModel.dimensions.length.value.toFixed(2)} {productModel.dimensions.length.unit}
                </button>
              </>
            )}
          </MV>
        </div>
      </div>
    </div>
  );
};

export default AccordionComponent;