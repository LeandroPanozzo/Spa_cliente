// LayoutCustom.js
import React from 'react';
import { CustomHeader } from "../components/CustomHeader"; // Header distinto
import { Navigator } from "../components/navigator";

export function LayoutCustom({ children }) {
  return (
    <>
      <CustomHeader /> {/* Header personalizado */}
      <div className="main-content">
        <Navigator /> {/* Este estará a la derecha */}
        {children}
      </div>
      {/* No hay footer aquí */}
    </>
  );
}