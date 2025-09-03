import React from "react";
import { useState, useRef, useCallback } from "react";
import AccordionIcon from "../activeAccordion/AccordionIcon.js";
import { HotspotsComponent } from "./HotspotsComponent.js";
import { DimensionsComponent } from "./DimensionsComponent.js";
import { CameraComponent } from "./CameraComponent.js";
import { VariantsComponent } from "./VariantsComponent.js";
import { MV } from "./Shared.js";

const AccordionComponent = () => {
  const [activeTab, setActiveTab] = useState("modelSettings");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [productModel, setProductModel] = useState({
    src: '3dModels/Shoe.glb',
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
      orbit: { theta: '45deg', phi: '60deg', radius: '1.2m' },
      autoRotate: true,
      autoRotateDelay: 0,
      fieldOfView: '30deg', 
      maxZoom: '',
      minZoom: '',
    },
    variants: [],
    currentVariant: null,
  });

  const mvRef = useRef(null);

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  // --- Handler functions for updating the state ---

  // Handler for Hotspots - now accepts updates object
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

  // Handle model click for hotspot positioning
  const handleModelClick = useCallback((event) => {
    const mv = mvRef.current;
    if (!mv || activeAccordion !== 'hotspot') return;

    const intersectionPosition = mv.positionAndNormalFromPoint(
      event.clientX, 
      event.clientY
    );
    
    if (intersectionPosition) {
      const { position, normal } = intersectionPosition;
      // This would need to be communicated back to HotspotsComponent
      // For now, we'll just log it - you might need to implement a callback system
      console.log('Model clicked at:', {
        position: `${position.x.toFixed(3)} ${position.y.toFixed(3)} ${position.z.toFixed(3)}`,
        normal: `${normal.x.toFixed(3)} ${normal.y.toFixed(3)} ${normal.z.toFixed(3)}`
      });
    }
  }, [activeAccordion]);

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

  // Slider component placeholder
  const SliderComponent = () => {
    return React.createElement('div', { className: 'art-p-4' },
      React.createElement('h3', { className: 'art-text-lg art-font-medium art-text-gray-700 art-mb-4' }, 'Slider Controls'),
      React.createElement('p', { className: 'art-text-gray-500' }, 'Slider functionality will be implemented here.')
    );
  };

  // Render the appropriate 3D model based on active accordion
  const renderModelPreview = () => {
    if (activeTab !== 'modelSettings' || !activeAccordion) {
      // Show default placeholder when no accordion is active
      return React.createElement('div', { className: 'art-text-center' },
        React.createElement('div', { className: 'art-w-96 art-h-96 art-bg-white art-rounded-lg art-shadow-lg art-border-2 art-border-dashed art-border-gray-300 art-flex art-items-center art-justify-center' },
          React.createElement('div', { className: 'art-text-gray-500' },
            React.createElement('div', { className: 'art-text-4xl art-mb-4' }, '🎨'),
            React.createElement('h3', { className: 'art-text-lg art-font-medium art-mb-2' }, '3D Model Preview'),
            React.createElement('p', { className: 'art-text-sm' }, 'Your 3D model preview will appear here')
          )
        )
      );
    }

    // Render 3D model with specific features based on active accordion
    switch (activeAccordion) {
      case 'hotspot':
        return React.createElement('div', { className: 'art-w-full art-h-full art-flex art-items-center art-justify-center' },
          React.createElement('div', { className: 'art-w-full art-max-w-2xl art-h-96' },
            React.createElement(MV, {
              ref: mvRef,
              src: productModel.src,
              poster: '',
              onClick: handleModelClick,
              className: 'art-w-full art-h-full'
            },
              // Render hotspots
              productModel.hotspots
                .filter(h => h.visible)
                .map((h) => 
                  React.createElement('button', {
                    key: h.id,
                    slot: `hotspot-${h.id}`,
                    'data-position': h.position,
                    'data-normal': h.normal,
                    'data-visibility-attribute': 'visible',
                    className: 'art-bg-blue-500 art-text-white art-px-2 art-py-1 art-rounded art-text-sm art-shadow-lg'
                  }, h.label)
                )
            )
          )
        );

      case 'dimensions':
        return React.createElement('div', { className: 'art-w-full art-h-full art-flex art-items-center art-justify-center' },
          React.createElement('div', { className: 'art-w-full art-max-w-2xl art-h-96' },
            React.createElement(MV, {
              src: productModel.src,
              poster: '',
              className: 'art-w-full art-h-full'
            },
              // Add dimension annotations if needed
              productModel.dimensions.show && React.createElement('div', {
                className: 'art-absolute art-top-4 art-left-4 art-bg-white art-p-2 art-rounded art-shadow'
              }, 
                `Dimensions: ${productModel.dimensions.length.value}${productModel.dimensions.length.unit} × ${productModel.dimensions.width.value}${productModel.dimensions.width.unit} × ${productModel.dimensions.height.value}${productModel.dimensions.height.unit}`
              )
            )
          )
        );

      case 'camera':
        return React.createElement('div', { className: 'art-w-full art-h-full art-flex art-items-center art-justify-center' },
          React.createElement('div', { className: 'art-w-full art-max-w-2xl art-h-96' },
            React.createElement(MV, {
              src: productModel.src,
              poster: '',
              'camera-orbit': `${productModel.camera.orbit.theta} ${productModel.camera.orbit.phi} ${productModel.camera.orbit.radius}`,
              'auto-rotate': productModel.camera.autoRotate,
              'auto-rotate-delay': productModel.camera.autoRotateDelay,
              'field-of-view': productModel.camera.fieldOfView,
              'max-camera-orbit': productModel.camera.maxZoom,
              'min-camera-orbit': productModel.camera.minZoom,
              className: 'art-w-full art-h-full'
            })
          )
        );

      case 'variants':
        return React.createElement('div', { className: 'art-w-full art-h-full art-flex art-items-center art-justify-center' },
          React.createElement('div', { className: 'art-w-full art-max-w-2xl art-h-96' },
            React.createElement(MV, {
              src: productModel.src,
              poster: '',
              'variant-name': productModel.currentVariant,
              className: 'art-w-full art-h-full'
            })
          )
        );

      default:
        return React.createElement('div', { className: 'art-text-center' },
          React.createElement('div', { className: 'art-w-96 art-h-96 art-bg-white art-rounded-lg art-shadow-lg art-border-2 art-border-dashed art-border-gray-300 art-flex art-items-center art-justify-center' },
            React.createElement('div', { className: 'art-text-gray-500' },
              React.createElement('div', { className: 'art-text-4xl art-mb-4' }, '🎨'),
              React.createElement('h3', { className: 'art-text-lg art-font-medium art-mb-2' }, '3D Model Preview'),
              React.createElement('p', { className: 'art-text-sm' }, 'Your 3D model preview will appear here')
            )
          )
        );
    }
  };

  return React.createElement('div', { className: 'art-flex art-h-screen art-bg-gray-50' },
    // Left Panel
    React.createElement('div', { className: 'art-w-96 art-bg-white art-border-r art-border-gray-200 art-flex art-flex-col' },
      // Tab Navigation
      React.createElement('div', { className: 'art-flex art-border-b art-border-gray-200' },
        React.createElement('button', {
          type: 'button',
          onClick: () => setActiveTab('modelSettings'),
          className: `art-flex-1 art-px-4 art-py-3 art-text-sm art-font-medium ${
            activeTab === 'modelSettings' 
              ? 'art-text-blue-600 art-border-b-2 art-border-blue-600 art-bg-blue-50' 
              : 'art-text-gray-500 hover:art-text-gray-700 hover:art-bg-gray-50'
          }`
        }, 'Model Settings'),
        React.createElement('button', {
          type: 'button',
          onClick: () => setActiveTab('slider'),
          className: `art-flex-1 art-px-4 art-py-3 art-text-sm art-font-medium ${
            activeTab === 'slider' 
              ? 'art-text-blue-600 art-border-b-2 art-border-blue-600 art-bg-blue-50' 
              : 'art-text-gray-500 hover:art-text-gray-700 hover:art-bg-gray-50'
          }`
        }, 'Slider')
      ),
      
      // Tab Content
      React.createElement('div', { className: 'art-flex-1 art-overflow-y-auto' },
        activeTab === 'modelSettings' ? 
          React.createElement('div', { className: 'art-border art-border-gray-200' },
            // Hotspot Accordion
            React.createElement('div', { className: 'art-border-b' },
              React.createElement('button', {
                type: 'button',
                onClick: () => toggleAccordion('hotspot'),
                className: 'art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100'
              },
                React.createElement('span', null, 'Hotspot'),
                React.createElement(AccordionIcon, { status: activeAccordion === 'hotspot' })
              ),
              activeAccordion === 'hotspot' && React.createElement('div', { className: 'art-p-4 art-bg-gray-50 art-text-gray-700' },
                React.createElement(HotspotsComponent, {
                  src: productModel.src,
                  hotspots: productModel.hotspots,
                  onUpdateHotspot: updateHotspot,
                  onAddHotspot: addHotspot,
                  onRemoveHotspot: removeHotspot,
                  isStandalone: false // This will use the compact version
                })
              )
            ),

            // Dimensions Accordion
            React.createElement('div', { className: 'art-border-b' },
              React.createElement('button', {
                type: 'button',
                onClick: () => toggleAccordion('dimensions'),
                className: 'art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100'
              },
                React.createElement('span', null, 'Dimensions'),
                React.createElement(AccordionIcon, { status: activeAccordion === 'dimensions' })
              ),
              activeAccordion === 'dimensions' && React.createElement('div', { className: 'art-p-4 art-bg-gray-50 art-text-gray-700' },
                React.createElement(DimensionsComponent, {
                  src: productModel.src,
                  dimensions: productModel.dimensions,
                  onUpdateDimension: updateDimension,
                  isStandalone: false
                })
              )
            ),

            // Camera Accordion
            React.createElement('div', { className: 'art-border-b' },
              React.createElement('button', {
                type: 'button',
                onClick: () => toggleAccordion('camera'),
                className: 'art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100'
              },
                React.createElement('span', null, 'Camera'),
                React.createElement(AccordionIcon, { status: activeAccordion === 'camera' })
              ),
              activeAccordion === 'camera' && React.createElement('div', { className: 'art-p-4 art-bg-gray-50 art-text-gray-700' },
                React.createElement(CameraComponent, {
                  src: productModel.src,
                  cameraSettings: productModel.camera,
                  onUpdateCameraSetting: updateCameraSetting,
                  isStandalone: false
                })
              )
            ),

            // Variants Accordion
            React.createElement('div', { className: 'art-border-b' },
              React.createElement('button', {
                type: 'button',
                onClick: () => toggleAccordion('variants'),
                className: 'art-flex art-justify-between art-items-center art-w-full art-p-4 art-font-bold art-text-gray-600 hover:art-bg-gray-100'
              },
                React.createElement('span', null, 'Variants'),
                React.createElement(AccordionIcon, { status: activeAccordion === 'variants' })
              ),
              activeAccordion === 'variants' && React.createElement('div', { className: 'art-p-4 art-bg-gray-50 art-text-gray-700' },
                
                React.createElement(VariantsComponent, {
                  src: productModel.src,
                  variants: productModel.variants,
                  currentVariant: productModel.currentVariant,
                  onUpdateVariant: updateVariant,
                  onAddVariant: addVariant,
                  onRemoveVariant: removeVariant,
                  onSelectVariant: selectVariant,
                  isStandalone: false
                })
              )
            )
          ) 
        : React.createElement(SliderComponent)
      ),
      
      
      // Save Button
      React.createElement('div', { className: 'art-p-4 art-border-t art-border-gray-200 art-bg-gray-50' },
        React.createElement('button', {
          type: 'button',
          onClick: handleSave,
          className: 'art-w-full art-px-4 art-py-3 art-bg-blue-500 art-text-white art-font-medium art-rounded hover:art-bg-blue-600 art-transition-colors'
        }, 'Save'),
        React.createElement('p', { className: 'art-mt-2 art-text-sm art-text-gray-500 art-text-center' },
          'Click to verify all data is being captured correctly. Check browser console.'
        )
      )
    ),
    
    // Right Panel - Dynamic Preview Area
    React.createElement('div', { className: 'art-flex-1 art-flex art-items-center art-justify-center art-bg-gray-100 art-p-6' },
      renderModelPreview()
    )
  );
};

export default AccordionComponent;