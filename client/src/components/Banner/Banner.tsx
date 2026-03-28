import "./Banner.css";
import React, { useEffect, useRef, type SetStateAction } from "react";
import Warning from "../../assets/images/warning.svg?react";
import Success from "../../assets/images/success.svg?react";
import Close from "../../assets/images/close.svg?react";

interface BannerPropsI {
  message: string;
  setMsg: React.Dispatch<SetStateAction<string>>;
}

function Banner({ message, setMsg }: BannerPropsI) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.length && modalRef.current) {
      modalRef.current.style.display = "flex";
      const timeoutID = setTimeout(() => {
        setMsg("");
        if (modalRef.current) modalRef.current.style.display = "none";
      }, 3000);
      return () => clearTimeout(timeoutID);
    }
  }, [message]);

  function handleClose() {
    if (modalRef.current) modalRef.current.style.display = "none";
  }

  return (
    <div className="modal_container" ref={modalRef}>
      {message[0] === "$" ? (
        <>
          <Warning width="25" />
          <div>{message.slice(1)}</div>
        </>
      ) : (
        <>
          <Success width="25" />
          <div>{message}</div>
        </>
      )}
      <Close onClick={handleClose} className="modalCloseBtn" />
    </div>
  );
}

export default Banner;
