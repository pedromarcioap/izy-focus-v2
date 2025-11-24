# External Dependencies

Chrome Manifest V3 extensions prohibit the use of remotely hosted code (CDNs). To run this extension without a bundler, you must download the **ES Module (ESM)** versions of the required libraries.

## Required Files

Please download the files from the links below and save them into this `libs/` folder with the exact filenames specified.

1.  **React 19 (ESM)**
    *   **Download:** `https://esm.sh/react@19?target=es2022`
    *   **Save as:** `react.js`

2.  **ReactDOM 19 (ESM)**
    *   **Download:** `https://esm.sh/react-dom@19?target=es2022`
    *   **Save as:** `react-dom.js`

3.  **ReactDOM Client 19 (ESM)**
    *   **Download:** `https://esm.sh/react-dom@19/client?target=es2022`
    *   **Save as:** `react-dom-client.js`

4.  **Google GenAI SDK (ESM)**
    *   **Download:** `https://esm.sh/@google/genai@0.1.0?target=es2022` (or latest compatible version)
    *   **Save as:** `google-genai.js`

5.  **Recharts (ESM)**
    *   **Download:** `https://esm.sh/recharts?target=es2022`
    *   **Save as:** `recharts.js`

**Important:** Do not use the UMD/minified builds from unpkg/cdnjs as they do not export ES modules and will cause imports to fail.
