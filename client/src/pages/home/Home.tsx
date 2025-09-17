import "./Home.css";
import {
  useCallback,
  useContext,
  useRef,
  useState,
  useReducer,
  useEffect,
} from "react";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import ObjectID from "bson-objectid";
import AuthContext from "../../context/AuthContext";
import ThemeContext from "../../context/ThemeContext";
import * as apiCall from "../../request/apiCalls";
import * as utils from "../../utils/utils";
import { homeReducer, initialState } from "./Home.reducer";
import type { HomeState, HomeAction } from "./Home.reducer";
import supportedFileTypes from "../../utils/supportedFileTypes";
import { handleError } from "../../utils/handleError";
import SidePanel from "../../components/panel/SidePanel";
import NewChat_btn from "../../components/ui/NewChat_btn";
import DisplayStream from "../../components/stream/DisplayStream";
import WolfLogo from "/favicon.svg";
import Attachment from "../../assets/images/attachment.svg?react";
import LLM from "../../assets/images/llm.svg?react";
import Search from "../../assets/images/search.svg?react";
import UpArrow from "../../assets/images/upArrow.svg?react";
import Stop from "../../assets/images/stop.svg?react";
import Spinner from "../../assets/images/spinner.svg?react";

function Home() {
  const { accessToken } = useContext(AuthContext);
  const email = accessToken && jwtDecode<JwtPayloadCustomT>(accessToken).email;
  const { colorScheme } = useContext(ThemeContext);
  const [chats, setChats] = useState<Chats>([]);
  const [state, dispatch] = useReducer(homeReducer, initialState) as [
    HomeState,
    React.Dispatch<HomeAction>
  ];
  const [LLMmodel, setLLMmodel] = useState<string>("");
  const inputFile = useRef<HTMLInputElement>(null);
  const contEditRef = useRef<HTMLDivElement>(null);
  const modelsContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data, isError } = useQuery({
    queryKey: ["LLM"],
    queryFn: () => apiCall.fetchLLMList(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data) setLLMmodel(data?.models[0]?.name);
  }, [data]);

  useEffect(() => {
    const closeModelsContainer = (e: MouseEvent) => {
      if (
        modelsContainerRef.current &&
        !modelsContainerRef.current.contains(e.target as Node) &&
        state.clicked.model
      ) {
        dispatch({ type: "EXPAND_LLM" });
        modelsContainerRef.current.style.display = "none";
      }
    };

    document.addEventListener(
      "click",
      closeModelsContainer as unknown as EventListener,
      true
    );

    return () =>
      document.removeEventListener(
        "click",
        closeModelsContainer as unknown as EventListener,
        true
      );
  }, [state.clicked.model]);

  if (isError) handleError("Error fetching LLM Lists");

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.currentTarget.innerText.trim();
    if (text === "\n") return;
    dispatch({ type: "SET_PROMPT", payload: text });
  }

  function expandLLMBtn() {
    dispatch({ type: "EXPAND_LLM" });
    if (modelsContainerRef.current)
      modelsContainerRef.current.style.display = "block";
  }

  function toggleWebSearchBtn() {
    dispatch({ type: "TOGGLE_SEARCH" });
  }

  function openAttachment() {
    inputFile.current?.click();
  }

  const handleNewChat = useCallback(() => {
    dispatch({ type: "SET_SUBMITTED", payload: false });
    setChats([]);
    if (inputFile.current) inputFile.current.value = "";
  }, []);

  function stopStreaming() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch({ type: "SET_STREAMING", payload: false });
    dispatch({ type: "SET_LOADING", payload: false });
  }

  async function handleSubmit(e: SubmitEventT) {
    e.preventDefault();
    if (state.prompt.trim() === "" || state.isStreaming) return;
    dispatch({
      type: "SET_PROMPT",
      payload: utils.sanitizePrompt(state.prompt),
    });
    dispatch({ type: "SET_SUBMITTED", payload: true });
    let base64Image = null;
    const newMsg: Message = { role: "user", content: state.prompt };

    if (inputFile.current?.files?.length) {
      base64Image = await utils.fileToBase64(
        inputFile.current.files[inputFile.current.files.length - 1]
      );
      if (base64Image) newMsg.images = [base64Image];
    }
    const id = chats[chats.length - 1]?._id ?? new ObjectID().toString();
    const updatedMsg: Chats = [
      ...chats,
      {
        _id: id,
        messages: [newMsg, { role: "assistant", content: "" }],
      },
    ];
    setChats(updatedMsg);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    if (contEditRef.current) contEditRef.current.innerText = "";
    if (inputFile.current) inputFile.current.value = "";

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response: Response | null = await apiCall.chat(
        utils.extractMessages(updatedMsg),
        accessToken,
        abortControllerRef.current.signal,
        email,
        id,
        LLMmodel
      );
      if (!response) return handleError("Error: No response received from API");
      await handleStream(response);
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return handleError(error);
    }
  }

  async function handleStream(response: Response) {
    try {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_STREAMING", payload: true });
      await utils.streamResponse(response, setChats);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return handleError("Streaming was aborted");
      } else if (error instanceof Error) {
        return handleError(`Stream Error: ${error.message}`);
      }
    } finally {
      dispatch({ type: "SET_STREAMING", payload: false });
      dispatch({ type: "SET_PROMPT", payload: "" });
      abortControllerRef.current = null;
    }
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && contEditRef.current?.textContent !== "")
      handleSubmit(e);
  }

  return (
    <>
      <div
        className={
          colorScheme.dark ? "home__container" : "home__container light"
        }
      >
        <SidePanel
          setChats={setChats}
          handleNewChat={handleNewChat}
          isStreaming={state.isStreaming}
          dispatch={dispatch}
        />
        {/* ---------------- Title ------------- */}
        <div className="Home__container__main">
          <div className="home__prompt__title">
            {chats.length > 0 &&
              (chats[0].title ??
                chats[0].messages[0].content.slice(0, 30) + "...")}
          </div>
          <div className="home__middle">
            {/* ---------------- Top-half -------------- */}
            <div
              className="home__top-half"
              style={
                state.isSubmitted
                  ? {
                      flex: "0.9",
                      alignItems: "start",
                      justifyContent: "start",
                      height: "auto",
                    }
                  : {}
              }
            >
              <div
                className="home__top-half__container"
                style={state.isSubmitted ? { display: "none" } : {}}
              >
                <div className="home__welcome">
                  <img src={WolfLogo} alt="bitSynergy logo" />
                  <strong>Hey, I'm bitSynergy.</strong>
                </div>
                <div className="home__welcome__question">
                  How may I be of service?
                </div>
              </div>
              {/* ==================== Prompt-response ================ */}
              <div
                className="home__messages"
                style={state.isSubmitted ? { display: "flex" } : {}}
              >
                <DisplayStream
                  messages={utils.extractMessages(chats)}
                  isStreaming={state.isStreaming}
                  isSubmitted={state.isSubmitted}
                  isLoading={state.isLoading}
                />
              </div>
            </div>
            {/* --------------- Bottom-half ------------ */}
            <div
              className="home__bottom-half"
              style={
                state.isSubmitted
                  ? { height: "auto", marginBottom: "2rem" }
                  : {}
              }
            >
              {/* ===================== Input-Box =====================*/}
              {state.isSubmitted && !state.isLoading && !state.isStreaming && (
                <NewChat_btn
                  inlineStyle={{
                    cursor: "pointer",
                    padding: "0.5rem 1.2rem",
                    transform: "scale(0.8)",
                    fontSize: "1.2rem",
                  }}
                  clickHandler={handleNewChat}
                />
              )}
              <div className="home__middle__inputBox">
                <div
                  ref={contEditRef}
                  className="home__middle__inputBox__input"
                  data-placeholder={`Message ${LLMmodel}`}
                  onInput={handleInput}
                  onBlur={(e) => (e.currentTarget.textContent = "")}
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleEnterKey}
                ></div>
                <div className="home__middle__inputBox__bottomRow">
                  <div className="left">
                    <Tooltip
                      id="LLM-Button"
                      place="left"
                      variant="dark"
                      render={() => <p className="sml-fnt">Choose a model</p>}
                    />
                    <button
                      className={
                        state.clicked.model
                          ? "home__LLM__btn LLM-search_btn_clicked"
                          : "home__LLM__btn"
                      }
                      data-tooltip-id="LLM-Button"
                      onClick={expandLLMBtn}
                    >
                      <div className="LLM-label">
                        <LLM
                          fill={
                            state.clicked.model ? "var(--accentColor)" : "white"
                          }
                        />
                        {LLMmodel}
                      </div>
                    </button>

                    <div
                      className="LLM-List-container"
                      ref={modelsContainerRef}
                      style={
                        state.isSubmitted
                          ? ({ positionArea: "top" } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {state.clicked.model &&
                        data?.models?.map((model: Model, i: number) => {
                          return (
                            <div
                              className="LLM-List"
                              key={i}
                              onClick={() => setLLMmodel(model.name)}
                            >
                              {model.name}
                            </div>
                          );
                        })}
                    </div>
                    {/* --------------Search the web btn----------- */}
                    <Tooltip
                      id="search-Button"
                      place="right"
                      render={() => (
                        <p className="sml-fnt">Search the web when necessary</p>
                      )}
                    />
                    <button
                      className={
                        state.clicked.search
                          ? "home__search__btn LLM-search_btn_clicked"
                          : "home__search__btn"
                      }
                      data-tooltip-id="search-Button"
                      onClick={toggleWebSearchBtn}
                    >
                      <Search
                        stroke={
                          state.clicked.search ? "var(--accentColor)" : "white"
                        }
                      />
                      Search
                    </button>
                  </div>
                  {/* ----------------- Attachment --------------- */}
                  <div className="right">
                    <Tooltip
                      id="attachment-btn"
                      place="top"
                      render={() => (
                        <span className="sml-fnt">
                          <b>Text Extraction Only.</b>
                          <br />
                          <p style={{ color: "#888" }}>
                            Upload docs or images (Max 50, 100MB each)
                          </p>
                        </span>
                      )}
                    />
                    <div
                      className="right__attachment"
                      data-tooltip-id="attachment-btn"
                    >
                      <input
                        ref={inputFile}
                        type="file"
                        accept={supportedFileTypes}
                        hidden
                      />
                      <button onClick={openAttachment}>
                        <Attachment width={17} />
                      </button>
                    </div>
                    {/* --------------- Ask btn ---------------- */}
                    <Tooltip
                      id="ask-btn"
                      place="top"
                      render={() =>
                        contEditRef.current?.textContent ? (
                          ""
                        ) : (
                          <p className="sml-fnt">Message is empty</p>
                        )
                      }
                    />
                    <div
                      className={
                        state.prompt || state.isStreaming
                          ? state.isLoading
                            ? "right__askBtn"
                            : "right__askBtn right__askBtn__active"
                          : "right__askBtn"
                      }
                      role="button"
                      onClick={handleSubmit}
                      data-tooltip-id="ask-btn"
                    >
                      {state.isLoading || state.isStreaming ? (
                        state.isStreaming ? (
                          <Stop
                            onClick={(e) => {
                              e.stopPropagation();
                              stopStreaming();
                            }}
                            width="15"
                          />
                        ) : (
                          <Spinner width="20" />
                        )
                      ) : (
                        <UpArrow width="15" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ------------------------------------ */}
          <div className="home__bottom">AI-generated, for reference only</div>
        </div>
      </div>
    </>
  );
}

export default Home;
