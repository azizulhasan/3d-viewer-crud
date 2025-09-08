import { useState } from "react";

export const DimensionsComponent = ({ dimensions, onUpdateDimension }) => {
  const [showEditor, setShowEditor] = useState(true);

  const toggleDimensions = (visible) => {
    onUpdateDimension("show", visible);
    if (visible && !dimensions.unit) {
      onUpdateDimension("unit", "cm");
    }
  };

  const handleUnitChange = (e) => {
    onUpdateDimension("unit", e.target.value);
  };

  return (
    <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4">
      <div className="art-flex art-items-center art-justify-between art-mb-4">
        <h3 className="art-font-semibold art-text-lg art-text-slate-800">Dimensions</h3>
        <div className="art-flex art-items-center art-gap-2 art-text-sm">
            <label htmlFor="unitSelect">Unit:</label>
            <select
              id="unitSelect"
              value={dimensions.unit || "cm"}
              onChange={handleUnitChange}
              className="art-border art-rounded art-px-2 art-py-1"
            >
              <option value="inch">Inch</option>
              <option value="cm">Centimeter</option>
              <option value="m">Meter</option>
            </select>
          </div>
      </div>

      {showEditor && (
        <div className="art-space-y-4">
          {/* Checkbox */}
          <label className="art-flex art-items-center art-gap-2 art-text-sm">
            <input
              type="checkbox"
              checked={dimensions.show !== false}
              onChange={(e) => toggleDimensions(e.target.checked)}
              className="art-rounded"
            />
            Show Dimensions
          </label>
          


          
        </div>
      )}
    </div>
  );
};
