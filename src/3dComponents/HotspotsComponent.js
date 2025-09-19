import { useEffect } from "react";
const HotspotsComponent = ({
  hotspots,
  setProductModel,
  new_hotspot,
  setNewHotspot,
  productModel
}) => {
  // ---------- Dynamic attribute functions for model-viewer ----------
  const getDataPosition = (hotspot) => {
    return hotspot.position || "0 0 0";
  };

  const getDataNormal = (hotspot) => {
    return hotspot.normal || "0 0 1";
  };

  const getDataVisibilityAttribute = (hotspot) => {
    return hotspot.visible ? "visible" : "hidden";
  };

  const getSlotName = (hotspot, index) => {
    return `hotspot-${hotspot.label?.toLowerCase().replace(/\s+/g, '-') || index}`;
  };

  // ---------- Hotspot CRUD ----------



  /* Takes a hotspotData object, ensures it has all necessary properties
   with defaults, adds it to the hotspots array, and 
   resets the new_hotspot form. */
  
  const addHotspot = (hotspotData={}) => {
    let tempProductModel = structuredClone(productModel)
      let tempHotSpots = tempProductModel.hotspots;
      console.log({tempHotSpots});
      
      const hotspotId = tempHotSpots.length+1;
      let newHotspots = {
            id:hotspotData?.id || hotspotId,
            position: hotspotData?.position|| "0 0 0",
            normal: hotspotData?.normal|| "0 0 1",
            label: hotspotData?.label|| "new hotspot "+ hotspotId
        };
      tempProductModel.hotspots = [...tempHotSpots, newHotspots]
      setProductModel(tempProductModel);
  };

  // Removes the hotspot at the specified index from the hotspots array.
  const removeHotspot = (index) => {
    setProductModel((prev) => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index),
    }));
  };

  /* Handles onChange events for inputs in the list of existing hotspots. It has 
  special logic to handle the individual x,y,z inputs and combine them back into 
  a single space-separated string for the position or normal property. 
  */
  const handleInputChange = (index, event) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;

    // if (name.startsWith("position-") || name.startsWith("normal-")) {
    //   const [typeStr, axis] = name.split("-");
    //   const currentVector = (productModel.hotspots[index][typeStr] || "0 0 0")
    //     .split(" ")
    //     .map(Number);
    //   const newVector = [...currentVector];

    //   if (axis === "x") newVector[0] = parseFloat(value) || 0;
    //   if (axis === "y") newVector[1] = parseFloat(value) || 0;
    //   if (axis === "z") newVector[2] = parseFloat(value) || 0;
    //   updates[typeStr] = newVector.join(" ");
    // }
    let tempProductModel = structuredClone(productModel)
    let currentHotspot = tempProductModel?.hotspots?.[index] 
    currentHotspot.label = value

    tempProductModel.hotspots[index] = currentHotspot
    setProductModel(tempProductModel)

        
  };


  useEffect(()=>{
    const modelviewer = document.getElementById("atlas_ar_model_viewer");

    const handle3DClick = (event, productModel) => {
      event.preventDefault()
      if (!modelviewer.positionAndNormalFromPoint) return;
      const hit = modelviewer.positionAndNormalFromPoint(event.clientX, event.clientY);
      if (!hit) return;
      const { position, normal } = hit;
      let tempProductModel = structuredClone(productModel)
      let tempHotSpots = tempProductModel.hotspots;
      const hotspotId = tempHotSpots.length+1;
        let newHotspots = {
          id: hotspotId,
            position: `${position.x.toFixed(3)} ${position.y.toFixed(3)} ${position.z.toFixed(3)}`,
            normal: `${normal.x.toFixed(3)} ${normal.y.toFixed(3)} ${normal.z.toFixed(3)}`,
            label: "new hotspot "+ hotspotId
        };
      addHotspot(newHotspots)

    };

    modelviewer.addEventListener("click", (e) => handle3DClick(e, productModel));


  },[])






  // ---------- Helper function to parse vector values ----------

  /* A simple utility to convert a space-separated string (e.g., "1 2 3") 
  into an array of numbers (e.g., [1, 2, 3]).
  This is used to populate the individual x, y, z input fields.*/
  const parseVector = (vectorStr) => {
    return (vectorStr || "0 0 0").split(" ").map(Number);
  };

  return (
    <div className="art-space-y-6">
      {/* Model Viewer Preview */}
      {/* <div className="art-border art-rounded art-p-4 art-bg-gray-100">
        <h3 className="art-text-lg art-font-semibold art-mb-2">Model Viewer Hotspots</h3>
        <div className="art-text-sm art-text-gray-600 art-mb-2">
          Generated hotspot elements for your model-viewer:
        </div> 
         <div className="art-bg-white art-p-3 art-rounded art-border art-overflow-x-auto">
          <pre className="art-text-xs">
            {hotspots.map((hotspot, index) => (
              `<button class="hotspot" slot="${getSlotName(hotspot, index)}" data-position="${getDataPosition(hotspot)}" data-normal="${getDataNormal(hotspot)}"${hotspot.visible === false ? ` data-visibility-attribute="${getDataVisibilityAttribute(hotspot)}"` : ''}></button>\n`
            )).join('')}
          </pre>
        </div>
       </div> */}

      {/* Hotspot editor panel */}
      <h3 className="art-text-lg art-font-semibold">Manage Hotspots</h3>
      <div className="art-space-y-4">
        {productModel.hotspots.map((hotspot, index) => {
          const position = parseVector(hotspot.position);
          const normal = parseVector(hotspot.normal);
          
          return (
            <div
              key={hotspot.id || index}
              className="art-border art-rounded art-p-3 art-bg-white art-relative"
            >
              <h4 className="art-font-bold">
                {hotspot.label || `Hotspot ${index + 1}`}
              </h4>
              
              <div className="art-text-xs art-text-gray-500 art-mb-2">
                Slot: {getSlotName(hotspot, index)}
              </div>

              {/* Label */}
              <div className="art-flex art-items-center art-gap-2 art-my-2">
                <label className="art-text-sm art-w-24">Label</label>
                <input
                  type="text"
                  name="label"
                  value={hotspot.label || ""}
                  onChange={(e) => handleInputChange(index, e)}
                  className="art-border art-rounded art-p-1 art-w-full"
                />
              </div>

              {/* Position inputs */}
              {/* <div className="art-my-2">
                <label className="art-text-sm art-block art-mb-1">Position (X Y Z)</label>
                <div className="art-flex art-gap-1">
                  <input
                    type="number"
                    name="position-x"
                    value={position[0] || 0}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    name="position-y"
                    value={position[1] || 0}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="Y"
                  />
                  <input
                    type="number"
                    name="position-z"
                    value={position[2] || 0}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="Z"
                  />
                </div>
              </div> 

              {/* Normal inputs */}
              {/* <div className="art-my-2">
                <label className="art-text-sm art-block art-mb-1">Normal (X Y Z)</label>
                <div className="art-flex art-gap-1">
                  <input
                    type="number"
                    name="normal-x"
                    value={normal[0] || 0}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    min="-1"
                    max="1"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    name="normal-y"
                    value={normal[1] || 0}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    min="-1"
                    max="1"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="Y"
                  />
                  <input
                    type="number"
                    name="normal-z"
                    value={normal[2] || 1}
                    onChange={(e) => handleInputChange(index, e)}
                    step="0.01"
                    min="-1"
                    max="1"
                    className="art-border art-rounded art-p-1 art-w-full"
                    placeholder="Z"
                  />
                </div>
              </div> */}

              {/* Visible toggle */}
              {/* <div className="art-flex art-items-center art-gap-2 art-my-2">
                <label className="art-text-sm art-w-24">Visible</label>
                <input
                  type="checkbox"
                  name="visible"
                  checked={hotspot.visible ?? true}
                  onChange={(e) => handleInputChange(index, e)}
                  className="art-w-4 art-h-4"
                />
              </div> */}

              <button
                onClick={() => removeHotspot(index)}
                className="art-absolute art-top-2 art-right-2 art-text-red-500 hover:art-text-red-700"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
      <button
          onClick={addHotspot}
          className="art-bg-blue-500 art-text-white art-px-4 art-py-2 art-rounded hover:art-bg-blue-600"
        >
          + Add Hotspot
        </button>
      
    </div>
  );
};

export default HotspotsComponent;