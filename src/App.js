// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
// import { motion } from "framer-motion";

// App.js
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HomeComponent } from "./3dComponents/HomeComponent.js";
import { HotspotsComponent } from "./3dComponents/HotspotsComponent.js";
import { DimensionsComponent } from "./3dComponents/DimensionsComponent.js";
import { VariantsComponent } from "./3dComponents/VariantsComponent.js";
import { CameraComponent } from "./3dComponents/CameraComponent.js";
import { SliderComponent } from "./3dComponents/SliderComponent.js";
import { Shell } from "./3dComponents/Shared.js";


const Home = () => (
  <Shell>
    <HomeComponent />
  </Shell>
);

const Hotspots = () => (
  <Shell>
    <HotspotsComponent />
  </Shell>
);
const Dimensions = () => (
  <Shell>
    <DimensionsComponent />
  </Shell>
);
const Variants = () => (
  <Shell>
    <VariantsComponent />
  </Shell>
);
const Camera = () => (
  <Shell>
    <CameraComponent />
  </Shell>
);
const Slider = () => (
  <Shell>
    <SliderComponent />
  </Shell>
);


export default function App() {
  return (
    <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
           <Route path="/hotspots" element={<Hotspots />} />
              <Route path="/dimensions" element={<Dimensions />} />
                <Route path="/variants" element={<Variants />} />
                  <Route path="/camera" element={<Camera />} /> 
                        <Route path="/slider" element={<Slider />} />
        {/* 
     
     
      
      
  
        {/* ... other routes */}
      </Routes>
    </HashRouter>
    </>
  );
}







// =====================
// Shared UI bits (Better UI)
// =====================
// const Shell = ({ children }) => (
//   <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-800 font-inter">
//     <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b shadow-sm">
//       <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
//         <div className="font-bold text-xl tracking-tight text-slate-900">
//           🚀 3D Model Viewer
//         </div>
//         <div className="flex flex-wrap gap-2 text-sm">
//           <Tab to="/">Home</Tab>
//           <Tab to="/hotspots">Hotspots</Tab>
//           <Tab to="/dimensions">Dimensions</Tab>
//           <Tab to="/variants">Variants</Tab>
//           <Tab to="/camera">Camera</Tab>
//           <Tab to="/slider">Slider</Tab>

//         </div>
//       </nav>
//     </header>
//     <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">{children}</main>

//   </div>
// );

// // --- Slider / Carousel Page ---
// const Slider = () => {
//   const models = [
//     { id: 1, src: "/src/Components/Chair.glb", label: "Chair" },
//     { id: 2, src: "/src/Components/Astronaut.glb", label: "Astronaut" },
//     { id: 3, src: "/src/Components/lambo.glb", label: "Car" },
//   ];

//   const [index, setIndex] = useState(0);

//   const next = () => setIndex((i) => (i + 1) % models.length);
//   const prev = () => setIndex((i) => (i - 1 + models.length) % models.length);

//   return (



//     <Shell>
//       <Section
//         title="Model Carousel"
//         description="Swipe or use buttons to view multiple models."
//       >
//         <div className="relative w-full overflow-hidden">
//           <motion.div
//             key={models[index].id}
//             initial={{ opacity: 0, x: 100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -100 }}
//             transition={{ duration: 0.5 }}
//           >
//             <MV src={models[index].src} />
//             <p className="text-center mt-3 text-slate-700">
//               {models[index].label}
//             </p>
//           </motion.div>

//           {/* Controls */}
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={prev}
//               className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-100 shadow-sm"
//             >
//               ⬅ Prev
//             </button>
//             <button
//               onClick={next}
//               className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-100 shadow-sm"
//             >
//               Next ➡
//             </button>
//           </div>
//         </div>
//       </Section>
//     </Shell>
    
//   );
// };



// const Tab = ({ to, children }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `px-4 py-2 rounded-xl border transition-all duration-200 ${
//         isActive
//           ? "bg-slate-900 text-white border-slate-900 shadow-md"
//           : "bg-white/80 hover:bg-slate-100 border-slate-300"
//       }`
//     }
//     end
//   >
//     {children}
//   </NavLink>
// );

