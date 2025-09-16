const HotspotsComponent = ({
  hotspots,
  setProductModel,
  new_hotspot,
  setNewHotspot,
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

  // Updates a single property of an existing hotspot at a specific index.
  const updateHotspot = (index, updates) => {
    setProductModel((prev) => {
      const newHotspots = [...prev.hotspots];
      if (newHotspots[index]) {
        newHotspots[index] = {
          ...newHotspots[index],
          ...updates,
        };
      }
      return { ...prev, hotspots: newHotspots };
    });
  };



  /* Takes a hotspotData object, ensures it has all necessary properties
   with defaults, adds it to the hotspots array, and 
   resets the new_hotspot form. */
  
  const addHotspot = (hotspotData) => {
    const completeHotspot = {
      label: "",
      position: "0 0 0",
      normal: "0 0 1",
      visible: true,
      ...hotspotData,
    };

    setProductModel((prev) => ({
      ...prev,
      hotspots: [...prev.hotspots, completeHotspot],
      new_hotspot: {
        label: "",
        position: "0 0 0",
        normal: "0 0 1",
        visible: true,
      },
    }));
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
    const { name, value, type, checked } = event.target;
    const updates = { [name]: type === "checkbox" ? checked : value };

    if (name.startsWith("position-") || name.startsWith("normal-")) {
      const [typeStr, axis] = name.split("-");
      const currentVector = (hotspots[index][typeStr] || "0 0 0")
        .split(" ")
        .map(Number);
      const newVector = [...currentVector];
      if (axis === "x") newVector[0] = parseFloat(value) || 0;
      if (axis === "y") newVector[1] = parseFloat(value) || 0;
      if (axis === "z") newVector[2] = parseFloat(value) || 0;
      updates[typeStr] = newVector.join(" ");
    }

    updateHotspot(index, updates);
  };

  /* Handles onChange events for the "Add New Hotspot" form inputs. It 
  updates the new_hotspot state directly. */
  const handleNewInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name.startsWith("position-") || name.startsWith("normal-")) {
      const [typeStr, axis] = name.split("-");
      const currentVector = (new_hotspot[typeStr] || "0 0 0")
        .split(" ")
        .map(Number);
      const newVector = [...currentVector];
      if (axis === "x") newVector[0] = parseFloat(value) || 0;
      if (axis === "y") newVector[1] = parseFloat(value) || 0;
      if (axis === "z") newVector[2] = parseFloat(value) || 0;
      
      setNewHotspot({
        ...new_hotspot,
        [typeStr]: newVector.join(" "),
      });
      return;
    }

    setNewHotspot({
      ...new_hotspot,
      [name]: newValue,
    });
  };

  /* Handles the form submit event when adding a new hotspot. It performs
  validation and then calls addHotspot. */ 
  const handleAddNewHotspot = (event) => {
    event.preventDefault();

    if (!new_hotspot.label.trim()) {
      alert("Please provide Label for the hotspot");
      return;
    }

    addHotspot({
      ...new_hotspot,
      label: new_hotspot.label.trim(),
    });
  };

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
        </div> */}
        {/* <div className="art-bg-white art-p-3 art-rounded art-border art-overflow-x-auto">
          <pre className="art-text-xs">
            {hotspots.map((hotspot, index) => (
              `<button class="hotspot" slot="${getSlotName(hotspot, index)}" data-position="${getDataPosition(hotspot)}" data-normal="${getDataNormal(hotspot)}"${hotspot.visible === false ? ` data-visibility-attribute="${getDataVisibilityAttribute(hotspot)}"` : ''}></button>\n`
            )).join('')}
          </pre>
        </div> */}
      {/* </div> */}

      {/* Hotspot editor panel */}
      <h3 className="art-text-lg art-font-semibold">Manage Hotspots</h3>
      <div className="art-space-y-4">
        {hotspots.map((hotspot, index) => {
          const position = parseVector(hotspot.position);
          const normal = parseVector(hotspot.normal);
          
          return (
            <div
              key={index}
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
              </div> */}

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
              <div className="art-flex art-items-center art-gap-2 art-my-2">
                <label className="art-text-sm art-w-24">Visible</label>
                <input
                  type="checkbox"
                  name="visible"
                  checked={hotspot.visible ?? true}
                  onChange={(e) => handleInputChange(index, e)}
                  className="art-w-4 art-h-4"
                />
              </div>

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

      {/* Add new hotspot */}
      <div className="art-border art-rounded art-p-3 art-bg-gray-50">
        <h3 className="art-font-semibold art-mb-2">Add New Hotspot</h3>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Label</label>
          <input
            type="text"
            name="label"
            value={new_hotspot.label || ""}
            onChange={handleNewInputChange}
            placeholder="Enter hotspot label"
            className="art-border art-rounded art-p-1 art-w-full"
          />
        </div>

        {/* New hotspot position inputs */}
        {/* <div className="art-my-2">
          <label className="art-text-sm art-block art-mb-1">Position (X Y Z)</label>
          <div className="art-flex art-gap-1">
            {parseVector(new_hotspot.position).map((value, idx) => (
              <input
                key={idx}
                type="number"
                name={`position-${['x', 'y', 'z'][idx]}`}
                value={value || 0}
                onChange={handleNewInputChange}
                step="0.01"
                className="art-border art-rounded art-p-1 art-w-full"
                placeholder={['X', 'Y', 'Z'][idx]}
              />
            ))}
          </div>
        </div> */}

        {/* New hotspot normal inputs */}
        {/* <div className="art-my-2">
          <label className="art-text-sm art-block art-mb-1">Normal (X Y Z)</label>
          <div className="art-flex art-gap-1">
            {parseVector(new_hotspot.normal).map((value, idx) => (
              <input
                key={idx}
                type="number"
                name={`normal-${['x', 'y', 'z'][idx]}`}
                value={value || (idx === 2 ? 1 : 0)}
                onChange={handleNewInputChange}
                step="0.01"
                min="-1"
                max="1"
                className="art-border art-rounded art-p-1 art-w-full"
                placeholder={['X', 'Y', 'Z'][idx]}
              />
            ))}
          </div>
        </div> */}

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Visible</label>
          <input
            type="checkbox"
            name="visible"
            checked={new_hotspot.visible ?? true}
            onChange={handleNewInputChange}
            className="art-w-4 art-h-4"
          />
        </div>

        <button
          onClick={handleAddNewHotspot}
          className="art-bg-blue-500 art-text-white art-px-4 art-py-2 art-rounded hover:art-bg-blue-600"
        >
          + Add Hotspot
        </button>
      </div>
    </div>
  );
};

export default HotspotsComponent;