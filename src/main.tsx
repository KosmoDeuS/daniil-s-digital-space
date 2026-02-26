/**
 * EN: Application entry point. Mounts the root React component (<App />) into the DOM.
 * RU: Точка входа приложения. Монтирует корневой React-компонент (<App />) в DOM.
 *
 * EN: Interacts with: src/App.tsx (root component), src/index.css (global styles), index.html (#root element)
 * RU: Взаимодействует с: src/App.tsx (корневой компонент), src/index.css (глобальные стили), index.html (элемент #root)
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
