import React, { useState } from 'react';

const HotspotsComponent = ({ hotspots, onUpdateHotspot, onAddHotspot, onRemoveHotspot }) => {
  const [newHotspot, setNewHotspot] = useState({
    id: '',
    label: '',
    position: '0 0 0',
    normal: '0 0 1',
    visible: true,
  });

  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const updates = { [name]: type === 'checkbox' ? checked : value };

    // Special handling for position and normal inputs
    if (name.startsWith('position-') || name.startsWith('normal-')) {
      const [type, axis] = name.split('-');
      const currentVector = hotspots[index][type].split(' ').map(Number);
      let newVector = [...currentVector];
      if (axis === 'x') newVector[0] = parseFloat(value) || 0;
      if (axis === 'y') newVector[1] = parseFloat(value) || 0;
      if (axis === 'z') newVector[2] = parseFloat(value) || 0;
      updates[type] = newVector.join(' ');
    }
    
    onUpdateHotspot(index, updates);
  };

  const handleNewInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewHotspot(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNewHotspot = (event) => {
    event.preventDefault();
    if (newHotspot.id && newHotspot.label) {
      onAddHotspot(newHotspot);
      setNewHotspot({
        id: '',
        label: '',
        position: '0 0 0',
        normal: '0 0 1',
        visible: true,
      });
    }
  };

  return (
    <div className="art-space-y-4">
      <h3 className="art-text-lg art-font-semibold art-mb-2">Existing Hotspots</h3>
      <div className="art-space-y-4">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="art-border art-rounded art-p-3 art-bg-white art-relative">
            <h4 className="art-font-bold">{hotspot.label || `Hotspot ${index + 1}`}</h4>
            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Label</label>
              <input
                type="text"
                name="label"
                value={hotspot.label}
                onChange={(e) => handleInputChange(index, e)}
                className="art-border art-rounded art-p-1 art-w-full"
              />
            </div>
            
            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Position (x y z)</label>
              <input
                type="text"
                name="position"
                value={hotspot.position}
                onChange={(e) => handleInputChange(index, e)}
                className="art-border art-rounded art-p-1 art-w-full"
              />
            </div>
            
            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Normal (x y z)</label>
              <input
                type="text"
                name="normal"
                value={hotspot.normal}
                onChange={(e) => handleInputChange(index, e)}
                className="art-border art-rounded art-p-1 art-w-full"
              />
            </div>

            <div className="art-flex art-items-center art-gap-2 art-my-2">
              <label className="art-text-sm art-w-24">Visible</label>
              <input
                type="checkbox"
                name="visible"
                checked={hotspot.visible}
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

    </div>
  );
};
export default HotspotsComponent;
