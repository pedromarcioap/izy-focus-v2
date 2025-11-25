import { React, createRoot } from './libs/deps.js';
import App from './App';

console.log("Izy Focus starting...");

// Global Error Handler for Black Screen Debugging
window.addEventListener('error', (event) => {
  console.error("Global Error:", event.error);
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 20px; color: #ef4444; background: #18181b; height: 100vh; font-family: sans-serif;">
        <h2 style="margin-bottom: 10px;">Startup Error</h2>
        <pre style="white-space: pre-wrap; background: #000; padding: 10px; border-radius: 8px; overflow: auto;">${event.message}</pre>
        <p style="margin-top: 10px; color: #a1a1aa; font-size: 12px;">Check console for details.</p>
      </div>
    `;
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React app mounted successfully.");
} catch (e) {
  console.error("Failed to mount React app:", e);
  rootElement.innerHTML = `<div style="color:red; padding:20px">Mount Error: ${e.message}</div>`;
}