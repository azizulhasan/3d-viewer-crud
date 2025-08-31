import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Section } from "./Shared";
import { motion } from "framer-motion";
import "@google/model-viewer";
import { MV } from "./Shared";
import { Upload, Trash2, Eye, EyeOff, Image, Play, FileImage } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Panel - Model Manager */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sticky top-24"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
              <Image size={18} />
              Model Manager
            </h3>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              {showEditor ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {showEditor && (
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium mb-2 text-slate-700">Upload 3D Model</h4>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    disabled={uploadProgress !== null || isUploading}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    {uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Upload GLB File'}
                  </button>
                  <p className="text-xs text-slate-500">
                    Supports .glb files only. Max size: 50MB
                  </p>
                </div>
              </div>

              {/* Pending Model - Thumbnail Upload */}
              {pendingModel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-3 bg-blue-50"
                >
                  <h4 className="text-sm font-medium mb-2 text-blue-700">Add Thumbnail (Optional)</h4>
                  <p className="text-xs text-blue-600 mb-2">
                    Model "{pendingModel.label}" uploaded successfully!
                  </p>
                  
                  <div className="space-y-2">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="w-full bg-white border-2 border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-xs hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                      <FileImage size={14} />
                      Upload Thumbnail
                    </button>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, WEBP supported. Recommended: 200x200px
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={addModelWithDefaultThumbnail}
                        className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Use Default
                      </button>
                      <button
                        onClick={cancelPendingModel}
                        className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Display Controls */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium mb-2 text-slate-700">Display Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={showSlider}
                      onChange={(e) => setShowSlider(e.target.checked)}
                      className="rounded"
                    />
                    Show model slider
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="rounded"
                    />
                    <Play size={12} />
                    Auto-play carousel (3s)
                  </label>
                </div>
              </div>

              {/* Model List */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-slate-700">
                  Models ({models.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {models.map((model, index) => (
                    <div
                      key={model.id}
                      className={`border rounded-lg p-2 cursor-pointer transition-all ${
                        selectedIndex === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                      onClick={() => selectModel(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={model.thumbnail}
                            alt={model.label}
                            className="w-8 h-8 rounded bg-slate-200 object-cover"
                            onError={(e) => {
                              e.target.style.backgroundColor = '#e2e8f0';
                              e.target.style.display = 'block';
                            }}
                          />
                          <div>
                            <div className="text-xs font-medium text-slate-800">
                              {model.label}
                            </div>
                            <div className="text-xs text-slate-500">
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
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                            title="Remove model"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Info */}
              <div className="bg-slate-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-1 text-slate-700">Current Model</h4>
                <div className="text-xs text-slate-600">
                  <div><strong>Name:</strong> {models[selectedIndex]?.label}</div>
                  <div><strong>Type:</strong> {models[selectedIndex]?.isDefault ? 'Default' : 'User Uploaded'}</div>
                  <div><strong>Index:</strong> {selectedIndex + 1} of {models.length}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Panel - 3D Model Viewer with Slider */}
      <div className="lg:col-span-3">
        <Section
          title="3D Model Carousel"
          description="Browse through multiple 3D models with thumbnail slider. Upload your own GLB files to add to the collection."
        >
          <div className="relative">
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
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
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
              <div className="slider">
                <div className="slides">
                  {models.map((model, index) => (
                    <button
                      key={model.id}
                      className={`slide ${selectedIndex === index ? 'selected' : ''}`}
                      onClick={() => selectModel(index)}
                      style={{
                        backgroundImage: `url('${model.thumbnail}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                      title={model.label}
                    >
                      <div className="slide-overlay">
                        <span className="slide-label">{model.label}</span>
                        {model.needsThumbnail && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress Overlay */}
            {uploadProgress !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"
              >
                <div className="bg-white rounded-lg p-4 text-center">
                  <Upload className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Uploading Model...</div>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{uploadProgress}%</div>
                </div>
              </motion.div>
            )}

            {/* Pending Model Overlay */}
            {pendingModel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"
              >
                <div className="bg-white rounded-lg p-6 text-center max-w-sm">
                  <FileImage className="mx-auto mb-3 text-blue-600" size={32} />
                  <h3 className="text-lg font-semibold mb-2">Model Uploaded!</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    "{pendingModel.label}" is ready. Add a custom thumbnail or use the default one.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      Upload Custom Thumbnail
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={addModelWithDefaultThumbnail}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700"
                      >
                        Use Default
                      </button>
                      <button
                        onClick={cancelPendingModel}
                        className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Section>

        {/* Hidden Thumbnail Input */}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailUpload}
          className="hidden"
        />

        {/* Embedded Styles */}
        <style jsx>{`
          #ar-button {
            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDI4NWY0Ii8+Cjwvc3ZnPgo=');
            background-repeat: no-repeat;
            background-size: 20px 20px;
            background-position: 12px 50%;
            background-color: #fff;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            bottom: 132px;
            padding: 0px 16px 0px 40px;
            font-family: 'Inter', 'Roboto Regular', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            color: #4285f4;
            height: 36px;
            line-height: 36px;
            border-radius: 18px;
            border: 1px solid #DADCE0;
            cursor: pointer;
          }

          #ar-button:active {
            background-color: #E8EAED;
          }

          #ar-button:focus {
            outline: none;
          }

          #ar-button:focus-visible {
            outline: 1px solid #4285f4;
          }

          #ar-prompt {
            position: absolute;
            left: 50%;
            bottom: 175px;
            transform: translateX(-50%);
            display: none;
            animation: bounce 2s infinite ease-in-out;
          }

          model-viewer[ar-status="session-started"] #ar-prompt {
            display: block;
          }

          #ar-failure {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 175px;
            display: none;
            background: #ff4444;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            border: none;
          }

          model-viewer[ar-tracking="not-tracking"] #ar-failure {
            display: block;
          }

          .slider {
            width: 100%;
            text-align: center;
            overflow: hidden;
            position: absolute;
            bottom: 16px;
            left: 0;
            right: 0;
          }

          .slides {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            padding: 0 20px;
            gap: 10px;
          }

          .slide {
            scroll-snap-align: start;
            flex-shrink: 0;
            width: 100px;
            height: 100px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #fff;
            border-radius: 10px;
            border: 2px solid transparent;
            display: flex;
            align-items: end;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .slide:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }

          .slide.selected {
            border: 2px solid #4285f4;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
          }

          .slide:focus {
            outline: none;
          }

          .slide:focus-visible {
            outline: 1px solid #4285f4;
          }

          .slide-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            padding: 8px 4px 4px;
          }

          .slide-label {
            color: white;
            font-size: 10px;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
          }

          .hide {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};