// const Section = ({ title, children, description }) => (
//   <motion.section
//     initial={{ opacity: 0, y: 12 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition"
//   >
//     <h2 className="text-2xl font-semibold mb-2 text-slate-800">{title}</h2>
//     {description ? (
//       <p className="text-sm text-slate-600 mb-4">{description}</p>
//     ) : null}
//     {children}
//   </motion.section>
// );




// // =====================
// // Reusable ModelViewer wrapper
// // =====================
// const MV = React.forwardRef(function MV({ src, children, style, ...rest }, refFromProps) {
//   const innerRef = useRef(null);
//   useEffect(() => {
//     if (!refFromProps) return;
//     if (typeof refFromProps === "function") refFromProps(innerRef.current);
//     else refFromProps.current = innerRef.current;
//   }, [refFromProps]);
//   return (
//     <div className="w-full">
//       <model-viewer
//         ref={innerRef}
//         src={src}
//         ar
//         camera-controls
//         environment-image="neutral"
//         tone-mapping="aces"
//         exposure="1"
//         shadow-intensity="1"
//         style={{
//           width: "100%",
//           height: "520px",
//           borderRadius: "1rem",
//           overflow: "hidden",
//           ...style,
//         }}
//         {...rest}
//       >
//         {children}
//       </model-viewer>
//     </div>
//   );
// });

// // =====================
// // Pages
// // =====================
// const Home = () => (
//   <Shell>
//     <div className="grid md:grid-cols-2 gap-6">
//       <Section
//         title="Welcome"
//         description="This is a 4-page React demo using the @google/model-viewer web component."
//       >
//         <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
//           <li>Hotspots with labels</li>
//           <li>Simple Dimensions readout</li>
//           <li>Annotations & Variants selector</li>
//           <li>Camera fly-to targets</li>
//         </ul>
//       </Section>
//       <Section title="Quick Tips">
//         <ol className="list-decimal pl-5 text-sm space-y-1 text-slate-700">
//           <li>
//             Replace <code>/models/*.glb</code> with your files.
//           </li>
//           <li>Each page shows a focused feature set.</li>
//           <li>
//             Model Viewer docs →{" "}
//             <a
//               href="https://modelviewer.dev"
//               target="_blank"
//               rel="noreferrer"
//               className="text-blue-600 underline"
//             >
//               modelviewer.dev
//             </a>
//           </li>
//         </ol>
//       </Section>
//     </div>
//   </Shell>
// );

// // --- Hotspots Page ---
// const Hotspots = () => {
//   const hotspots = useMemo(
//     () => [
//       { id: "top", label: "Top", position: "0 0.2 0", normal: "0 1 0" },
//       { id: "front", label: "Front", position: "0 0.05 0.15", normal: "0 0 1" },
//       { id: "side", label: "Side", position: "0.15 0.05 0", normal: "1 0 0" },
//     ],
//     []
//   );

//   return (
//     <Shell>
//       <Section
//         title="Hotspots"
//         description="Clickable hotspots with labels (slot=hotspot-*)"
//       >
//         <MV src="/src/Components/Chair.glb" poster="">
//           {hotspots.map((h) => (
//             <button
//               key={h.id}
//               slot={`hotspot-${h.id}`}
//               data-position={h.position}
//               data-normal={h.normal}
//               data-visibility-attribute="visible"
//               className="Hotspot"
//             >
//               <div>{h.label}</div>
//             </button>
//           ))}
//         </MV>
//       </Section>
//     </Shell>
//   );
// };

// // --- Dimensions Page ---
// function parseVec3(str) {
//   const [x, y, z] = (str || "0 0 0").split(/\s+/).map(Number);
//   return { x, y, z };
// }
// function distance(a, b) {
//   const dx = a.x - b.x,
//     dy = a.y - b.y,
//     dz = a.z - b.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// }
// const Dimensions = () => {
//   const [a, setA] = useState("-0.1 0.02 0.12");
//   const [b, setB] = useState("0.12 0.02 -0.08");
//   const d = useMemo(() => distance(parseVec3(a), parseVec3(b)), [a, b]);

