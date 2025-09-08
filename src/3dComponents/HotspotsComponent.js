import React from "react";

const HotspotsComponent = ({
  hotspots,
  onUpdateHotspot,
  onAddHotspot,
  onRemoveHotspot,
  newHotspot,
  setNewHotspot,
}) => {
  // Update existing hotspots
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const updates = { [name]: type === "checkbox" ? checked : value };

    // Handle position and normal updates for individual hotspots
    if (name.startsWith("position-") || name.startsWith("normal-")) {
      const [typeStr, axis] = name.split("-");
      const currentVector = (hotspots[index][typeStr] || "0 0 0").split(" ").map(Number);
      const newVector = [...currentVector];
      if (axis === "x") newVector[0] = parseFloat(value) || 0;
      if (axis === "y") newVector[1] = parseFloat(value) || 0;
      if (axis === "z") newVector[2] = parseFloat(value) || 0;
      updates[typeStr] = newVector.join(" ");
    }

    onUpdateHotspot(index, updates);
  };

  // Update new hotspot inputs manually (ID, Label, Visibility)
  const handleNewInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewHotspot((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add hotspot manually
  const handleAddNewHotspot = (event) => {
    event.preventDefault();
    if (newHotspot.id && newHotspot.label) {
      onAddHotspot(newHotspot);
      // Reset handled by AccordionComponent
    }
  };

  return (
    <div className="art-space-y-4">
      <h3 className="art-text-lg art-font-semibold art-mb-2">
        Existing Hotspots
      </h3>
      <div className="art-space-y-4">
        {hotspots.map((hotspot, index) => (
          <div
            key={index}
            className="art-border art-rounded art-p-3 art-bg-white art-relative"
          >
            <h4 className="art-font-bold">{hotspot.label || `Hotspot ${index + 1}`}</h4>

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

            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Position (x y z)</label>
              <input
                type="text"
                name="position"
                value={hotspot.position || "0 0 0"}
                onChange={(e) => handleInputChange(index, e)}
                className="art-border art-rounded art-p-1 art-w-full"
              />
            </div>

            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Normal (x y z)</label>
              <input
                type="text"
                name="normal"
                value={hotspot.normal || "0 0 1"}
                onChange={(e) => handleInputChange(index, e)}
                className="art-border art-rounded art-p-1 art-w-full"
              />
            </div>

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
              onClick={() => onRemoveHotspot(index)}
              className="art-absolute art-top-2 art-right-2 art-text-red-500 hover:art-text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Add new hotspot section */}
      <div className="art-border art-rounded art-p-3 art-bg-gray-50">
        <h3 className="art-font-semibold art-mb-2">Add New Hotspot</h3>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">ID</label>
          <input
            type="text"
            name="id"
            value={newHotspot.id || ""}
            onChange={handleNewInputChange}
            className="art-border art-rounded art-p-1 art-w-full"
          />
        </div>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Label</label>
          <input
            type="text"
            name="label"
            value={newHotspot.label || ""}
            onChange={handleNewInputChange}
            className="art-border art-rounded art-p-1 art-w-full"
          />
        </div>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Position (x y z)</label>
          <input
            type="text"
            name="position"
            value={newHotspot.position || "0 0 0"}
            readOnly
            className="art-border art-rounded art-p-1 art-w-full bg-gray-200"
          />
        </div>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Normal (x y z)</label>
          <input
            type="text"
            name="normal"
            value={newHotspot.normal || "0 0 1"}
            readOnly
            className="art-border art-rounded art-p-1 art-w-full bg-gray-200"
          />
        </div>

        <div className="art-flex art-items-center art-gap-2 art-my-2">
          <label className="art-text-sm art-w-24">Visible</label>
          <input
            type="checkbox"
            name="visible"
            checked={newHotspot.visible ?? true}
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