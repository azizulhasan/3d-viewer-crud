import React from "react";
import { useState, useMemo, useRef, useCallback } from "react";
import { Section } from "./Shared";
import { motion } from "framer-motion";
import "@google/model-viewer";
import { MV } from "./Shared";
import { Trash2, Plus, Edit3, Eye, EyeOff } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Panel - Hotspot Editor */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sticky top-24"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-slate-800">Hotspot Editor</h3>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              {showEditor ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {showEditor && (
            <div className="space-y-4">
              {/* Add New Hotspot */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium mb-2 text-slate-700">Add New Hotspot</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Hotspot label"
                    value={newHotspot.label}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full text-xs rounded border px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Position (x y z)"
                    value={newHotspot.position}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full text-xs rounded border px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Normal (x y z)"
                    value={newHotspot.normal}
                    onChange={(e) => setNewHotspot(prev => ({ ...prev, normal: e.target.value }))}
                    className="w-full text-xs rounded border px-2 py-1"
                  />
                  <button
                    onClick={addHotspot}
                    disabled={!newHotspot.label.trim()}
                    className="w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-1"
                  >
                    <Plus size={12} /> Add Hotspot
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tip: Click on the 3D model to auto-fill position & normal
                </p>
              </div>

              {/* Existing Hotspots */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-slate-700">
                  Existing Hotspots ({hotspots.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {hotspots.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className="border rounded-lg p-2 bg-slate-50"
                    >
                      {editingId === hotspot.id ? (
                        // Edit Mode
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={hotspot.label}
                            onChange={(e) => updateHotspot(hotspot.id, { label: e.target.value })}
                            className="w-full text-xs rounded border px-2 py-1"
                          />
                          <input
                            type="text"
                            value={hotspot.position}
                            onChange={(e) => updateHotspot(hotspot.id, { position: e.target.value })}
                            className="w-full text-xs rounded border px-2 py-1"
                            placeholder="Position (x y z)"
                          />
                          <input
                            type="text"
                            value={hotspot.normal}
                            onChange={(e) => updateHotspot(hotspot.id, { normal: e.target.value })}
                            className="w-full text-xs rounded border px-2 py-1"
                            placeholder="Normal (x y z)"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 border rounded text-xs hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-slate-800">
                              {hotspot.label}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => toggleVisibility(hotspot.id)}
                                className="p-1 hover:bg-slate-200 rounded"
                                title={hotspot.visible ? "Hide" : "Show"}
                              >
                                {hotspot.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <button
                                onClick={() => setEditingId(hotspot.id)}
                                className="p-1 hover:bg-slate-200 rounded"
                                title="Edit"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => deleteHotspot(hotspot.id)}
                                className="p-1 hover:bg-red-100 text-red-600 rounded"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            Pos: {hotspot.position}
                          </div>
                          <div className="text-xs text-slate-500">
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
                className="w-full border border-slate-300 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-100"
              >
                Reset to Default
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Panel - 3D Model Viewer */}
      <div className="lg:col-span-3">
        <Section
          title="Interactive Hotspots"
          description="Click on the model to add hotspots, or use the editor panel to customize them."
        >
          <MV 
            ref={mvRef}
            src="/src/Components/Chair.glb" 
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
                  className="Hotspot"
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