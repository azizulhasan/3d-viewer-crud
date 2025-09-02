import { useState } from "react";
import AccordionIcon from "../icons/AccordionIcon.js";
import { HotspotsComponent } from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { CameraComponent } from "./CameraComponent.js";
import { VariantsComponent } from "./VariantsComponent.js";

const AccordionComponent = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [productModel, setProductModel] = useState({
    src: '',
    alt: '',
    hotspots: [
      {
        id: "top",
        label: "Top",
        position: "0 0.2 0",
        normal: "0 1 0",
        visible: true
      },
      {
        id: "front",
        label: "Front",
        position: "0 0.05 0.15",
        normal: "0 0 1",
        visible: true
      },
      {
        id: "side",
        label: "Side",
        position: "0.15 0.05 0",
        normal: "1 0 0",
        visible: true
      }
    ],
    dimensions: {
      show: false,
      length: { value: 0, unit: 'm' },
      width: { value: 0, unit: 'm' },
      height: { value: 0, unit: 'm' },
      color: '#ff0000',
      labelBackground: '#ffffff'
    },
    camera: {
      orbit: { theta: '45deg', phi: '55deg', radius: '4m' },
      autoRotate: false,
      autoRotateDelay: 0,
      fieldOfView: '30deg',
      maxZoom: '',
      minZoom: '',
    },
    variants: [],
    currentVariant: null,
  });

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  // --- Handler functions for updating the state ---

  // FIXED: Handler for Hotspots - now accepts updates object
  const updateHotspot = (index, updates) => {
    setProductModel(prev => {
      const newHotspots = [...prev.hotspots];
      newHotspots[index] = { ...newHotspots[index], ...updates };
      return { ...prev, hotspots: newHotspots };
    });
  };

  const addHotspot = (newHotspotData) => {
    setProductModel(prev => ({
      ...prev,
      hotspots: [...prev.hotspots, newHotspotData]
    }));
  };

  const removeHotspot = (index) => {
    setProductModel(prev => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index)
    }));
  };

  // Handler for Dimensions
  const updateDimension = (field, value) => {
    setProductModel(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }));
  };

  // Handler for Camera
  const updateCameraSetting = (field, value) => {
    setProductModel(prev => ({
      ...prev,
      camera: {
        ...prev.camera,
        [field]: value
      }
    }));
  };

  // Handler for Variants
  const addVariant = () => {
    const newVariantId = `variant-${Date.now()}`;
    setProductModel(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: newVariantId,
          name: 'New Variant',
          thumbnail: '',
          properties: {}
        }
      ]
    }));
  };

  const updateVariant = (index, field, value) => {
    setProductModel(prev => {
      const newVariants = [...prev.variants];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newVariants[index][parent][child] = value;
      } else {
        newVariants[index][field] = value;
      }
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariant = (index) => {
    setProductModel(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
      currentVariant: prev.currentVariant === prev.variants[index]?.id ? null : prev.currentVariant
    }));
  };

  const selectVariant = (variantId) => {
    setProductModel(prev => ({ ...prev, currentVariant: variantId }));
  };

  // Save button handler with detailed logging
  const handleSave = () => {
    console.log("=== PRODUCT MODEL DATA ===");
    console.log("Full productModel state:", JSON.parse(JSON.stringify(productModel)));
    
    console.log("--- Hotspots Details ---");
    console.log("Number of hotspots:", productModel.hotspots.length);
    productModel.hotspots.forEach((hotspot, index) => {
      console.log(`Hotspot ${index + 1}:`, hotspot);
    });
    
    console.log("--- Dimensions ---");
    console.log("Dimensions:", productModel.dimensions);
    
    console.log("--- Camera ---");
    console.log("Camera:", productModel.camera);
    
    console.log("--- Variants ---");
    console.log("Number of variants:", productModel.variants.length);
    productModel.variants.forEach((variant, index) => {
      console.log(`Variant ${index + 1}:`, variant);
    });
    
    console.log("Currently selected variant:", productModel.currentVariant);
    console.log("=== END OF DATA ===");
    
    alert('Data has been logged to the console! Check your browser developer tools.');
  };

  return (
    <div className="art-border art-border-gray-200 art-rounded">
      {/* Hotspot Accordion */}
      <div className="art-border-b">
        <button
          type="button"
          onClick={() => toggleAccordion("hotspot")}
          className="art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100"
        >
          <span>Hotspot</span>
          <AccordionIcon status={activeAccordion === "hotspot"} />
        </button>
        {activeAccordion === "hotspot" && (
          <div className="art-p-4 art-bg-gray-50 art-text-gray-700">
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
      <div className="art-border-b">
        <button
          type="button"
          onClick={() => toggleAccordion("dimensions")}
          className="art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100"
        >
          <span>Dimensions</span>
          <AccordionIcon status={activeAccordion === "dimensions"} />
        </button>
        {activeAccordion === "dimensions" && (
          <div className="art-p-4 art-bg-gray-50 art-text-gray-700">
            <DimensionsComponent
              dimensions={productModel.dimensions}
              onUpdateDimension={updateDimension}
            />
          </div>
        )}
      </div>

      {/* Camera Accordion */}
      <div className="art-border-b">
        <button
          type="button"
          onClick={() => toggleAccordion("camera")}
          className="art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100"
        >
          <span>Camera</span>
          <AccordionIcon status={activeAccordion === "camera"} />
        </button>
        {activeAccordion === "camera" && (
          <div className="art-p-4 art-bg-gray-50 art-text-gray-700">
            <CameraComponent
              cameraSettings={productModel.camera}
              onUpdateCameraSetting={updateCameraSetting}
            />
          </div>
        )}
      </div>

      {/* Variants Accordion */}
      <div className="art-border-b">
        <button
          type="button"
          onClick={() => toggleAccordion("variants")}
          className="art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100"
        >
          <span>Variants</span>
          <AccordionIcon status={activeAccordion === "variants"} />
        </button>
        {activeAccordion === "variants" && (
          <div className="art-p-4 art-bg-gray-50 art-text-gray-700">
            <VariantsComponent
              variants={productModel.variants}
              currentVariant={productModel.currentVariant}
              onUpdateVariant={updateVariant}
              onAddVariant={addVariant}
              onRemoveVariant={removeVariant}
              onSelectVariant={selectVariant}
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="art-bg-gray-100 art-border-t art-mt-4">
        <button
          type="button"
          onClick={handleSave}
          className="art-w-full art-px-4 art-py-3 art-bg-blue-500 art-text-white art-font-medium art-rounded hover:art-bg-blue-600 art-transition-colors"
        >
          Save 
        </button>
        <p className="art-mt-2 art-text-sm art-text-gray-500 art-text-center">
          Click to verify all data is being captured correctly. Check browser console.
        </p>
      </div>
    </div>
  );
};

export default AccordionComponent;