//   return (
//     <Shell>
//       <Section
//         title="Dimensions"
//         description="Two hotspots (A/B). Distance calculated in meters."
//       >
//         <div className="grid md:grid-cols-3 gap-4 mb-4">
//           <label className="text-sm">
//             Point A (x y z)
//             <input
//               value={a}
//               onChange={(e) => setA(e.target.value)}
//               className="mt-1 w-full rounded border px-2 py-1"
//             />
//           </label>
//           <label className="text-sm">
//             Point B (x y z)
//             <input
//               value={b}
//               onChange={(e) => setB(e.target.value)}
//               className="mt-1 w-full rounded border px-2 py-1"
//             />
//           </label>
//           <div className="text-sm flex items-end">
//             Distance:{" "}
//             <span className="ml-2 font-semibold">{d.toFixed(3)} m</span>
//           </div>
//         </div>

//         <MV src="/src/Components/Chair.glb">
//           <button
//             slot="hotspot-A"
//             data-position={a}
//             data-normal="0 1 0"
//             data-visibility-attribute="visible"
//             className="Hotspot"
//           >
//             <div>A</div>
//           </button>
//           <button
//             slot="hotspot-B"
//             data-position={b}
//             data-normal="0 1 0"
//             data-visibility-attribute="visible"
//             className="Hotspot"
//           >
//             <div>B</div>
//           </button>
//           <button
//             slot="hotspot-mid"
//             data-position={`${
//               (parseVec3(a).x + parseVec3(b).x) / 2
//             } ${(parseVec3(a).y + parseVec3(b).y) / 2} ${
//               (parseVec3(a).z + parseVec3(b).z) / 2
//             }`}
//             data-normal="0 1 0"
//             data-visibility-attribute="visible"
//             className="Hotspot"
//           >
//             <div>{d.toFixed(3)} m</div>
//           </button>
//         </MV>
//       </Section>
//     </Shell>
//   );
// };

// // --- Variants & Annotations Page ---
// // --- Variants & Annotations Page ---
// const Variants = () => {
//   const mvRef = useRef(null);
//   const [variants, setVariants] = useState([]);
//   const [current, setCurrent] = useState("");
//   const [showAnno, setShowAnno] = useState(true);

//   // 🚗 Lamborghini models
//   const models = {
//     huracan: "/src/Components/apartment.glb",
//     aventador: "/src/Components/lambo_aventador.glb",
//     urus: "/src/Components/lambo_urus.glb",
//   };
//   const [selectedModel, setSelectedModel] = useState("huracan");

//   // Detect material variants inside the current model
//   useEffect(() => {
//     const el = mvRef.current;
//     if (!el) return;
//     function onLoad() {
//       const list = el.availableVariants || [];
//       setVariants(list);
//       if (list.length) setCurrent(list[0]);
//     }
//     el.addEventListener("load", onLoad);
//     return () => el.removeEventListener("load", onLoad);
//   }, [selectedModel]);

//   // Apply material variant
//   useEffect(() => {
//     const el = mvRef.current;
//     if (!el) return;
//     if (current) el.variantName = current;
//   }, [current]);

//   return (
//     <Shell>
//       <Section
//         title="Variants & Annotations"
//         description="Switch between Lamborghini models and their material variants."
//       >
//         <div className="flex flex-wrap items-center gap-3 mb-3">
//           {/* Model Selector */}
//           <label className="text-sm flex items-center gap-2">
//             Model:
//             <select
//               className="rounded border px-2 py-1"
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//             >
//               {Object.keys(models).map((m) => (
//                 <option key={m} value={m}>
//                   {m.charAt(0).toUpperCase() + m.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </label>

//           {/* Variant Selector */}
//           <label className="text-sm flex items-center gap-2">
//             Material Variant:
//             <select
//               className="rounded border px-2 py-1"
//               value={current}
//               onChange={(e) => setCurrent(e.target.value)}
//             >
//               {variants.length === 0 && (
//                 <option value="">(no variants found)</option>
//               )}
//               {variants.map((v) => (
//                 <option key={v} value={v}>
//                   {v}
//                 </option>
//               ))}
//             </select>
//           </label>

//           {/* Annotation Toggle */}
//           <label className="text-sm flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={showAnno}
//               onChange={(e) => setShowAnno(e.target.checked)}
//             />{" "}
//             Show annotations
//           </label>
//         </div>

