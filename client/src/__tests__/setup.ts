// Define a minimal interface for what PDF.js expects from DOMMatrix
interface SimpleDOMMatrix {
  m11: number;
  m12: number;
  m13: number;
  m14: number;
  m21: number;
  m22: number;
  m23: number;
  m24: number;
  m31: number;
  m32: number;
  m33: number;
  m34: number;
  m41: number;
  m42: number;
  m43: number;
  m44: number;
}

if (typeof window !== "undefined" && !window.DOMMatrix) {
  const DOMMatrixShim = class implements SimpleDOMMatrix {
    m11 = 1;
    m12 = 0;
    m13 = 0;
    m14 = 0;
    m21 = 0;
    m22 = 1;
    m23 = 0;
    m24 = 0;
    m31 = 0;
    m32 = 0;
    m33 = 1;
    m34 = 0;
    m41 = 0;
    m42 = 0;
    m43 = 0;
    m44 = 1;

    constructor() {
      return this;
    }
  };

  // Use 'globalThis' or 'Object.defineProperty' to bypass the 'any' requirement on window
  Object.defineProperty(window, "DOMMatrix", {
    writable: true,
    configurable: true,
    value: DOMMatrixShim,
  });
}
