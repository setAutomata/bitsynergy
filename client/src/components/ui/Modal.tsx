import "./Modal.css";
import { type RefObject, useContext, useState, useMemo } from "react";
import * as apiCall from "../../request/apiCalls";
import Banner from "../Banner/Banner";
import ThemeContext from "../../context/ThemeContext";
import Close from "../../assets/images/close.svg?react";

type ModalProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  id: string;
  email: string;
  refetch: () => {};
  newChat: () => void;
};

function Modal({ dialogRef, id, email, refetch, newChat }: ModalProps) {
  const { colorScheme } = useContext(ThemeContext);
  const [serverMsg, setServerMsg] = useState("");

  const memorizedBanner = useMemo(
    () => <Banner message={serverMsg} setMsg={setServerMsg} />,
    [serverMsg]
  );

  async function handleDelete() {
    const resp = await apiCall.deleteChat(id, email as string);
    refetch();
    dialogRef.current?.close();
    if (typeof resp === "string") setServerMsg(resp);
    newChat();
  }
  return (
    <>
      {memorizedBanner}
      <dialog
        className={colorScheme.dark ? "modal" : "modal light"}
        ref={dialogRef}
      >
        <div className="modal__container">
          <div className="modal__topRow">
            <h4>Delete chat?</h4>
            <div
              role="button"
              className="curs-ptr dialogCtr"
              onClick={() => dialogRef.current?.close()}
            >
              <Close />
            </div>
          </div>
          <div className="modal__msg">
            Are you sure you want to delete this chat?
          </div>
          <div className="modal__buttons">
            <button
              className="dialog-btn-cancel"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button className="dialog-btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
