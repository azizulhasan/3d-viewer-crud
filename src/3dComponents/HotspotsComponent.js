

    const HotspotsComponent = ({
    hotspots,
    setProductModel,
    new_hotspot,
    setNewHotspot,
    }) => {
    // ---------- Hotspot CRUD ----------
    const updateHotspot = (index, updates) => {   //updates the hotspot
        setProductModel((prev) => {
        const newHotspots = [...prev.hotspots];
        if (newHotspots[index]) {
            newHotspots[index] = {
            id: "",
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

    const addHotspot = (hotspotData) => {   //adds the hotspot
        const completeHotspot = {
        id: "",
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
            id: "",
            label: "",
            position: "0 0 0",
            normal: "0 0 1",
            visible: true,
        },
        }));
    };

    const removeHotspot = (index) => {   //removes the hotspot
        setProductModel((prev) => ({
        ...prev,
        hotspots: prev.hotspots.filter((_, i) => i !== index),
        }));
    };


    /*
    handleInputChange updates the form state dynamically whenever a user types in an input field, 
    making sure only the changed field is updated while keeping all other fields intact.
    */
    const handleInputChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const updates = { [name]: type === "checkbox" ? checked : value };  //checkbox for visible the Hotspot

        if (name.startsWith("position-") || name.startsWith("normal-")) {  // positions & normal (x, y, z)
        const [typeStr, axis] = name.split("-");
        const currentVector = (hotspots[index][typeStr] || "0 0 0") //initial position 0 0 0
            .split(" ")
            .map(Number);
        const newVector = [...currentVector];
        if (axis === "x") newVector[0] = parseFloat(value) || 0;
        if (axis === "y") newVector[1] = parseFloat(value) || 0;
        if (axis === "z") newVector[2] = parseFloat(value) || 0;
        updates[typeStr] = newVector.join(" "); //updates the co-ordinates of the position & normal
        }

        updateHotspot(index, updates);
    };




    /*
        Updating the new_hotspot state whenever a form field
        (text input, checkbox, etc.) changes.
    */
    const handleNewInputChange = (event) => {  
        const { name, value, type, checked } = event.target;    //It grabs the changed input’s name, value, type, and checked.
        const newValue = type === "checkbox" ? checked : value; //Figures out the correct value to store (checked for checkboxes, value otherwise).
            
        setNewHotspot({  //Updates the new_hotspot state by copying the old state and replacing only the field that changed.
        ...new_hotspot,
        [name]: newValue,
        });
    };

    const handleAddNewHotspot = (event) => {   //handles newly added hotspot
        event.preventDefault();
        
        // Validate that both id and label are provided
        if (!new_hotspot.id.trim() || !new_hotspot.label.trim()) {
        alert("Please provide both ID and Label for the hotspot");
        return;
        }
        
        // Check if ID already exists
        const existingIds = hotspots.map(h => h.id);
        if (existingIds.includes(new_hotspot.id.trim())) {
        alert("A hotspot with this ID already exists. Please use a unique ID.");
        return;
        }
        
        addHotspot({
        ...new_hotspot,
        id: new_hotspot.id.trim(),
        label: new_hotspot.label.trim(),
        });
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
                <h4 className="art-font-bold">
                {hotspot.label || `Hotspot ${index + 1}`}
                </h4>

                <div className="art-flex art-items-center art-gap-2 art-my-2">
                <label className="art-text-sm art-w-24">ID</label>
                <input
                    type="text"
                    name="id"
                    value={hotspot.id || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    className="art-border art-rounded art-p-1 art-w-full"
                />
                </div>

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
                onClick={() => removeHotspot(index)}
                className="art-absolute art-top-2 art-right-2 art-text-red-500 hover:art-text-red-700 art-text-xl art-w-6 art-h-6 art-flex art-items-center art-justify-center"
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
            <label className="art-text-sm art-w-24">ID</label>
            <input
                type="text"
                name="id"
                value={new_hotspot.id || ""}
                onChange={handleNewInputChange}
                placeholder="Enter unique ID"
                className="art-border art-rounded art-p-1 art-w-full"
            />
            </div>

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
            <label className="art-text-sm art-w-24">Position (x y z)</label>
            <input
                type="text"
                name="position"
                value={new_hotspot.position || "0 0 0"}
                readOnly
                className="art-border art-rounded art-p-1 art-w-full art-bg-gray-200"
                title="Click on the 3D model to set position"
            />
            </div>

            <div className="art-flex art-items-center art-gap-2 art-my-2">
            <label className="art-text-sm art-w-24">Normal (x y z)</label>
            <input
                type="text"
                name="normal"
                value={new_hotspot.normal || "0 0 1"}
                readOnly
                className="art-border art-rounded art-p-1 art-w-full art-bg-gray-200"
                title="Automatically set when clicking on the 3D model"
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
            disabled={!new_hotspot.id?.trim() || !new_hotspot.label?.trim()}
            className="art-bg-blue-500 art-text-white art-px-4 art-py-2 art-rounded hover:art-bg-blue-600"
            >
            + Add Hotspot
            </button>
            
            <p className="art-text-xs art-text-gray-500 art-mt-2">
            Click on the 3D model to set the position automatically
            </p>
        </div>
        </div>
    );
    };

    export default HotspotsComponent;