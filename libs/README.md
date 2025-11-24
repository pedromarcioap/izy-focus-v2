# External Dependencies

Chrome Manifest V3 extensions prohibit the use of remotely hosted code (CDNs). To run this extension, you must download the following libraries and save them into this `libs/` folder with the exact filenames listed below.

## Required Files

1.  **React 19**
    *   **Download:** https://unpkg.com/react@19/umd/react.production.min.js
    *   **Save as:** `react.js`

2.  **ReactDOM 19**
    *   **Download:** https://unpkg.com/react-dom@19/umd/react-dom.production.min.js
    *   **Save as:** `react-dom.js`

3.  **Google GenAI SDK**
    *   **Info:** This is usually an NPM package. For a browser build without a bundler, you may need a UMD/ESM build of `@google/genai`.
    *   **Save as:** `google-genai.js` (Ensure it exports `GoogleGenAI` and `Type`).

4.  **Recharts**
    *   **Download:** https://unpkg.com/recharts/umd/Recharts.min.js (or similar ESM compatible build)
    *   **Save as:** `recharts.js`

*Note: For a production workflow, it is highly recommended to use a bundler like Vite or Webpack to bundle these dependencies into `index.js`, which avoids the need for a manual `libs` folder and `importmap.json` altogether.*
