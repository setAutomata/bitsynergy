import "./SidePanel.css";
import React, {
  Fragment,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import type { HomeAction } from "../../pages/home/Home.reducer";
import Modal from "../ui/Modal";
import AuthContext from "../../context/AuthContext";
import NewChat_btn from "../ui/NewChat_btn";
import * as apiCall from "../../request/apiCalls";
import * as utils from "../../utils/utils";
import Banner from "../Banner/Banner";
import Options from "./Options";
import MobileHeader from "./MobileHeader";
import LogoText from "../../assets/images/logo-text.svg?react";
import Close from "../../assets/images/close_sign.svg?react";
import NewChat from "../../assets/images/newChat.svg?react";
import Open from "../../assets/images/open_sign.svg?react";
import Logo from "/favicon.svg";
import QrCode from "../../assets/images/qr-code.png";
import Edit from "../../assets/images/edit.svg?react";
import Mobile from "../../assets/images/mobile.svg?react";
import Delete from "../../assets/images/delete.svg?react";
import Account from "../../assets/images/account.svg?react";

const getApp_min_style: React.CSSProperties = {
  justifyContent: "center",
  border: "none",
  padding: "0.3rem",
  margin: "0 0 1.5rem 0",
  width: "fit-content",
  height: "fit-content",
  borderRadius: "0.4rem",
};

const bottomProfile: React.CSSProperties = {
  padding: "0",
  background: "none",
  justifyContent: "center",
  marginBottom: "0",
};

type SidePanelPropsT = {
  setChats: React.Dispatch<SetStateAction<Chats>>;
  handleNewChat: () => void;
  isStreaming: boolean;
  dispatch: React.Dispatch<HomeAction>;
};

const SidePanel = memo(
  ({ setChats, handleNewChat, isStreaming, dispatch }: SidePanelPropsT) => {
    const { accessToken } = useContext(AuthContext);
    const email =
      accessToken && jwtDecode<JwtPayloadCustomT>(accessToken).email;
    const [screen, setScreen] = useState({
      mobile: false,
      desktop: true,
    });
    const [active_renDel, setActive_renDel] = useState<string | null>(null);
    const [activeHist, setActiveHist] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [activeEdit, setActiveEdit] = useState<string | null>(null);
    const [sidePanel, setSidePanel] = useState({ open: false });
    const [serverMsg, setServerMsg] = useState("");
    const sidepanelRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const profileOptRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<(HTMLInputElement | null)[]>([]);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const ren_del = useRef<HTMLDivElement>(null);

    const memoizedBanner = useMemo(
      () => <Banner message={serverMsg} setMsg={setServerMsg}></Banner>,
      [serverMsg]
    );

    const { data, refetch } = useQuery({
      queryKey: ["chats"],
      queryFn: () => apiCall.getChat(email),
    });

    if (!isStreaming) refetch();

    useEffect(() => {
      const closeEditDeleteDialog = (e: MouseEvent) => {
        if (ren_del.current && !ren_del.current.contains(e.target as Node)) {
          setActive_renDel(null);
        }
      };

      const closeTitleContainerBorder = (e: MouseEvent) => {
        if (
          titleContainerRef.current &&
          !titleContainerRef.current.contains(e.target as Node)
        )
          setActiveEdit(null);
      };

      document.addEventListener(
        "click",
        closeEditDeleteDialog as unknown as EventListener,
        true
      );
      document.addEventListener(
        "click",
        closeTitleContainerBorder as unknown as EventListener,
        true
      );

      return () => {
        document.removeEventListener(
          "click",
          closeEditDeleteDialog as unknown as EventListener,
          true
        );
        document.removeEventListener(
          "click",
          closeTitleContainerBorder as unknown as EventListener,
          true
        );
      };
    }, []);

    function handleOpen() {
      if (sidepanelRef.current) {
        if (screen.mobile) sidepanelRef.current.style.display = "flex";
        if (screen.desktop) sidepanelRef.current.style.width = "15rem";
      }
      setSidePanel((prev) => ({ ...prev, open: true }));
    }

    function handleClose() {
      setSidePanel((prev) => ({ ...prev, open: false }));
      if (sidepanelRef.current) {
        if (screen.mobile) sidepanelRef.current.style.display = "none";
        if (screen.desktop) sidepanelRef.current.style.width = "3rem";
      }
    }

    function openDeletDialog() {
      modalRef.current?.showModal();
    }

    function newChat() {
      handleNewChat();
      setActiveHist(null);
    }

    async function updateTitle(index: number) {
      const resp = await apiCall.updateTitle(
        utils.sanitizePrompt(titleInputRef.current[index]?.value as string),
        email as string,
        id as string
      );
      if (resp) {
        refetch();
        setServerMsg(resp);
      }
    }

    return (
      <>
        {/* =========== Buttons when width=mobile phone ===========*/}
        <MobileHeader
          handleOpen={handleOpen}
          handleClose={handleClose}
          newChat={newChat}
          setScreen={setScreen}
        />
        {/* ============== Dialogue box ============= */}
        <Modal
          dialogRef={modalRef}
          id={id as string}
          email={email as string}
          refetch={refetch}
          newChat={newChat}
        />
        {/* -------- Message Banner ---------*/}
        {memoizedBanner}
        {/* ====================== Side-panel ====================*/}
        <main
          ref={sidepanelRef}
          className="sidePanel__container"
          style={screen.mobile ? { display: "none" } : { width: "3rem" }}
        >
          <div
            className="sidePanel__top"
            style={
              sidePanel.open
                ? { flexDirection: "row", margin: "-0.5rem 0" }
                : {
                    flexDirection: "column",
                    gap: "2.5rem",
                    margin: "2rem 0 1.5rem 0",
                  }
            }
          >
            <div>
              <img
                className="curs-ptr"
                onClick={handleOpen}
                src={Logo}
                alt="wolf logo"
                height="35rem"
                style={
                  sidePanel.open ? { display: "none" } : { display: "block" }
                }
              />
              <LogoText
                className="sidePanel__bitSynergy"
                color="#777"
                style={
                  sidePanel.open ? { display: "block" } : { display: "none" }
                }
              />
            </div>
            {/* --------------- Open & Close buttons --------------- */}
            <Tooltip
              id="open-btn"
              render={() => <p className="sml-fnt">Open sidebar</p>}
            />
            <div
              data-tooltip-id="open-btn"
              style={
                sidePanel.open ? { display: "none" } : { display: "block" }
              }
            >
              <button onClick={handleOpen}>
                <Open className="sidePanel__closeOpen" />
              </button>
            </div>
            <Tooltip
              id="close-btn"
              render={() => <p className="sml-fnt">Close sidebar</p>}
            />
            <div
              data-tooltip-id="close-btn"
              style={
                sidePanel.open ? { display: "block" } : { display: "none" }
              }
            >
              <button onClick={handleClose}>
                <Close className="sidePanel__closeOpen" />
              </button>
            </div>
          </div>

          {/* ------------------[ New-chat Btn ]-------------------- */}
          <NewChat_btn
            inlineStyle={sidePanel.open ? {} : { display: "none" }}
            clickHandler={newChat}
          />
          <Tooltip
            id="newChat-btn"
            render={() => <p className="sml-fnt">New Chat</p>}
          />
          <div
            data-tooltip-id="newChat-btn"
            className="sidePanel__newChat__min"
            onClick={newChat}
            style={sidePanel.open ? { display: "none" } : { display: "flex" }}
          >
            <NewChat className="newChat_narrow" />
          </div>
          {/* =================[ Chat lists ]================== */}
          <div
            className="sidePanel__history_wrapper"
            style={sidePanel.open ? { display: "block" } : { display: "none" }}
          >
            {data?.map((chat, i) => (
              <Fragment key={chat._id}>
                {/* -------- [Date]-------- */}
                <div
                  className="sidePanel__text"
                  style={
                    sidePanel.open ? { display: "block" } : { display: "none" }
                  }
                >
                  {utils.formatDate(chat.timestamp)}
                </div>
                <div
                  ref={activeEdit === chat._id ? titleContainerRef : null}
                  className="sidePanel__history__container"
                  onClick={() => setActiveHist(chat._id)}
                  style={{
                    background:
                      chat._id === activeHist ? "#5555627f" : "transparent",
                    border:
                      chat._id === activeEdit
                        ? "2px solid var(--accentColor)"
                        : undefined,
                  }}
                >
                  <div
                    className={
                      activeEdit === chat._id
                        ? "sidePanel__history cursorText"
                        : "sidePanel__history"
                    }
                    onBlur={() => {
                      setChats([chat]);
                    }}
                    onClick={() => {
                      setChats([chat]);
                      dispatch({ type: "SET_SUBMITTED", payload: true });
                    }}
                  >
                    <input
                      ref={(element) => {
                        titleInputRef.current[i] = element;
                      }}
                      type="text"
                      defaultValue={chat.title}
                      disabled={activeEdit === chat._id ? false : true}
                      style={
                        activeEdit === chat._id
                          ? { pointerEvents: "fill" }
                          : { pointerEvents: "none" }
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateTitle(i);
                        }
                      }}
                    />
                  </div>
                  <div className="sidePanel__history__editBtn">
                    <button
                      className="editBtn"
                      onClick={() => setActive_renDel(chat._id)}
                    >
                      ...
                    </button>
                  </div>
                </div>
                {/* ----- rename & delete buttons ----- */}
                <div
                  className="rename-delete__container"
                  ref={active_renDel === chat._id ? ren_del : null}
                  style={
                    active_renDel === chat._id
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <Tooltip
                    id="edit-btn"
                    render={() => (
                      <p>
                        After editing click{" "}
                        <b style={{ color: "var(--accentColor)" }}>Enter</b> to
                        submit
                      </p>
                    )}
                  />
                  <div
                    data-tooltip-id="edit-btn"
                    className="ren-del ren"
                    style={{ color: "var(--light-text-color)" }}
                    onClick={() => {
                      setActiveEdit(chat._id);
                      setId(chat._id);
                      titleInputRef.current[i]?.focus();
                    }}
                  >
                    <Edit />
                    Rename
                  </div>

                  <div
                    className="ren-del del"
                    style={{ color: "red" }}
                    onClick={() => {
                      openDeletDialog();
                      setActiveEdit(chat._id);
                      setId(chat._id);
                    }}
                  >
                    <Delete />
                    Delete
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flex: "0.95" }}></div>
          <div className="sidePanel__bottom">
            <button
              className="sidePanel__bottom__getApp"
              style={sidePanel.open ? {} : getApp_min_style}
            >
              <div className="qrCode">
                <img src={QrCode} alt="qr code" />
                <div style={{ padding: "0.3rem 0", textAlign: "center" }}>
                  Scan to get bitSynergy App
                </div>
              </div>
              <div className="mobileIcon">
                <Mobile
                  style={
                    sidePanel.open
                      ? {}
                      : { transform: "scale(1.4)", padding: "0.4rem" }
                  }
                />
              </div>
              <span
                style={
                  sidePanel.open ? { display: "block" } : { display: "none" }
                }
              >
                Get App
              </span>
              <div
                className="new"
                style={
                  sidePanel.open ? { display: "flex" } : { display: "none" }
                }
              >
                NEW
              </div>
            </button>
            {/* ======================= Acc & options ===================== */}
            <div style={{ position: "relative", width: "100%" }}>
              <Options
                profileOptRef={profileOptRef}
                sidePanel={sidePanel}
                newChat={newChat}
              />
              <button
                className="sidePanel__bottom__profile"
                style={sidePanel.open ? {} : bottomProfile}
                onClick={() => {
                  if (profileOptRef.current)
                    profileOptRef.current.style.display = "block";
                }}
                onMouseOver={() =>
                  sidePanel.open
                    ? { background: "var(--hover-bkg-color)" }
                    : { background: "none" }
                }
              >
                <div className="profileAvatar">
                  <Account />
                </div>
                <span
                  style={
                    sidePanel.open ? { display: "block" } : { display: "none" }
                  }
                >
                  My Profile
                </span>
              </button>
            </div>
          </div>
        </main>
        <section
          className="sidePanel-backdrop"
          onClick={handleClose}
          style={
            sidePanel.open && screen.mobile
              ? { display: "block" }
              : { display: "none" }
          }
        ></section>
      </>
    );
  }
);

export default SidePanel;
