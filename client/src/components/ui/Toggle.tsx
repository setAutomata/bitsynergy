import "./Toggle.css";
import { useState } from "react";

function Toggle() {
  const [left, setLeft] = useState(false);

  return (
    <div
      className="toggle"
      onClick={() => setLeft(!left)}
      style={
        left
          ? { justifyContent: "left" }
          : { justifyContent: "right", background: "#3b82f6" }
      }
    >
      <div className="toggle__knob"></div>
    </div>
  );
}

export default Toggle;
