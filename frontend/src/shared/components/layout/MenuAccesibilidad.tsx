import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";

interface RangeState {
  value: number;
  min: number;
  max: number;
  step: number;
}

const STORAGE_KEY = "a11y_preferences";

export function MenuAccesibilidad() {
  const [isOpen, setIsOpen] = useState(false);

  //inicializar estado desde localStorage
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[key] !== undefined) return parsed[key];
      }
    } catch (e) {
      console.error("Error reading accessibility preferences:", e);
    }
    return defaultValue;
  };

  // Estados
  const [fontSize, setFontSize] = useState<RangeState>(() =>
    getInitialState("fontSize", { value: 100, min: 90, max: 130, step: 10 })
  );
  const [wordSpacing, setWordSpacing] = useState<RangeState>(() =>
    getInitialState("wordSpacing", { value: 0, min: 0, max: 0.3, step: 0.05 })
  );
  const [lineHeight, setLineHeight] = useState<RangeState>(() =>
    getInitialState("lineHeight", { value: 1.5, min: 1.2, max: 2.1, step: 0.3 })
  );
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() =>
    getInitialState("dyslexicFont", false)
  );
  const [monochrome, setMonochrome] = useState<boolean>(() =>
    getInitialState("monochrome", false)
  );
  const [highlightLinks, setHighlightLinks] = useState<boolean>(() =>
    getInitialState("highlightLinks", false)
  );
  const [readingGuide, setReadingGuide] = useState<boolean>(() =>
    getInitialState("readingGuide", false)
  );
  const [focusMode, setFocusMode] = useState<boolean>(() =>
    getInitialState("focusMode", false)
  );
  const [highContrast, setHighContrast] = useState<boolean>(() =>
    getInitialState("highContrast", false)
  );
  const [noAnimations, setNoAnimations] = useState<boolean>(() =>
    getInitialState("noAnimations", false)
  );

  // Guardar cambios en localStorage
  useEffect(() => {
    const preferences = {
      fontSize,
      wordSpacing,
      lineHeight,
      dyslexicFont,
      monochrome,
      highlightLinks,
      readingGuide,
      focusMode,
      highContrast,
      noAnimations, 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [
    fontSize,
    wordSpacing,
    lineHeight,
    dyslexicFont,
    monochrome,
    highlightLinks,
    readingGuide,
    focusMode,
    highContrast,
    noAnimations,
  ]);

  // Hook para tipografía y espaciados
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize.value}%`;
    document.body.style.wordSpacing = `${wordSpacing.value}rem`;
    document.body.style.lineHeight = `${lineHeight.value}`;
  }, [fontSize.value, wordSpacing.value, lineHeight.value]);

  // Hook unificado para Clases y Filtros en <html> / <body>
  useEffect(() => {
    document.body.classList.toggle("a11y-dyslexic", dyslexicFont);
    document.body.classList.toggle("a11y-highlight-links", highlightLinks);

    let filterStyle = "";
    if (monochrome) filterStyle += "grayscale(100%) ";
    if (highContrast) filterStyle += "contrast(120%) brightness(100%) ";

    document.documentElement.style.filter = filterStyle.trim() || "none";
  }, [dyslexicFont, highlightLinks, monochrome, highContrast]);

  // Posicionamiento de la Guía de Lectura
  useEffect(() => {
    if (!readingGuide) return;

    const guideElement = document.getElementById("a11y-reading-guide");
    const handleMouseMove = (e: MouseEvent) => {
      if (guideElement) {
        guideElement.style.left = `${e.clientX - 350}px`;
        guideElement.style.top = `${e.clientY - 5}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingGuide]);

  // Posicionamiento de la Máscara de Enfoque
  useEffect(() => {
    if (!focusMode) return;

    const topMask = document.getElementById("a11y-focus-top");
    const bottomMask = document.getElementById("a11y-focus-bottom");

    const handleMouseMove = (e: MouseEvent) => {
      const gap = 85;
      if (topMask && bottomMask) {
        topMask.style.height = `${Math.max(0, e.clientY - gap)}px`;
        bottomMask.style.top = `${e.clientY + gap}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
  // Hook para desactivar animaciones
  useEffect(() => {
    document.body.classList.toggle("a11y-no-animations", noAnimations);
  }, [noAnimations]);

  const resetAll = () => {
    setFontSize({ ...fontSize, value: 100 });
    setWordSpacing({ ...wordSpacing, value: 0 });
    setLineHeight({ ...lineHeight, value: 1.5 });
    setDyslexicFont(false);
    setMonochrome(false);
    setHighlightLinks(false);
    setReadingGuide(false);
    setFocusMode(false);
    setHighContrast(false);
    setNoAnimations(false);

    document.documentElement.style.fontSize = "100%";
    document.body.style.wordSpacing = "normal";
    document.body.style.lineHeight = "normal";
    document.documentElement.style.filter = "none";
    document.body.classList.remove("a11y-no-animations");

    localStorage.removeItem(STORAGE_KEY);
  };

  const RangeOption = ({
    label,
    state,
    setter,
    unit = "",
  }: {
    label: string;
    state: RangeState;
    setter: React.Dispatch<React.SetStateAction<RangeState>>;
    unit?: string;
  }) => (
    <div style={optionGroupStyle}>
      <span >
        {label}: <strong>{state.value}{unit}</strong>
      </span>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          onClick={() => handleRangeChange(setter, state, -state.step)}
          style={rangeButtonStyle}
          aria-label={`Disminuir ${label}`}
        >
          -
        </Button>
        <Button
          onClick={() => handleRangeChange(setter, state, state.step)}
          style={rangeButtonStyle}
          aria-label={`Aumentar ${label}`}
        >
          +
        </Button>
      </div>
    </div>
  );

  const ToggleOption = ({
    label,
    state,
    setter,
  }: {
    label: string;
    state: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
  }) => (
    <Button
      onClick={() => setter(!state)}
      style={{
        ...toggleButtonStyle,
        backgroundColor: state ? "#0056b3" : "#f1f3f5",
        color: state ? "#ffffff" : "#1a1d20",
      }}
      aria-pressed={state}
    >
      {state ? "✓" : ""} {label}
    </Button>
  );

  return (
    <>
      {/* Guía de lectura integrada en el árbol de React */}
      {readingGuide && <div id="a11y-reading-guide" style={{ display: "block" }} />}

      {/* Máscaras de enfoque integradas en el árbol de React */}
      {focusMode && (
        <>
          <div id="a11y-focus-top" className="a11y-focus-mask" style={{ display: "block" }} />
          <div id="a11y-focus-bottom" className="a11y-focus-mask" style={{ display: "block" }} />
        </>
      )}

      <div style={{ position: "fixed", top: "15px", right: "30px", zIndex: 10000 }}>
        {/* Botón flotante */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú de Opciones de Accesibilidad"
          style={floatingButtonStyle}
        >
          ♿
        </Button>

        {/* Menú Desplegable */}
        {isOpen && (
          <div role="dialog" aria-label="Ajustes de accesibilidad" style={menuContainerStyle}>
            <div style={headerStyle}>
              <h2 style={{ fontSize: "18px", margin: 0, color: "#1a1d20" }}>Menú de Accesibilidad</h2>
              <Button onClick={() => setIsOpen(false)}  aria-label="Cerrar">
                ✕
              </Button>
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
                <ToggleOption label="Detener Animaciones" state={noAnimations} setter={setNoAnimations} />
              </div>

              <Button onClick={resetAll} style={resetButtonStyle}>
                Restablecer todos los ajustes
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Estilos personalizados
const floatingButtonStyle: React.CSSProperties = { width: "60px", height: "60px",  backgroundColor: "#0056b3", color: "#ffffff", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(0,0,0,0.3)", fontSize: "26px", display: "flex", alignItems: "center", justifyContent: "center" };
const menuContainerStyle: React.CSSProperties = { position: "absolute", top: "75px", right: "0", width: "320px", backgroundColor: "#ffffff", color: "#1a1d20", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", border: "1px solid #e9ecef", fontFamily: "system-ui, -apple-system, sans-serif", overflowY: "auto", maxHeight: "90vh" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const dividerStyle: React.CSSProperties = { border: "none", borderTop: "1px solid #e9ecef", margin: "0 0 16px 0" };
const optionGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const rangeButtonStyle: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: "8px",  cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
const toggleButtonStyle: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", padding: "12px", borderRadius: "10px", border: "1px solid #ced4da", cursor: "pointer"};
const resetButtonStyle: React.CSSProperties = { ...rangeButtonStyle, backgroundColor: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", marginTop: "10px" };