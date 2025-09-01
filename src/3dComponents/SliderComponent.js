import { useState, useRef, useEffect, useCallback } from "react";
import { Section } from "./Shared.js";
import { MV } from "./Shared.js";

export const SliderComponent = () => {
  // Default models
  const defaultModels = [
    // { 
    //   id: 1, 
    //   src: "/src/Components/Chair.glb", 
    //   label: "Chair", 
    //   thumbnail: "/src/Components/Chair.webp",
    //   isDefault: true 
    // },
    // { 
    //   id: 2, 
    //   src: "/src/Components/Astronaut.glb", 
    //   label: "Astronaut", 
    //   thumbnail: "/src/Components/Astronaut.webp",
    //   isDefault: true 
    // },
    // { 
    //   id: 3, 
    //   src: "/src/Components/lambo.glb", 
    //   label: "Car", 
    //   thumbnail: "/src/Components/lambo.webp",
    //   isDefault: true 
    // },
  ];

  const [models, setModels] = useState(defaultModels);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSlider, setShowSlider] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [pendingModel, setPendingModel] = useState(null); // Store model waiting for thumbnail
  const [isUploading, setIsUploading] = useState(false); // Prevent double uploads
  
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const mvRef = useRef(null);

  useEffect(()=>{
    console.log("Im for test purpose.");
    
  },[])

  // Handle GLB file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file || isUploading) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please upload a .glb file');
      event.target.value = ''; // Reset input
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create object URL for the uploaded file
    const url = URL.createObjectURL(file);
    
    // Generate default thumbnail placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('3D Model', 100, 90);
    ctx.font = '12px Arial';
    ctx.fillText(file.name.slice(0, 15) + (file.name.length > 15 ? '...' : ''), 100, 110);
    ctx.fillText('Click to add thumbnail', 100, 130);
    
    const defaultThumbnailUrl = canvas.toDataURL();

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Create pending model (waiting for thumbnail)
          const newModel = {
            id: Date.now(),
            src: url,
            label: file.name.replace('.glb', ''),
            thumbnail: defaultThumbnailUrl,
            isDefault: false,
            file: file,
            needsThumbnail: true
          };

          setPendingModel(newModel);
          setUploadProgress(null);
          setIsUploading(false);
          
          return 100;
        }
        return prev + 10;
      });
    }, 80);

    // Reset file input
    event.target.value = '';
  }, [isUploading]);

  // Handle thumbnail upload
  const handleThumbnailUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file || !pendingModel) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP)');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const thumbnailUrl = e.target.result;
      
      // Add model with custom thumbnail
      const finalModel = {
        ...pendingModel,
        thumbnail: thumbnailUrl,
        needsThumbnail: false
      };

      setModels(prev => [...prev, finalModel]);
      setSelectedIndex(models.length); // Select the new model
      setPendingModel(null);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }, [pendingModel, models.length]);

  // Add model without custom thumbnail
  const addModelWithDefaultThumbnail = () => {
    if (!pendingModel) return;
    
    const finalModel = {
      ...pendingModel,
      needsThumbnail: false
    };

    setModels(prev => [...prev, finalModel]);
    setSelectedIndex(models.length);
    setPendingModel(null);
  };

  // Cancel pending model
  const cancelPendingModel = () => {
    if (pendingModel) {
      URL.revokeObjectURL(pendingModel.src);
      setPendingModel(null);
    }
  };

  // Remove uploaded model
  const removeModel = (id) => {
    const modelToRemove = models.find(m => m.id === id);
    if (modelToRemove && !modelToRemove.isDefault) {
      URL.revokeObjectURL(modelToRemove.src);
      setModels(prev => prev.filter(m => m.id !== id));
      
      if (selectedIndex >= models.length - 1) {
        setSelectedIndex(Math.max(0, models.length - 2));
      }
    }
  };

  // Select model from slider
  const selectModel = (index) => {
    setSelectedIndex(index);
  };

  // Auto-play functionality
  const [autoPlay, setAutoPlay] = useState(false);
  const [playInterval, setPlayInterval] = useState(null);

  useEffect(() => {
    if (autoPlay && models.length > 1) {
      const interval = setInterval(() => {
        setSelectedIndex(prev => (prev + 1) % models.length);
      }, 3000);
      setPlayInterval(interval);
    } else {
      if (playInterval) {
        clearInterval(playInterval);
        setPlayInterval(null);
      }
    }

    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [autoPlay, models.length]);

  return (
    <div className="art-flex  art-gap-6">
      {/* Left Panel - Model Manager */}
      <div className="art-w-1/3 art-lg:art-col-span-1">
        <div className="art-bg-white art-rounded-2xl art-shadow-md art-border art-border-slate-200 art-p-4 art-sticky art-top-24">
          <div className="art-flex art-items-center art-justify-between art-mb-4">
            <h3 className="art-font-semibold art-text-lg art-text-slate-800 art-flex art-items-center art-gap-2"/>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="art-p-1 art-hover:art-bg-slate-100 art-rounded"
            >
              {showEditor ? 'icon' : 'iconof' }
            </button>
          </div>

          {showEditor && (
            <div className="art-space-y-4">
              {/* Upload Section */}
              <div className="art-border-b art-pb-4">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Upload 3D Model</h4>
                <div className="art-space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb"
                    onChange={handleFileUpload}
                    className="art-hidden"
                  />
                  <button
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    disabled={uploadProgress !== null || isUploading}
                    className="art-w-full art-bg-blue-600 art-text-white art-px-3 art-py-2 art-rounded-lg art-text-xs art-hover:art-bg-blue-700 art-disabled:art-bg-gray-300 art-flex art-items-center art-justify-center art-gap-2"
                  >
                    <input type="file"></input>
                    Uload
                    {uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Upload GLB File'}
                  </button>
                  <p className="art-text-xs art-text-slate-500">
                    Supports .glb files only. Max size: 50MB
                  </p>
                </div>
              </div>

              {/* Pending Model - Thumbnail Upload */}
              {pendingModel && (
                <div
                  className="art-border-2 art-border-dashed art-border-blue-300 art-rounded-lg art-p-3 art-bg-blue-50"
                >
                  <h4 className="art-text-sm art-font-medium art-mb-2 art-text-blue-700">Add Thumbnail (Optional)</h4>
                  <p className="art-text-xs art-text-blue-600 art-mb-2">
                    Model "{pendingModel.label}" uploaded successfully!
                  </p>
                  
                  <div className="art-space-y-2">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="art-hidden"
                    />
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="art-w-full art-bg-white art-border-2 art-border-blue-300 art-text-blue-700 art-px-3 art-py-2 art-rounded-lg art-text-xs art-hover:art-bg-blue-50 art-flex art-items-center art-justify-center art-gap-2"
                    >
                      
                      Upload Thumbnail
                    </button>
                    <p className="art-text-xs art-text-slate-500">
                      PNG, JPG, WEBP supported. Recommended: 200x200px
                    </p>
                    
                    <div className="art-flex art-gap-2">
                      <button
                        onClick={addModelWithDefaultThumbnail}
                        className="art-flex-1 art-bg-green-600 art-text-white art-px-2 art-py-1 art-rounded art-text-xs art-hover:art-bg-green-700"
                      >
                        Use Default
                      </button>
                      <button
                        onClick={cancelPendingModel}
                        className="art-flex-1 art-bg-red-600 art-text-white art-px-2 art-py-1 art-rounded art-text-xs art-hover:art-bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Controls */}
              <div className="art-border-b art-pb-4">
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">Display Options</h4>
                <div className="art-space-y-2">
                  <label className="art-flex art-items-center art-gap-2 art-text-xs">
                    <input
                      type="checkbox"
                      checked={showSlider}
                      onChange={(e) => setShowSlider(e.target.checked)}
                      className="art-rounded"
                    />
                    Show model slider
                  </label>
                  <label className="art-flex art-items-center art-gap-2 art-text-xs">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="art-rounded"
                    />
                    
                    Auto-play carousel (3s)
                  </label>
                </div>
              </div>

              {/* Model List */}
              <div>
                <h4 className="art-text-sm art-font-medium art-mb-2 art-text-slate-700">
                  Models ({models.length})
                </h4>
                <div className="art-space-y-2 art-max-h-64 art-overflow-y-auto">
                  {models.map((model, index) => (
                    <div
                      key={model.id}
                      className={`art-border art-rounded-lg art-p-2 art-cursor-pointer art-transition-all ${
                        selectedIndex === index 
                          ? 'art-border-blue-500 art-bg-blue-50' 
                          : 'art-border-slate-200 art-bg-slate-50 art-hover:art-bg-slate-100'
                      }`}
                      onClick={() => selectModel(index)}
                    >
                      <div className="art-flex art-items-center art-justify-between">
                        <div className="art-flex art-items-center art-gap-2">
                          <img
                            src={model.thumbnail}
                            alt={model.label}
                            className="art-w-8 art-h-8 art-rounded art-bg-slate-200 art-object-cover"
                            onError={(e) => {
                              e.target.style.backgroundColor = '#e2e8f0';
                              e.target.style.display = 'block';
                            }}
                          />
                          <div>
                            <div className="art-text-xs art-font-medium art-text-slate-800">
                              {model.label}
                            </div>
                            <div className="art-text-xs art-text-slate-500">
                              {model.isDefault ? 'Default' : 'Uploaded'}
                            </div>
                          </div>
                        </div>
                        {!model.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeModel(model.id);
                            }}
                            className="art-p-1 art-hover:art-bg-red-100 art-text-red-600 art-rounded"
                            title="Remove model"
                          >
                            delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Info */}
              <div className="art-bg-slate-50 art-rounded-lg art-p-3">
                <h4 className="art-text-sm art-font-medium art-mb-1 art-text-slate-700">Current Model</h4>
                <div className="art-text-xs art-text-slate-600">
                  <div><strong>Name:</strong> {models[selectedIndex]?.label}</div>
                  <div><strong>Type:</strong> {models[selectedIndex]?.isDefault ? 'Default' : 'User Uploaded'}</div>
                  <div><strong>Index:</strong> {selectedIndex + 1} of {models.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - 3D Model Viewer with Slider */}
      <div className="art-w-full art-lg:art-col-span-3">
        <Section
          title="3D Model Carousel"
          description="Browse through multiple 3D models with thumbnail slider. Upload your own GLB files to add to the collection."
        >
          <div className="art-relative">
            {/* Main Model Viewer */}
            <MV 
              ref={mvRef}
              key={models[selectedIndex]?.id}
              src={models[selectedIndex]?.src}
              camera-orbit="-30deg auto auto"
              max-camera-orbit="auto 100deg auto"
              shadow-intensity="1"
              ar
              ar-modes="webxr"
              ar-scale="fixed"
              poster={models[selectedIndex]?.thumbnail}
            >
              {/* AR Button */}
              <button slot="ar-button" id="ar-button">
                View in your space
              </button>

              {/* AR Prompt */}
              <div id="ar-prompt">
                <div className="art-w-8 art-h-8 art-bg-white art-rounded-full art-flex art-items-center art-justify-center">
                  👋
                </div>
              </div>

              {/* AR Failure Message */}
              <button id="ar-failure">
                AR is not tracking!
              </button>
            </MV>

            {/* Bottom Slider */}
            {showSlider && (
              <div className="art-slider">
                <div className="art-slides">
                  {models.map((model, index) => (
                    <button
                      key={model.id}
                      className={`art-slide ${selectedIndex === index ? 'art-selected' : ''}`}
                      onClick={() => selectModel(index)}
                      style={{
                        backgroundImage: `url('${model.thumbnail}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                      title={model.label}
                    >
                      <div className="art-slide-overlay">
                        <span className="art-slide-label">{model.label}</span>
                        {model.needsThumbnail && (
                          <div className="art-absolute art-top-1 art-right-1 art-w-3 art-h-3 art-bg-yellow-400 art-rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress Overlay */}
            {uploadProgress !== null && (
              <div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="art-absolute art-inset-0 art-bg-black/50 art-flex art-items-center art-justify-center art-rounded-2xl"
              >
                <div className="art-bg-white art-rounded-lg art-p-4 art-text-center">
                  <input type="file"/>
                  <div className="art-text-sm art-font-medium">Uploading Model...</div>
                  <div className="art-w-48 art-bg-gray-200 art-rounded-full art-h-2 art-mt-2">
                    <div 
                      className="art-bg-blue-600 art-h-2 art-rounded-full art-transition-all art-duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="art-text-xs art-text-gray-500 art-mt-1">{uploadProgress}%</div>
                </div>
              </div>
            )}

            {/* Pending Model Overlay */}
            {pendingModel && (
              <div
                className="art-absolute art-inset-0 art-bg-black/50 art-flex art-items-center art-justify-center art-rounded-2xl"
              >
                <div className="art-bg-white art-rounded-lg art-p-6 art-text-center art-max-w-sm">
                  Upload
                  <h3 className="art-text-lg art-font-semibold art-mb-2">Model Uploaded!</h3>
                  <p className="art-text-sm art-text-slate-600 art-mb-4">
                    "{pendingModel.label}" is ready. Add a custom thumbnail or use the default one.
                  </p>
                  
                  <div className="art-space-y-3">
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="art-w-full art-bg-blue-600 art-text-white art-px-4 art-py-2 art-rounded-lg art-text-sm art-hover:art-bg-blue-700 art-flex art-items-center art-justify-center art-gap-2"
                    >
                      
                      <input type="file" />
                      Upload Custom Thumbnail
                    </button>
                    
                    <div className="art-flex art-gap-2">
                      <button
                        onClick={addModelWithDefaultThumbnail}
                        className="art-flex-1 art-bg-green-600 art-text-white art-px-3 art-py-2 art-rounded-lg art-text-xs art-hover:art-bg-green-700"
                      >
                        Use Default
                      </button>
                      <button
                        onClick={cancelPendingModel}
                        className="art-flex-1 art-bg-gray-500 art-text-white art-px-3 art-py-2 art-rounded-lg art-text-xs art-hover:art-bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Hidden Thumbnail Input */}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailUpload}
          className="art-hidden"
        />
      </div>
    </div>
  );
};