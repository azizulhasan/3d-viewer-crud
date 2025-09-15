const HotspotsComponent = ({
  hotspots,
  setProductModel,
  new_hotspot,
  setNewHotspot,
}) => {
  // ---------- Hotspot CRUD ----------
  const updateHotspot = (index, updates) => {
    setProductModel((prev) => {
      const newHotspots = [...prev.hotspots];
      if (newHotspots[index]) {
        newHotspots[index] = {
          label: "",
          position: "0 0 0",
          normal: "0 0 1",
          visible: true,
          ...newHotspots[index],
          ...updates,
        };
      }
      return { ...prev, hotspots: newHotspots };
    });
  };

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

  const removeHotspot = (index) => {
    setProductModel((prev) => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index),
    }));
  };

  // Handle existing hotspot changes
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

  // Handle new hotspot form
  const handleNewInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setNewHotspot({
      ...new_hotspot,
      [name]: newValue,
    });
  };

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

  return (
    <div className="art-space-y-6">

      {/* Hotspot editor panel */}
      <h3 className="art-text-lg art-font-semibold">Manage Hotspots</h3>
      <div className="art-space-y-4">
        {hotspots.map((hotspot, index) => (
          <div
            key={index}
            className="art-border art-rounded art-p-3 art-bg-white art-relative"
          >
            <h4 className="art-font-bold">
              {hotspot.label || `Hotspot ${index + 1}`}
            </h4>

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
        ))}
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
