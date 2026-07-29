import React, { useState, useEffect } from "react";

interface RangeState {
  value: number;
  min: number;
  max: number;
  step: number;
}

export function MenuAccesibilidad() {
  const [isOpen, setIsOpen] = useState(false);

  // Estados
  const [fontSize, setFontSize] = useState<RangeState>({ value: 100, min: 90, max: 130, step: 10 });
  const [wordSpacing, setWordSpacing] = useState<RangeState>({ value: 0, min: 0, max: 0.3, step: 0.05 });
  const [lineHeight, setLineHeight] = useState<RangeState>({ value: 1.5, min: 1.2, max: 2.1, step: 0.3 });
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [monochrome, setMonochrome] = useState(false); 
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Hook para tipografía y espaciados
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize.value}%`;
    document.body.style.wordSpacing = `${wordSpacing.value}rem`;
    document.body.style.lineHeight = `${lineHeight.value}`;
  }, [fontSize.value, wordSpacing.value, lineHeight.value]);
  
  //Hook cambiar contrastes 
  useEffect(() => {
    document.body.classList.toggle("a11y-dyslexic", dyslexicFont);
    document.body.classList.toggle("a11y-highlight-links", highlightLinks);
    
    // Lógica de Filtros Combinados 
    let filterStyle = "";
  
    if (monochrome) {
      filterStyle += "grayscale(100%) ";
    }
  
    if (highContrast) {
      filterStyle += "contrast(120%) brightness(100%) ";
    }
  
    document.documentElement.style.filter = filterStyle.trim() || "none";
  }, [dyslexicFont, highlightLinks, monochrome, highContrast]);

  // Hook para clases e invocar Escala de Grises
  useEffect(() => {
    document.body.classList.toggle("a11y-dyslexic", dyslexicFont);
    document.body.classList.toggle("a11y-highlight-links", highlightLinks);
    
    // Filtro global para Escala de Grises
    if (monochrome) {
      document.documentElement.style.filter = "grayscale(100%)";
    } else {
      document.documentElement.style.filter = "none";
    }
  }, [dyslexicFont, highlightLinks, monochrome]);

  // Hook para la Guía de Lectura Corta
  useEffect(() => {
    let guideElement = document.getElementById("a11y-reading-guide");

    if (readingGuide) {
      if (!guideElement) {
        guideElement = document.createElement("div");
        guideElement.id = "a11y-reading-guide";
        document.body.appendChild(guideElement);
      }
      guideElement.style.display = "block";

      const handleMouseMove = (e: MouseEvent) => {
        if (guideElement) {
          guideElement.style.left = `${e.clientX - 300}px`; 
          guideElement.style.top = `${e.clientY - 5}px`;
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else if (guideElement) {
      guideElement.style.display = "none";
    }
  }, [readingGuide]);

  // Hook para el Modo Enfocado 
  useEffect(() => {
    let topMask = document.getElementById("a11y-focus-top");
    let bottomMask = document.getElementById("a11y-focus-bottom");

    if (focusMode) {
      if (!topMask) {
        topMask = document.createElement("div");
        topMask.id = "a11y-focus-top";
        topMask.className = "a11y-focus-mask";
        document.body.appendChild(topMask);
      }
      if (!bottomMask) {
        bottomMask = document.createElement("div");
        bottomMask.id = "a11y-focus-bottom";
        bottomMask.className = "a11y-focus-mask";
        document.body.appendChild(bottomMask);
      }

      topMask.style.display = "block";
      bottomMask.style.display = "block";

      const handleMouseMove = (e: MouseEvent) => {
        const gap = 85; 
        if (topMask && bottomMask) {
          topMask.style.height = `${Math.max(0, e.clientY - gap)}px`;
          bottomMask.style.top = `${e.clientY + gap}px`;
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      if (topMask) topMask.style.display = "none";
      if (bottomMask) bottomMask.style.display = "none";
    }
  }, [focusMode]);

  const handleRangeChange = (
    setter: React.Dispatch<React.SetStateAction<RangeState>>, 
    state: RangeState, 
    delta: number
  ) => {
    const newValue = parseFloat((state.value + delta).toFixed(2));
    const finalValue = Math.min(Math.max(newValue, state.min), state.max);
    setter({ ...state, value: finalValue });
  };

  const resetAll = () => {
    setFontSize({ ...fontSize, value: 100 });
    setWordSpacing({ ...wordSpacing, value: 0 });
    setLineHeight({ ...lineHeight, value: 1.5 });
    setDyslexicFont(false);
    setMonochrome(false);
    setHighlightLinks(false);
    setReadingGuide(false);
    setFocusMode(false);
    document.documentElement.style.fontSize = "100%";
    document.body.style.wordSpacing = "normal";
    document.body.style.lineHeight = "normal";
    document.documentElement.style.filter = "none";
    setHighContrast(false);
    setMonochrome(false);
    document.documentElement.style.filter = "none";
  };

  const RangeOption = ({ label, state, setter, unit = "" }: { label: string, state: RangeState, setter: React.Dispatch<React.SetStateAction<RangeState>>, unit?: string }) => (
    <div style={optionGroupStyle}>
      <span style={labelStyle}>{label}: <strong>{state.value}{unit}</strong></span>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handleRangeChange(setter, state, -state.step)} style={rangeButtonStyle} aria-label={`Disminuir ${label}`}>-</button>
        <button onClick={() => handleRangeChange(setter, state, state.step)} style={rangeButtonStyle} aria-label={`Aumentar ${label}`}>+</button>
      </div>
    </div>
  );

  const ToggleOption = ({ label, state, setter }: { label: string, state: boolean, setter: React.Dispatch<React.SetStateAction<boolean>> }) => (
    <button
      onClick={() => setter(!state)}
      style={{
        ...toggleButtonStyle,
        backgroundColor: state ? "#0056b3" : "#f1f3f5",
        color: state ? "#ffffff" : "#1a1d20"
      }}
      aria-pressed={state}
    >
      {state ? "✓" : ""} {label}
    </button>
  );

  return (
    <div style={{ position: "fixed", top: "15px", right: "30px", zIndex: 10000 }}>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de Opciones de Accesibilidad"
        style={floatingButtonStyle}
      >
        ♿
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div role="dialog" aria-label="Ajustes de accesibilidad" style={menuContainerStyle}>
          <div style={headerStyle}>
            <h2 style={{ fontSize: "18px", margin: 0, color: "#1a1d20" }}>Menú de Accesibilidad</h2>
            <button onClick={() => setIsOpen(false)} style={closeButtonStyle} aria-label="Cerrar">✕</button>
          </div>

          <hr style={dividerStyle} />

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <RangeOption label="Tamaño de texto" state={fontSize} setter={setFontSize} unit="%" />
            <RangeOption label="Espaciado palabras" state={wordSpacing} setter={setWordSpacing} unit="rem" />
            <RangeOption label="Altura de línea" state={lineHeight} setter={setLineHeight} />

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ToggleOption label="Fuente Lectura Fácil (Dislexia)" state={dyslexicFont} setter={setDyslexicFont} />
              <ToggleOption label="Alto Contraste" state={highContrast} setter={setHighContrast} />
              <ToggleOption label="Escala de Grises (Monocromo)" state={monochrome} setter={setMonochrome} />
              <ToggleOption label="Resaltar Enlaces" state={highlightLinks} setter={setHighlightLinks} />
              <ToggleOption label="Guía de Lectura (Barra)" state={readingGuide} setter={setReadingGuide} />
              <ToggleOption label="Modo Enfocado (Máscara)" state={focusMode} setter={setFocusMode} />
            </div>

            <button onClick={resetAll} style={resetButtonStyle}>
              Restablecer todos los ajustes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos
const floatingButtonStyle: React.CSSProperties = { width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#0056b3", color: "#ffffff", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(0,0,0,0.3)", fontSize: "26px", display: "flex", alignItems: "center", justifyContent: "center" };
const menuContainerStyle: React.CSSProperties = { position: "absolute", top: "75px", right: "0", width: "320px", backgroundColor: "#ffffff", color: "#1a1d20", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", border: "1px solid #e9ecef", fontFamily: "system-ui, -apple-system, sans-serif", overflowY: "auto", maxHeight: "80vh" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const closeButtonStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#868e96" };
const dividerStyle: React.CSSProperties = { border: "none", borderTop: "1px solid #e9ecef", margin: "0 0 16px 0" };
const optionGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { fontSize: "14px", fontWeight: 600 };
const rangeButtonStyle: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ced4da", cursor: "pointer", fontSize: "16px", fontWeight: "bold", backgroundColor: "#fff" };
const toggleButtonStyle: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", padding: "12px", borderRadius: "10px", border: "1px solid #ced4da", cursor: "pointer", fontSize: "14px", fontWeight: "600" };
const resetButtonStyle: React.CSSProperties = { ...rangeButtonStyle, backgroundColor: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", marginTop: "10px" };