// Create and inject the import map
const im = document.createElement('script');
im.type = 'importmap';
im.textContent = JSON.stringify({
  "imports": {
    "react": "./libs/react.js",
    "react-dom/client": "./libs/react-dom-client.js",
    "react-dom": "./libs/react-dom.js",
    "@google/genai": "./libs/google-genai.js",
    "recharts": "./libs/recharts.js"
  }
});
document.head.appendChild(im);

// Load the main entry point
const script = document.createElement('script');
script.type = 'module';
script.src = './index.js';
document.body.appendChild(script);
