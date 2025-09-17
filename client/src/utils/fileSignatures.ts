interface FileSignaturesI {
  signature: string;
  MIME: string;
}

const fileSignatures: FileSignaturesI[] = [
  { signature: "JVBERi0", MIME: "application/pdf" },
  { signature: "iVBORw0KGgo", MIME: "image/png" },
  { signature: "/9j/4", MIME: "image/jpg" },
  { signature: "Qk02U", MIME: "image/bmp" },
  { signature: "SUkqAA", MIME: "image/tif" },
  { signature: "TU0AKg", MIME: "image/tiff" },
  { signature: "SUkrAA", MIME: "image/tif" },
  { signature: "TU0AKw", MIME: "image/tiff" },
  { signature: "di8xAQ", MIME: "image/exr" },
  { signature: "UklGRg", MIME: "image/webp" },
  { signature: "Qk02U", MIME: "image/bmp" },
  { signature: "R0lGODdh", MIME: "image/gif" },
  { signature: "R0lGODlh", MIME: "image/gif" },
];

export default fileSignatures;
