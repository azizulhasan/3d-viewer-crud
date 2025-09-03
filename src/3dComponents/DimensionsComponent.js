// DimensionsComponent.js
import { useState, useRef } from "react";
import { MV } from "./Shared.js";

export const DimensionsComponent = ({ 
  dimensions, 
  onUpdateDimension,
  src,
  isStandalone = true 
}) => {
  const [showEditor, setShowEditor] = useState(true);
  const mvRef = useRef(null);

  const handleDimensionChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onUpdateDimension(parent, {
        ...dimensions[parent],
        [child]: value
      });
    } else {
      onUpdateDimension(field, value);
    }
  };

  const resetToDefault = () => {
    onUpdateDimension('show', false);
    onUpdateDimension('length', { value: 0, unit: 'm' });
    onUpdateDimension('width', { value: 0, unit: 'm' });
    onUpdateDimension('height', { value: 0, unit: 'm' });
    onUpdateDimension('color', '#ff0000');
    onUpdateDimension('labelBackground', '#ffffff');
  };

  if (!isStandalone) {
    return (
      <div className="art-space-y-4">
        <div className="art-border-b art-pb-4">
          <div className="art-flex art-items-center art-justify-between art-mb-2">
            <h4 className="art-text-sm art-font-medium art-text-slate-700">Show Dimensions</h4>
            <label className="art-relative art-inline-flex art-items-center art-cursor-pointer">
              <input
                type="checkbox"
                checked={dimensions.show}
                onChange={(e) => handleDimensionChange('show', e.target.checked)}
                className="art-sr-only"
              />
              <div className={`art-w-8 art-h-4 art-rounded-full art-transition-colors ${
                dimensions.show ? 'art-bg-blue-600' : 'art-bg-gray-300'
              }`}>
                <div className={`art-w-3 art-h-3 art-bg-white art-rounded-full art-shadow art-transition-transform art-mt-0.5 ${
                  dimensions.show ? 'art-translate-x-4 art-ml-0.5' : 'art-translate-x-0.5'
                }`}></div>
              </div>
            </label>
          </div>
        </div>

        <div className="art-space-y-3">
          <div>
            <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
              Length
            </label>
            <div className="art-flex art-gap-2">
              <input
                type="number"
                value={dimensions.length.value}
                onChange={(e) => handleDimensionChange('length.value', parseFloat(e.target.value) || 0)}
                className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
                step="0.1"
                min="0"
              />
              <select
                value={dimensions.length.unit}
                onChange={(e) => handleDimensionChange('length.unit', e.target.value)}
                className="art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
              Width
            </label>
            <div className="art-flex art-gap-2">
              <input
                type="number"
                value={dimensions.width.value}
                onChange={(e) => handleDimensionChange('width.value', parseFloat(e.target.value) || 0)}
                className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
                step="0.1"
                min="0"
              />
              <select
                value={dimensions.width.unit}
                onChange={(e) => handleDimensionChange('width.unit', e.target.value)}
                className="art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
              Height
            </label>
            <div className="art-flex art-gap-2">
              <input
                type="number"
                value={dimensions.height.value}
                onChange={(e) => handleDimensionChange('height.value', parseFloat(e.target.value) || 0)}
                className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
                step="0.1"
                min="0"
              />
              <select
                value={dimensions.height.unit}
                onChange={(e) => handleDimensionChange('height.unit', e.target.value)}
                className="art-text-xs art-rounded art-border art-px-2 art-py-1 focus:art-border-blue-500 focus:art-outline-none"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
              Dimension Line Color
            </label>
            <input
              type="color"
              value={dimensions.color}
              onChange={(e) => handleDimensionChange('color', e.target.value)}
              className="art-w-full art-h-8 art-rounded art-border art-cursor-pointer"
            />
          </div>

          <div>
            <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
              Label Background Color
            </label>
            <input
              type="color"
              value={dimensions.labelBackground}
              onChange={(e) => handleDimensionChange('labelBackground', e.target.value)}
              className="art-w-full art-h-8 art-rounded art-border art-cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={resetToDefault}
          className="art-w-full art-border art-border-slate-300 art-text-slate-700 art-px-3 art-py-1 art-rounded art-text-xs hover:art-bg-slate-100 art-transition-colors"
        >
          Reset to Default
        </button>
      </div>
    );
  }

  return (
    <div className="art-flex art-lg:art-grid-cols-4 art-gap-6">
      <div className="art-lg:art-col-span-1">
        <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4 art-sticky art-top-24">
          <div className="art-flex art-items-center art-justify-between art-mb-4">
            <h3 className="art-font-semibold art-text-lg art-text-slate-800">Dimensions</h3>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="art-p-1 hover:art-bg-slate-100 art-rounded"
            >
              {showEditor ? '🔽' : '▶️'}
            </button>
          </div>
          {showEditor && (
            <div className="art-space-y-4">
              <div className="art-flex art-items-center art-justify-between">
                <span className="art-text-sm art-font-medium art-text-slate-700">Show Dimensions</span>
                <label className="art-relative art-inline-flex art-items-center art-cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dimensions.show}
                    onChange={(e) => handleDimensionChange('show', e.target.checked)}
                    className="art-sr-only"
                  />
                  <div className={`art-w-8 art-h-4 art-rounded-full art-transition-colors ${
                    dimensions.show ? 'art-bg-blue-600' : 'art-bg-gray-300'
                  }`}>
                    <div className={`art-w-3 art-h-3 art-bg-white art-rounded-full art-shadow art-transition-transform art-mt-0.5 ${
                      dimensions.show ? 'art-translate-x-4 art-ml-0.5' : 'art-translate-x-0.5'
                    }`}></div>
                  </div>
                </label>
              </div>

              <div className="art-space-y-3">
                <div>
                  <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
                    Length
                  </label>
                  <div className="art-flex art-gap-2">
                    <input
                      type="number"
                      value={dimensions.length.value}
                      onChange={(e) => handleDimensionChange('length.value', parseFloat(e.target.value) || 0)}
                      className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1"
                      step="0.1"
                      min="0"
                    />
                    <select
                      value={dimensions.length.unit}
                      onChange={(e) => handleDimensionChange('length.unit', e.target.value)}
                      className="art-text-xs art-rounded art-border art-px-2 art-py-1"
                    >
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
                    Width
                  </label>
                  <div className="art-flex art-gap-2">
                    <input
                      type="number"
                      value={dimensions.width.value}
                      onChange={(e) => handleDimensionChange('width.value', parseFloat(e.target.value) || 0)}
                      className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1"
                      step="0.1"
                      min="0"
                    />
                    <select
                      value={dimensions.width.unit}
                      onChange={(e) => handleDimensionChange('width.unit', e.target.value)}
                      className="art-text-xs art-rounded art-border art-px-2 art-py-1"
                    >
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
                    Height
                  </label>
                  <div className="art-flex art-gap-2">
                    <input
                      type="number"
                      value={dimensions.height.value}
                      onChange={(e) => handleDimensionChange('height.value', parseFloat(e.target.value) || 0)}
                      className="art-flex-1 art-text-xs art-rounded art-border art-px-2 art-py-1"
                      step="0.1"
                      min="0"
                    />
                    <select
                      value={dimensions.height.unit}
                      onChange={(e) => handleDimensionChange('height.unit', e.target.value)}
                      className="art-text-xs art-rounded art-border art-px-2 art-py-1"
                    >
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="art-block art-text-xs art-font-medium art-text-slate-700 art-mb-1">
                    Colors
                  </label>
                  <div className="art-space-y-2">
                    <div>
                      <label className="art-block art-text-xs art-text-slate-600 art-mb-1">Line Color</label>
                      <input
                        type="color"
                        value={dimensions.color}
                        onChange={(e) => handleDimensionChange('color', e.target.value)}
                        className="art-w-full art-h-6 art-rounded art-border art-cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="art-block art-text-xs art-text-slate-600 art-mb-1">Label Background</label>
                      <input
                        type="color"
                        value={dimensions.labelBackground}
                        onChange={(e) => handleDimensionChange('labelBackground', e.target.value)}
                        className="art-w-full art-h-6 art-rounded art-border art-cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={resetToDefault}
                className="art-w-full art-border art-border-slate-300 art-text-slate-700 art-px-3 art-py-1 art-rounded art-text-xs hover:art-bg-slate-100"
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="art-w-full art-lg:art-col-span-3">
        <MV 
          ref={mvRef}
          src={src}
          poster=""
        >
          {dimensions.show && (
            <>
              {/* Add dimension annotations here if your MV component supports it */}
              <div 
                slot="dimension-length"
                style={{
                  color: dimensions.color,
                  backgroundColor: dimensions.labelBackground
                }}
              >
                {dimensions.length.value}{dimensions.length.unit}
              </div>
            </>
          )}
        </MV>
      </div>
    </div>
  );
};