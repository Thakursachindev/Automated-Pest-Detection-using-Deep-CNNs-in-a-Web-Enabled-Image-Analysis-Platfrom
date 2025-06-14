import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ResNet from "./pages/ResNet";
import YOLO from "./pages/YOLO";
import YOLOVideo from "./pages/YOLOVideo";
import YOLOWebcam from "./pages/YOLOWebcam";
import PestLookup from "./components/PestLookup";
import ScrollToTop from "./components/ScrollToTop";

import { AnimatePresence, motion } from "framer-motion"; // ✅ NEW

function App() {
  const location = useLocation(); // ✅

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResNet />
              </motion.div>
            }
          />
          <Route
            path="/yolo"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <YOLO />
              </motion.div>
            }
          />
          <Route
            path="/yolo-video"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <YOLOVideo />
              </motion.div>
            }
          />
          <Route
            path="/yolo/webcam"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <YOLOWebcam />
              </motion.div>
            }
          />
          <Route
            path="/lookup"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PestLookup />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
