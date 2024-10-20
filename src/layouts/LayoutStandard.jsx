// LayoutStandard.jsx
import React from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Navigator } from "../components/navigator";

export function LayoutStandard({ children }) {
  return (
    <>
      <Header /> {/* Header estándar */}
      <div className="main-content">
        
        {children}
      </div>
      <Footer /> {/* Footer estándar */}
    </>
  );
}