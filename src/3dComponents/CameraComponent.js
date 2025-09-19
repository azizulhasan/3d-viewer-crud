import React, { useEffect, useState } from "react";
import { Section } from "./Shared.js";

export const CameraComponent = ({ cameraSettings, onUpdateCameraSetting, activeAccordion }) => {
  // const defaultOrbit = "45deg 60deg 1.2m";
  
  // State for custom hotspots
  const [customHotspots, setCustomHotspots] = useState([]);
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspot, setNewHotspot] = useState({
    name: "",
    target: "0 0.05 0",
    orbit: "45deg 60deg 1.2m",
    fov: "35deg"
  });


  useEffect(()=>{
    console.log({activeAccordion});
    
    if(activeAccordion == "camera" ){
      document.getElementById("atlas_ar_model_viewer").src= "3dModels/thor.glb"
    }

  },[activeAccordion])

  // const targets = [
  //   { name: "Isometric", target: "0 0.05 0", orbit: "45deg 60deg 1.2m", fov: "35deg" },
  //   { name: "Front Close", target: "0 0.05 0.2", orbit: "0deg 10deg 0.6m", fov: "30deg" },
  //   { name: "Top", target: "0 0.2 0", orbit: "0deg 90deg 0.9m", fov: "45deg" },
  //   { name: "Side", target: "0.2 0.05 0", orbit: "90deg 10deg 0.8m", fov: "30deg" },
  // ];

  const getMV = () => document.getElementById("atlas_ar_model_viewer");

  const flyTo = (t) => {
    const el = getMV();
    if (!el) return;
    el.setAttribute("camera-target", t.target);
    el.setAttribute("camera-orbit", t.orbit);
    el.setAttribute("field-of-view", t.fov);

    onUpdateCameraSetting("orbit", t.orbit);
    onUpdateCameraSetting("fieldOfView", t.fov);
    onUpdateCameraSetting("target", t.target);
  };

  // const handleCameraChange = (field, value) => {
  //   onUpdateCameraSetting(field, value);
  //   const el = getMV();
  //   if (!el) return;

  //   if (field === "orbit") el.setAttribute("camera-orbit", value);
  //   if (field === "fieldOfView") el.setAttribute("field-of-view", value);
  //   if (field === "target") el.setAttribute("camera-target", value);
  //   if (field === "autoRotate") {
  //     if (value) {
  //       el.setAttribute("auto-rotate", "");
  //     } else {
  //       el.removeAttribute("auto-rotate");
  //     }
  //   }
  // };

  // Capture current camera position
  const captureCurrentPosition = () => {
    const el = getMV();
    if (!el) return;
    
    // Get current camera position from model-viewer
    const currentOrbit = el.getCameraOrbit();
    const currentTarget = el.getCameraTarget();
    const currentFov = el.getFieldOfView();
    
    setNewHotspot({
      name: `Hotspot ${customHotspots.length + 1}`,
      target: `${currentTarget.x.toFixed(3)} ${currentTarget.y.toFixed(3)} ${currentTarget.z.toFixed(3)}`,
      orbit: `${(currentOrbit.theta * 180 / Math.PI).toFixed(1)}deg ${(currentOrbit.phi * 180 / Math.PI).toFixed(1)}deg ${currentOrbit.radius.toFixed(3)}m`,
      fov: `${(currentFov * 180 / Math.PI).toFixed(0)}deg`
    });
  };

  // Add new hotspot
  const addHotspot = () => {
    if (!newHotspot.name.trim()) return;
    
    setCustomHotspots([...customHotspots, { ...newHotspot, id: Date.now() }]);
    setNewHotspot({
      name: "",
      target: "0 0.05 0",
      orbit: "45deg 60deg 1.2m",
      fov: "35deg"
    });
    setShowAddHotspot(false);
  };

  // Delete hotspot
  const deleteHotspot = (id) => {
    setCustomHotspots(customHotspots.filter(h => h.id !== id));
  };

  // --- Sync autoRotate on initial render ---
  // useEffect(() => {
  //   const el = getMV();
  //   if (!el) return;
  //   if (cameraSettings.autoRotate) {
  //     el.setAttribute("auto-rotate", "");
  //   } else {
  //     el.removeAttribute("auto-rotate");
  //   }
  // }, [cameraSettings.autoRotate]);

  return (
    <Section title="Camera Controls" description="Make a custom hotspots and make it camera-fly to the hotspot">

      {/* Custom Hotspots */}
      <div className="art-mb-6">
        <div className="art-flex art-justify-between art-items-center art-mb-3">
          <h4 className="art-text-sm art-font-semibold">Custom Hotspots</h4>
          <button
            onClick={() => setShowAddHotspot(!showAddHotspot)}
            className="art-px-3 art-py-1 art-bg-blue-500 art-text-white art-rounded art-text-sm hover:art-bg-blue-600 art-transition"
          >
            {showAddHotspot ? "Cancel" : "+ Add Hotspot"}
          </button>
        </div>

        {/* Add Hotspot Form */}
        {showAddHotspot && (
          <div className="art-border art-rounded-lg art-p-4 art-mb-4 art-bg-gray-50">
            <div className="art-grid art-grid-cols-2 art-gap-3 art-mb-3">
              <div>
                <label className="art-block art-text-xs art-font-medium art-mb-1">Hotspot Name</label>
                <input
                  type="text"
                  value={newHotspot.name}
                  onChange={(e) => setNewHotspot({...newHotspot, name: e.target.value})}
                  placeholder="e.g., Heel Detail"
                  className="art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm"
                />
              </div>
              <div>
                <label className="art-block art-text-xs art-font-medium art-mb-1">Field of View</label>
                <input
                  type="text"
                  value={newHotspot.fov}
                  onChange={(e) => setNewHotspot({...newHotspot, fov: e.target.value})}
                  placeholder="35deg"
                  className="art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm"
                />
              </div>
              <div>
                <label className="art-block art-text-xs art-font-medium art-mb-1">Target Position</label>
                <input
                  type="text"
                  value={newHotspot.target}
                  onChange={(e) => setNewHotspot({...newHotspot, target: e.target.value})}
                  placeholder="0 0.05 0"
                  className="art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm"
                />
              </div>
              <div>
                <label className="art-block art-text-xs art-font-medium art-mb-1">Camera Orbit</label>
                <input
                  type="text"
                  value={newHotspot.orbit}
                  onChange={(e) => setNewHotspot({...newHotspot, orbit: e.target.value})}
                  placeholder="45deg 60deg 1.2m"
                  className="art-w-full art-border art-rounded art-px-2 art-py-1 art-text-sm"
                />
              </div>
            </div>
            
            <div className="art-flex art-gap-2">
              <button
                onClick={captureCurrentPosition}
                className="art-px-3 art-py-1 art-bg-green-500 art-text-white art-rounded art-text-sm hover:art-bg-green-600 art-transition"
              >
                📸 Capture Current View
              </button>
              <button
                onClick={addHotspot}
                disabled={!newHotspot.name.trim()}
                className="art-px-3 art-py-1 art-bg-blue-500 art-text-white art-rounded art-text-sm hover:art-bg-blue-600 art-transition disabled:art-opacity-50 disabled:art-cursor-not-allowed"
              >
                Add Hotspot
              </button>
            </div>
          </div>
        )}

        {/* Custom Hotspots List */}
        {customHotspots.length > 0 && (
          <div className="art-grid art-grid-cols-1 art-gap-2">
            {customHotspots.map((hotspot) => (
              <div key={hotspot.id} className="art-flex art-items-center art-gap-2 art-p-2 art-border art-rounded art-bg-blue-50">
                <button
                  onClick={() => flyTo(hotspot)}
                  className="art-flex-1 art-px-3 art-py-2 art-bg-blue-500 art-text-white art-rounded art-text-sm hover:art-bg-blue-600 art-transition art-text-left"
                >
                  {hotspot.name}
                </button>
                <button
                  onClick={() => deleteHotspot(hotspot.id)}
                  className="art-px-2 art-py-2 art-bg-red-500 art-text-white art-rounded art-text-sm hover:art-bg-red-600 art-transition"
                  title="Delete hotspot"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {customHotspots.length === 0 && !showAddHotspot && (
          <p className="art-text-sm art-text-gray-500 art-italic">No custom hotspots yet. Click "Add Hotspot" to create one!</p>
        )}
      </div>

      {/* Instructions */}
      <div className="art-bg-blue-50 art-p-3 art-rounded-lg art-text-sm">
        <h5 className="art-font-semibold art-mb-2">How to create hotspots:</h5>
        <ol className="art-list-decimal art-list-inside art-space-y-1 art-text-blue-800">
          <li>Navigate to the desired camera position using mouse/touch controls</li>
          <li>Click "Add Hotspot" and then "📸 Capture Current View"</li>
          <li>Give your hotspot a name and click "Add Hotspot"</li>
          <li>Click the hotspot button to fly back to that position anytime!</li>
        </ol>
      </div>
    </Section>
  );
};