import { useState, useEffect } from "react";

export const DimensionsComponent = ({ dimensions, onUpdateDimension }) => {
  const [showEditor, setShowEditor] = useState(true);

  const toggleDimensions = (visible) => {
    onUpdateDimension("show", visible);
  };

  return (
    <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4">
      <div className="art-flex art-items-center art-justify-between art-mb-4">
        <h3 className="art-font-semibold art-text-lg art-text-slate-800">Dimensions</h3>
        <button onClick={() => setShowEditor(!showEditor)} className="art-p-1 art-hover:art-bg-slate-100 art-rounded">
          {showEditor ? "▼" : "▲"}
        </button>
      </div>

      {showEditor && (
        <div className="art-space-y-4">
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
