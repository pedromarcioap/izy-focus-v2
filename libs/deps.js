// Central dependency hub to replace Import Maps.
// This allows us to use relative imports which are CSP-compliant.

import * as ReactPkg from './react.js';
import * as ReactDOMPkg from './react-dom.js';
import * as ReactDOMClientPkg from './react-dom-client.js';
import * as RechartsPkg from './recharts.js';
export { GoogleGenAI, Type } from './google-genai.js';

// --- React ---
// Handle potential ESM interop issues (default vs named exports)
const React = ReactPkg.default ? ReactPkg.default : ReactPkg;
export { React };

// Export React Hooks directly
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const createContext = React.createContext;
export const useContext = React.useContext;

// --- ReactDOM ---
const ReactDOM = ReactDOMPkg.default ? ReactDOMPkg.default : ReactDOMPkg;
const ReactDOMClient = ReactDOMClientPkg.default ? ReactDOMClientPkg.default : ReactDOMClientPkg;

export const createRoot = ReactDOMClient.createRoot;

// --- Recharts ---
const Recharts = RechartsPkg.default ? RechartsPkg.default : RechartsPkg;

export const ResponsiveContainer = Recharts.ResponsiveContainer;
export const BarChart = Recharts.BarChart;
export const Bar = Recharts.Bar;
export const XAxis = Recharts.XAxis;
export const YAxis = Recharts.YAxis;
export const Tooltip = Recharts.Tooltip;
export const CartesianGrid = Recharts.CartesianGrid;