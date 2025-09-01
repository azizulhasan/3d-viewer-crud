import { useState } from "react";
import { Section } from "./Shared.js";

export const HomeComponent = () => (
  <div className="art-grid md:art-grid-cols-2 art-gap-6">
    <Section
      title="Welcome"
      description="This is a 4-page React demo using the @google/model-viewer web component."
    >
      <ul className="art-list-disc art-pl-5 art-text-sm art-text-slate-700 art-space-y-1">
        <li>Hotspots with labels</li>
        <li>Simple Dimensions readout</li>
        <li>Annotations & Variants selector</li>
        <li>Camera fly-to targets</li>
      </ul>
    </Section>
    <Section title="Quick Tips">
      <ol className="art-list-decimal art-pl-5 art-text-sm art-space-y-1 art-text-slate-700">
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
            className="art-text-blue-600 art-underline"
          >
            modelviewer.dev
          </a>
        </li>
      </ol>
    </Section>
  </div>
);