//         {/* Model Viewer */}
//         <MV ref={mvRef} src={models[selectedModel]} reveal="interaction">
//           {showAnno && (
//             <>
//               <button
//                 slot="hotspot-engine"
//                 data-position="0.2 0.08 0.35"
//                 data-normal="0 1 0"
//                 data-visibility-attribute="visible"
//                 className="Hotspot"
//               >
//                 <div>Engine</div>
//               </button>
//               <button
//                 slot="hotspot-wheel"
//                 data-position="0.35 0.02 0.0"
//                 data-normal="0 1 0"
//                 data-visibility-attribute="visible"
//                 className="Hotspot"
//               >
//                 <div>Wheel</div>
//               </button>
//             </>
//           )}
//         </MV>
//       </Section>
//     </Shell>
//   );
// };


// // --- Camera Fly-to Page ---
// const Camera = () => {
//   const mv = useRef(null);
//   const targets = [
//     {
//       name: "Isometric",
//       target: "0m 0.05m 0m",
//       orbit: "45deg 60deg 1.2m",
//       fov: "35deg",
//     },
//     {
//       name: "Front Close",
//       target: "0m 0.05m 0.2m",
//       orbit: "0deg 10deg 0.6m",
//       fov: "30deg",
//     },
//     {
//       name: "Top",
//       target: "0m 0.2m 0m",
//       orbit: "0deg 90deg 0.9m",
//       fov: "45deg",
//     },
//     {
//       name: "Side",
//       target: "0.2m 0.05m 0m",
//       orbit: "90deg 10deg 0.8m",
//       fov: "30deg",
//     },
//   ];

//   const flyTo = (t) => {
//     const el = mv.current;
//     if (!el) return;
//     el.setAttribute("camera-target", t.target);
//     el.setAttribute("camera-orbit", t.orbit);
//     el.setAttribute("field-of-view", t.fov);
//   };

//   return (
//     <Shell>
//       <Section
//         title="Camera Fly-to"
//         description="Jump the camera to preset targets/orbits."
//       >
//         <div className="flex flex-wrap gap-2 mb-3">
//           {targets.map((t) => (
//             <button
//               key={t.name}
//               onClick={() => flyTo(t)}
//               className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-100 text-sm shadow-sm transition"
//             >
//               {t.name}
//             </button>
//           ))}
//         </div>
//         <MV ref={mv} src="/src/Components/Astronaut.glb" camera-controls auto-rotate>
//           <button
//             slot="hotspot-front"
//             data-position="0 0.05 0.2"
//             data-normal="0 1 0"
//             data-visibility-attribute="visible"
//             className="Hotspot"
//           >
//             <div>Front Target</div>
//           </button>
//           <button
//             slot="hotspot-side"
//             data-position="0.2 0.05 0"
//             data-normal="0 1 0"
//             data-visibility-attribute="visible"
//             className="Hotspot"
//           >
//             <div>Side Target</div>
//           </button>
//         </MV>
//       </Section>
//     </Shell>
//   );
// };

// // =====================
// // App + Router
// // =====================
// export default function App() {
//   return (
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/hotspots" element={<Hotspots />} />
//         <Route path="/dimensions" element={<Dimensions />} />
//         <Route path="/variants" element={<Variants />} />
//         <Route path="/camera" element={<Camera />} />
//         <Route path="/slider" element={<Slider />} />

//       </Routes>
//     </HashRouter>
//   );
// }

// // =====================
// // Minimal styles for hotspot buttons (better tooltips)
// // =====================
// const styleEl = document.createElement("style");
// styleEl.innerHTML = `
//   model-viewer::part(default-progress-bar) {
//     height: 3px;
//     background: linear-gradient(to right, #3b82f6, #9333ea);
//   }
//   .Hotspot {
//     border: none;
//     background: transparent;
//     transform: translate(-50%, -50%);
//   }
//   .Hotspot div {
//     padding: 6px 10px;
//     font-size: 12px;
//     border-radius: 0.5rem;
//     background: rgba(15, 23, 42, 0.9);
//     color: white;
//     box-shadow: 0 2px 6px rgba(0,0,0,0.25);
//     backdrop-filter: blur(6px);
//     transition: transform 0.2s ease, opacity 0.2s ease;
//   }
//   .Hotspot:hover div {
//     transform: scale(1.05);
//     opacity: 0.95;
//   }
// `;
// document.head.appendChild(styleEl);


