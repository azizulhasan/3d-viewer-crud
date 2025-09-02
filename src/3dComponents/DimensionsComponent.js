import { useState, useRef, useEffect } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";

export const DimensionsComponent = ({ dimensions, onUpdateDimension }) => {
  const [showEditor, setShowEditor] = useState(true);
  const [selectedModel, setSelectedModel] = useState("3dModels/Chair.glb");
  const [currentDimensions, setCurrentDimensions] = useState({ x: 0, y: 0, z: 0 });
  const mvRef = useRef(null);

  const models = [
    { value: "3dModels/Chair.glb", label: "Chair" },
    { value: "3dModels/Astronaut.glb", label: "Astronaut" },
    { value: "3dModels/lambo.glb", label: "Car" },
  ];

  // Initialize dimensions to show by default
  useEffect(() => {
    // Ensure dimensions.show is true by default if not already set
    if (dimensions.show === undefined) {
      onUpdateDimension('show', true);
    }
  }, []);

  // Set up model viewer after load
  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;

    const handleLoad = () => {
      const center = mv.getBoundingBoxCenter();
      const size = mv.getDimensions();
      const x2 = size.x / 2;
      const y2 = size.y / 2;
      const z2 = size.z / 2;

      setCurrentDimensions(size);

      // Update parent state with actual dimensions
      onUpdateDimension('length', { value: size.x, unit: 'm' });
      onUpdateDimension('width', { value: size.z, unit: 'm' });
      onUpdateDimension('height', { value: size.y, unit: 'm' });

      // Update all hotspot positions based on bounding box
      mv.updateHotspot({
        name: 'hotspot-dot+X-Y+Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dim+X-Y',
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
      });

      mv.updateHotspot({
        name: 'hotspot-dot+X-Y-Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dim+X-Z',
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dot+X+Y-Z',
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dim+Y-Z',
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
      });

      mv.updateHotspot({
        name: 'hotspot-dot-X+Y-Z',
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dim-X-Z',
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dot-X-Y-Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
      });

      mv.updateHotspot({
        name: 'hotspot-dim-X-Y',
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
      });

      mv.updateHotspot({
        name: 'hotspot-dot-X-Y+Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
      });

      // Update dimension labels
      const dimButtons = mv.querySelectorAll('.dim');
      if (dimButtons[0]) dimButtons[0].textContent = `${(size.z * 100).toFixed(0)} cm`;
      if (dimButtons[1]) dimButtons[1].textContent = `${(size.y * 100).toFixed(0)} cm`;
      if (dimButtons[2]) dimButtons[2].textContent = `${(size.x * 100).toFixed(0)} cm`;
      if (dimButtons[3]) dimButtons[3].textContent = `${(size.y * 100).toFixed(0)} cm`;
      if (dimButtons[4]) dimButtons[4].textContent = `${(size.z * 100).toFixed(0)} cm`;

      renderSVG();
    };

    const renderSVG = () => {
      const dimLines = mv.querySelectorAll('.dimensionLine');
      
      const drawLine = (svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) => {
        if (dotHotspot1 && dotHotspot2) {
          svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
          svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
          svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
          svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

          if (dimensionHotspot && !dimensionHotspot.facingCamera) {
            svgLine.classList.add('hide');
          } else {
            svgLine.classList.remove('hide');
          }
        }
      };

      if (dimLines.length >= 5) {
        drawLine(dimLines[0], mv.queryHotspot('hotspot-dot+X-Y+Z'), mv.queryHotspot('hotspot-dot+X-Y-Z'), mv.queryHotspot('hotspot-dim+X-Y'));
        drawLine(dimLines[1], mv.queryHotspot('hotspot-dot+X-Y-Z'), mv.queryHotspot('hotspot-dot+X+Y-Z'), mv.queryHotspot('hotspot-dim+X-Z'));
        drawLine(dimLines[2], mv.queryHotspot('hotspot-dot+X+Y-Z'), mv.queryHotspot('hotspot-dot-X+Y-Z'));
        drawLine(dimLines[3], mv.queryHotspot('hotspot-dot-X+Y-Z'), mv.queryHotspot('hotspot-dot-X-Y-Z'), mv.queryHotspot('hotspot-dim-X-Z'));
        drawLine(dimLines[4], mv.queryHotspot('hotspot-dot-X-Y-Z'), mv.queryHotspot('hotspot-dot-X-Y+Z'), mv.queryHotspot('hotspot-dim-X-Y'));
      }
    };

    mv.addEventListener('load', handleLoad);
    mv.addEventListener('camera-change', renderSVG);

    return () => {
      mv.removeEventListener('load', handleLoad);
      mv.removeEventListener('camera-change', renderSVG);
    };
  }, [selectedModel, onUpdateDimension]);

  // Toggle dimensions visibility
  const toggleDimensions = (visible) => {
    // Update parent state
    onUpdateDimension('show', visible);
    
    const mv = mvRef.current;
    if (!mv) return;

    const dimElements = [
      ...mv.querySelectorAll('button'),
      mv.querySelector('#dimLines')
    ];

    dimElements.forEach((element) => {
      if (element) {
        if (visible) {
          element.classList.remove('hide');
        } else {
          element.classList.add('hide');
        }
      }
    });
  };

  return (
    <div className="art-grid art-grid-cols-1 lg:art-grid-cols-4 art-gap-6">
      {/* Left Panel - Dimensions Editor */}
      <div className="lg:art-col-span-1">
        <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4 art-sticky art-top-24">
          <div className="art-flex art-items-center art-justify-between art-mb-4">
            <h3 className="art-font-semibold art-text-lg art-text-slate-800">
              Dimensions
            </h3>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="art-p-1 art-hover:art-bg-slate-100 art-rounded"
            >
              {showEditor ? '▼' : '▲'}
            </button>
          </div>

          {showEditor && (
            <div className="art-space-y-4">
              {/* Model Selection */}
              <div className="art-border-b art-pb-4">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Product:</h4>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Controls */}
              <div className="art-border-b art-pb-4">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Display Options</h4>
                <label className="art-flex art-items-center art-gap-2 art-text-xs">
                  <input
                    type="checkbox"
                    checked={dimensions.show !== false} // Default to true if undefined
                    onChange={(e) => toggleDimensions(e.target.checked)}
                    className="art-rounded"
                  />
                  Show Dimensions
                </label>
              </div>

              {/* Dimension Readout */}
              <div className="art-bg-slate-50 art-rounded-lg art-p-3">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Measurements</h4>
                <div className="art-space-y-1 art-text-xs">
                  <div className="art-flex art-justify-between">
                    <span className="art-text-slate-600">Width (X):</span>
                    <span className="art-font-mono art-font-semibold">{(currentDimensions.x * 100).toFixed(1)} cm</span>
                  </div>
                  <div className="art-flex art-justify-between">
                    <span className="art-text-slate-600">Height (Y):</span>
                    <span className="art-font-mono art-font-semibold">{(currentDimensions.y * 100).toFixed(1)} cm</span>
                  </div>
                  <div className="art-flex art-justify-between">
                    <span className="art-text-slate-600">Depth (Z):</span>
                    <span className="art-font-mono art-font-semibold">{(currentDimensions.z * 100).toFixed(1)} cm</span>
                  </div>
                  <hr className="art-my-2" />
                  <div className="art-flex art-justify-between art-font-semibold">
                    <span className="art-text-slate-700">Volume:</span>
                    <span className="art-font-mono">{(currentDimensions.x * currentDimensions.y * currentDimensions.z * 1000000).toFixed(0)} cm³</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="art-text-xs art-text-slate-500 art-bg-blue-50 art-border art-border-blue-200 art-rounded-lg art-p-2">
                <p className="art-mb-1">📏 <strong>Bounding Box Dimensions</strong></p>
                <p>Automatically calculated from the 3D model's actual size. Dimensions show the object's width, height, and depth with connecting lines.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - 3D Model Viewer */}
      <div className="lg:art-col-span-3">
        <Section
          title="3D Bounding Box Dimensions"
          description="Automatic dimension calculation with visual bounding box display and connecting lines."
        >
          <MV 
            ref={mvRef}
            src={selectedModel}
            camera-orbit="-30deg auto auto"
            max-camera-orbit="auto 100deg auto"
            shadow-intensity="1"
            ar
            ar-modes="webxr"
            ar-scale="fixed"
          >
            {/* Corner Dots (Hidden) */}
            <button slot="hotspot-dot+X-Y+Z" className="dot" data-position="1 -1 1" data-normal="1 0 0"></button>
            <button slot="hotspot-dot+X-Y-Z" className="dot" data-position="1 -1 -1" data-normal="1 0 0"></button>
            <button slot="hotspot-dot+X+Y-Z" className="dot" data-position="1 1 -1" data-normal="0 1 0"></button>
            <button slot="hotspot-dot-X+Y-Z" className="dot" data-position="-1 1 -1" data-normal="0 1 0"></button>
            <button slot="hotspot-dot-X-Y-Z" className="dot" data-position="-1 -1 -1" data-normal="-1 0 0"></button>
            <button slot="hotspot-dot-X-Y+Z" className="dot" data-position="-1 -1 1" data-normal="-1 0 0"></button>

            {/* Dimension Labels */}
            <button slot="hotspot-dim+X-Y" className="dim" data-position="1 -1 0" data-normal="1 0 0">
              {(currentDimensions.z * 100).toFixed(0)} cm
            </button>
            <button slot="hotspot-dim+X-Z" className="dim" data-position="1 0 -1" data-normal="1 0 0">
              {(currentDimensions.y * 100).toFixed(0)} cm
            </button>
            <button slot="hotspot-dim+Y-Z" className="dim" data-position="0 1 -1" data-normal="0 1 0">
              {(currentDimensions.x * 100).toFixed(0)} cm
            </button>
            <button slot="hotspot-dim-X-Z" className="dim" data-position="-1 0 -1" data-normal="-1 0 0">
              {(currentDimensions.y * 100).toFixed(0)} cm
            </button>
            <button slot="hotspot-dim-X-Y" className="dim" data-position="-1 -1 0" data-normal="-1 0 0">
              {(currentDimensions.z * 100).toFixed(0)} cm
            </button>

            {/* SVG Lines */}
            <svg 
              id="dimLines" 
              width="100%" 
              height="100%" 
              xmlns="http://www.w3.org/2000/svg" 
              className="dimensionLineContainer"
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
              <line className="dimensionLine"></line>
              <line className="dimensionLine"></line>
              <line className="dimensionLine"></line>
              <line className="dimensionLine"></line>
              <line className="dimensionLine"></line>
            </svg>
          </MV>
        </Section>
      </div>
    </div>
  );
};