import React from "react";
import { Routes, Route } from "react-router-dom";
import OriginalResearch1 from "./components/OriginalResearch1/OriginalResearch1";
import OriginalResearch2 from "./components/OriginalResearch2/OriginalResearch2";
import SwiftFoliosResearchForm from "./components/SwiftFoliosResearchForm/SwiftFoliosResearchForm";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        
        <Route path="/form" element={<SwiftFoliosResearchForm />} /> 
        <Route
          path="/research1"
          element={<OriginalResearch1 />}
        />
        
        <Route
          path="/research2"
          element={<OriginalResearch2 />}
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;
