import { useState, useMemo, useRef, useCallback } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";


export const HotspotsComponent = () => {
  // Default hotspots
  const defaultHotspots = [
    { id: "top", label: "Top", position: "0 0.2 0", normal: "0 1 0", visible: true },
    { id: "front", label: "Front", position: "0 0.05 0.15", normal: "0 0 1", visible: true },
    { id: "side", label: "Side", position: "0.15 0.05 0", normal: "1 0 0", visible: true },
  ];

  const [hotspots, setHotspots] = useState(defaultHotspots);
  const [editingId, setEditingId] = useState(null);
  const [newHotspot, setNewHotspot] = useState({
    label: "",
    position: "0 0 0",
    normal: "0 1 0"
  });
  const [showEditor, setShowEditor] = useState(true);
  const mvRef = useRef(null);

  // Add new hotspot
  const addHotspot = () => {
    if (!newHotspot.label.trim()) return;
    
    const id = `hotspot_${Date.now()}`;
    setHotspots(prev => [...prev, {
      id,
      label: newHotspot.label,
      position: newHotspot.position,
      normal: newHotspot.normal,
      visible: true
    }]);
    
    setNewHotspot({ label: "", position: "0 0 0", normal: "0 1 0" });
  };

  // Delete hotspot
  const deleteHotspot = (id) => {
    setHotspots(prev => prev.filter(h => h.id !== id));
    setEditingId(null);
  };

  // Update hotspot
  const updateHotspot = (id, updates) => {
    setHotspots(prev => prev.map(h => 
      h.id === id ? { ...h, ...updates } : h
    ));
  };

  // Toggle visibility
  const toggleVisibility = (id) => {
    setHotspots(prev => prev.map(h => 
      h.id === id ? { ...h, visible: !h.visible } : h
    ));
  };

  // Click on model to add hotspot
  const handleModelClick = useCallback((event) => {
    const mv = mvRef.current;
    if (!mv) return;

    // Get intersection point from model-viewer
    const intersectionPosition = mv.positionAndNormalFromPoint(
      event.clientX, 
      event.clientY
    );
    
    if (intersectionPosition) {
      const { position, normal } = intersectionPosition;
      setNewHotspot(prev => ({
        ...prev,
        position: `${position.x.toFixed(3)} ${position.y.toFixed(3)} ${position.z.toFixed(3)}`,
        normal: `${normal.x.toFixed(3)} ${normal.y.toFixed(3)} ${normal.z.toFixed(3)}`
      }));
    }
  }, []);

  return (
    <div className="art-flex art-lg:art-grid-cols-4 art-gap-6">
      {/* Left Panel - Hotspot Editor */}
      <div className=" art-lg:art-col-span-1">
        <div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4 art-sticky art-top-24"
        >
          <div className="art-flex art-items-center art-justify-between art-mb-4">
            <h3 className="art-font-semibold art-text-lg art-text-slate-800">Hotspot Editor</h3>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="art-p-1 art-hover:art-bg-slate-100 art-rounded"
            >
            {showEditor ? 'icon' : 'iconof' }
            </button>
          </div>

          {showEditor && (
            <div className="art-space-y-4">
              {/* Add New Hotspot */}
              <div className="art-border-b art-pb-4">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Add New Hotspot</h4>
                <div className="art-space-y-2">
                  <input
                    type="text"
                    placeholder="Hotspot label"
                    value={newHotspot.label}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, label: e.target.value }))}
                    className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                  />
                  <input
                    type="text"
                    placeholder="Position (x y z)"
                    value={newHotspot.position}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, position: e.target.value }))}
                    className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                  />
                  <input
                    type="text"
                    placeholder="Normal (x y z)"
                    value={newHotspot.normal}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, normal: e.target.value }))}
                    className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                  />
                  <button
                    onClick={addHotspot}
                    disabled={!newHotspot.label.trim()}
                    className="art-w-full art-bg-blue-600 art-text-white art-px-3 art-py-1 art-rounded art-text-xs art-hover:art-bg-blue-700 art-disabled:art-bg-gray-300 art-flex art-items-center art-justify-center art-gap-1"
                  >
                 + Add Hotspot
                  </button>
                </div>
                <p className="art-text-xs art-text-slate-500 art-mt-2">
                  💡 Tip: Click on the 3D model to auto-fill position & normal
                </p>
              </div>

              {/* Existing Hotspots */}
              <div>
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">
                  Existing Hotspots ({hotspots.length})
                </h4>
                <div className="art-space-y-2 art-max-h-96 art-overflow-y-auto">
                  {hotspots.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className="art-border art-rounded-lg art-p-2 art-bg-slate-50"
                    >
                      {editingId === hotspot.id ? (
                        // Edit Mode
                        <div className="art-space-y-2">
                          <input
                            type="text"
                            value={hotspot.label}
                            onChange={(e) => updateHotspot(hotspot.id, { label: e.target.value })}
                            className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                          />
                          <input
                            type="text"
                            value={hotspot.position}
                            onChange={(e) => updateHotspot(hotspot.id, { position: e.target.value })}
                            className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                            placeholder="Position (x y z)"
                          />
                          <input
                            type="text"
                            value={hotspot.normal}
                            onChange={(e) => updateHotspot(hotspot.id, { normal: e.target.value })}
                            className="art-w-full art-text-xs art-rounded art-border art-px-2 art-py-1"
                            placeholder="Normal (x y z)"
                          />
                          <div className="art-flex art-gap-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="art-flex-1 art-bg-green-600 art-text-white art-px-2 art-py-1 art-rounded art-text-xs art-hover:art-bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="art-px-2 art-py-1 art-border art-rounded art-text-xs art-hover:art-bg-slate-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="art-flex art-items-center art-justify-between art-mb-1">
                            <span className="art-font-medium art-text-xs art-text-slate-800">
                              {hotspot.label}
                            </span>
                            <div className="art-flex art-gap-1">
                              <button
                                onClick={() => toggleVisibility(hotspot.id)}
                                className="art-p-1 art-hover:art-bg-slate-200 art-rounded"
                                title={hotspot.visible ? "Hide" : "Show"}
                              >
                                {showEditor ? 'icon' : 'iconof' }
                              </button>
                              <button
                                onClick={() => setEditingId(hotspot.id)}
                                className="art-p-1 art-hover:art-bg-slate-200 art-rounded"
                                title="Edit"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteHotspot(hotspot.id)}
                                className="art-p-1 art-hover:art-bg-red-100 art-text-red-600 art-rounded"
                                title="Delete"
                              >
                                delete
                              </button>
                            </div>
                          </div>
                          <div className="art-text-xs art-text-slate-500">
                            Pos: {hotspot.position}
                          </div>
                          <div className="art-text-xs art-text-slate-500">
                            Normal: {hotspot.normal}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setHotspots(defaultHotspots);
                  setEditingId(null);
                }}
                className="art-w-full art-border art-border-slate-300 art-text-slate-700 art-px-3 art-py-1 art-rounded art-text-xs art-hover:art-bg-slate-100"
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - 3D Model Viewer */}
      <div className="art-w-full art-lg:art-col-span-3">
        <Section
          title="Interactive Hotspots"
          description="Click on the model to add hotspots, or use the editor panel to customize them."
        >
          <MV 
            ref={mvRef}
            src="3dModels/Chair.glb" 
            poster=""
            onClick={handleModelClick}
          >
            {hotspots
              .filter(h => h.visible)
              .map((h) => (
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
          </MV>
        </Section>
      </div>
    </div>
  );
};