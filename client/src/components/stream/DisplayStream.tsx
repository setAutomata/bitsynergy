import "./DisplayStream.css";
import "./markdownStyle.css";
import { Fragment } from "react";
import Markdown from "markdown-to-jsx";
import CodeBlock from "./CodeBlock";
import fileSignatures from "../../utils/fileSignatures";
import WolfLogo from "/favicon.svg";
import Copy from "../../assets/images/copy.svg?react";
import Regenerate from "../../assets/images/regenerate.svg?react";
import Like from "../../assets/images/like.svg?react";
import Dislike from "../../assets/images/dislike.svg?react";

interface IDisplayStreamProps {
  messages: Message[];
  isStreaming: boolean;
  isSubmitted: boolean;
  isLoading: boolean;
}

function DisplayStream({
  messages,
  isStreaming,
  isSubmitted,
  isLoading,
}: IDisplayStreamProps) {
  const lastMessage = messages.length - 1;

  function extractMIME(base64: string): string | null {
    for (const { signature, MIME } of fileSignatures) {
      if (base64.startsWith(signature)) return MIME;
    }
    return null;
  }

  return (
    <>
      {messages.map((message, index) => (
        <Fragment key={index}>
          {message.role === "user" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="userPrompt">
                <div>{message.content}</div>
              </div>
              {message.images && message.images?.length > 0 && (
                <div className="uploaded_img_container">
                  <img
                    src={
                      `data:` +
                      extractMIME(message.images[message.images?.length - 1]) +
                      `;base64,${message.images[message.images?.length - 1]}`
                    }
                    alt="uploaded image"
                  />
                </div>
              )}
            </div>
          ) : (
            <section className="ai_messages markdown-content">
              <div
                style={{
                  display: "flex",
                  gap: "0.7rem",
                  width: "95%",
                }}
              >
                <img
                  src={WolfLogo}
                  className={
                    isStreaming && lastMessage === index
                      ? "ai_messages_logo rotate"
                      : "ai_messages_logo"
                  }
                  width="25"
                />
                <Markdown
                  style={{ width: "inherit" }}
                  options={{
                    overrides: {
                      pre: {
                        component: ({ children }) => children,
                      },
                      code: { component: CodeBlock },
                    },
                  }}
                >
                  {message.content.replace(/\\n/g, "\n")}
                </Markdown>
              </div>
              {isSubmitted && !isLoading && !isStreaming && (
                <div className="prompt_opt">
                  <Copy width="17" />
                  <Regenerate width="17" />
                  <Like />
                  <Dislike />
                </div>
              )}
            </section>
          )}
        </Fragment>
      ))}
    </>
  );
}

export default DisplayStream;
