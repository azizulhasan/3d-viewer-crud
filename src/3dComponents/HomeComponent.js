
import { useState } from "react";
import { Section } from "./Shared.js";

export const HomeComponent = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Section
      title="Welcome"
      description="This is a 4-page React demo using the @google/model-viewer web component."
    >
      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
        <li>Hotspots with labels</li>
        <li>Simple Dimensions readout</li>
        <li>Annotations & Variants selector</li>
        <li>Camera fly-to targets</li>
      </ul>
    </Section>
    <Section title="Quick Tips">
      <ol className="list-decimal pl-5 text-sm space-y-1 text-slate-700">
        <li>
          Replace <code>/models/*.glb</code> with your files.
        </li>
        <li>Each page shows a focused feature set.</li>
        <li>
          Model Viewer docs →{" "}
          <a
            href="https://modelviewer.dev"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            modelviewer.dev
          </a>
        </li>
      </ol>
    </Section>
  </div>
);