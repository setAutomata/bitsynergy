import "./CodeBlock.css";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import * as utils from "../../utils/utils.js";
import ThemeContext from "../../context/ThemeContext.js";
import hljs from "highlight.js";
// import "highlight.js/styles/tomorrow-night-bright.css";
// import "highlight.js/styles/github.css";
import Download from "../../assets/images/download.svg?react";
import Copy from "../../assets/images/copy.svg?react";

interface ICodeBlockProps {
  children: string;
  className?: string;
}

function CodeBlock({ children, className }: ICodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { colorScheme } = useContext(ThemeContext);
  const codeRef = useRef<HTMLElement | null>(null);
  const copyHintRef = useRef<HTMLDivElement | null>(null);
  const languageMatch = className
    ? className.match(/lang-(\w+)|language-(\w+)/)
    : null;
  const language = languageMatch ? languageMatch[1] || languageMatch[2] : "";

  function removeExternalCss(href: string) {
    const links = document.querySelectorAll(
      'link[rel="stylesheet"]'
    ) as NodeListOf<HTMLLinkElement>;
    links.forEach((link) => {
      if (link.href === href) document.head.removeChild(link);
    });
  }

  useLayoutEffect(() => {
    if (codeRef.current)
      if (!codeRef.current.dataset.highlighted && language)
        hljs.highlightElement(codeRef.current);
  }, [children, language]);

  useEffect(() => {
    (async () => {
      try {
        if (colorScheme.dark) {
          removeExternalCss("highlight.js/styles/github.css");
          await import("highlight.js/styles/tomorrow-night-bright.css");
        } else {
          removeExternalCss("highlight.js/styles/tomorrow-night-bright.css");
          await import("highlight.js/styles/github.css");
        }
      } catch (error) {
        throw Error("Failed to import theme");
      }
    })();
  }, [colorScheme.dark]);

  async function copyToClipboard() {
    if (codeRef.current) {
      try {
        await navigator.clipboard.writeText(
          codeRef.current.textContent as string
        );
        setCopied(true);
        if (copyHintRef.current) copyHintRef.current.style.display = "block";
        setTimeout(() => {
          setCopied(false);
          if (copyHintRef.current) copyHintRef.current.style.display = "none";
        }, 2000);
      } catch (error) {
        throw Error("Failed to copy to clipboard.");
      }
    }
  }

  function downloadCode(): void {
    if (codeRef.current) {
      const extension = utils.mapNameToExt(language);
      const randNum = utils.generateRandomNum();
      const blob = new Blob([codeRef.current.textContent || ""], {
        type: "text/plain",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = language + "_" + randNum + extension;
      a.click();
    }
  }

  return (
    <span className={language ? "codeContainer" : undefined}>
      {language && (
        <div className="codeBlock-header">
          <div>{language}</div>
          <div className="copyDown-btn">
            <div ref={copyHintRef} className="copy-hint">
              {copied && "Copied"}
            </div>
            <button type="button" onClick={copyToClipboard}>
              <Copy width="14" />
              Copy
            </button>
            <button type="button" onClick={downloadCode}>
              <Download width="14" />
              Download
            </button>
          </div>
        </div>
      )}
      <pre
        style={language ? {} : { overflowX: "unset", display: "inline-block" }}
      >
        <code
          ref={codeRef}
          className={language ? `hljs lang-${language}` : undefined}
          style={
            language
              ? {}
              : {
                  padding: "0.1rem 0.5rem",
                  border: "1px solid #555",
                  color: "var(--gray-text-color)",
                  borderRadius: "0.3rem",
                  margin: "0.5rem 0",
                  whiteSpace: "collapse",
                }
          }
        >
          {children}
        </code>
      </pre>
    </span>
  );
}

export default CodeBlock;
