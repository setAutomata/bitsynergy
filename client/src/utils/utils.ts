import React from "react";
import langToExt from "./lang-to-ext-map.ts";
import * as pdfjsLib from "pdfjs-dist";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export function handleInputState(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<User>>,
) {
  const { name, value } = e.target;
  setState((prev) => ({ ...prev, [name]: value }));
}

export function validateEmail(
  email: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>,
) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email)
    setErrorMsg((prev) => ({
      ...prev,
      email: "Please enter the phone number / email address.",
    }));
  else if (!emailRegex.test(email))
    setErrorMsg((prev) => ({
      ...prev,
      email: "Please provide a valid email address.",
    }));
}

export function validatePassword(
  password: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>,
) {
  if (!password)
    setErrorMsg((prev) => ({
      ...prev,
      password: "Please enter your password.",
    }));
  else if (password.length < 6)
    setErrorMsg((prev) => ({
      ...prev,
      password: "Password must be 6 or more characters.",
    }));
}

export function validateConfirmPwd(
  confirmPwd: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>,
) {
  if (!confirmPwd)
    setErrorMsg((prev) => ({
      ...prev,
      confirmPwd: "Please re-enter your password for confirmation.",
    }));
  else if (confirmPwd.length < 6)
    setErrorMsg((prev) => ({
      ...prev,
      confirmPwd: "Password must be 6 or more characters.",
    }));
}

export function validateCode(
  code: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>,
) {
  const codeRegex = /^[0-9]{3,6}$/;
  if (!code) {
    return setErrorMsg((prev) => ({
      ...prev,
      code: "Empty verification code.",
    }));
  }
  if (!codeRegex.test(code))
    return setErrorMsg((prev) => ({
      ...prev,
      code: "Wrong verification code.",
    }));
}

export function formatEmail(email: string) {
  const local = email.split("@")[0];
  const domain = email.split("@")[1];
  return local.slice(0, 2) + "***" + local.slice(-2) + "@" + domain;
}

export function sanitizePrompt(word: string) {
  return (
    word
      // Remove common prompt injection markers and delimiters
      .replace(/---|"""|'''|>>>|\n{2,}/g, " ")
      // Remove special characters often used in code injection or abuse
      .replace(/[\\$`"<>|&;{}[\]*^~]/g, "")
      // Remove control characters (ASCII 0–31)
      .replace(/[\p{C}]/gu, "")
      // Replace multiple spaces by one
      .replace(/ +(?= )/g, "")
      .trim()
  );
}

export async function streamResponse(
  response: Response,
  setChats: React.Dispatch<React.SetStateAction<Chats>>,
): Promise<void | unknown> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      const content: string = JSON.parse(
        decoder.decode(value, { stream: true }),
      ).message.content;

      setChats((prevChats) => {
        const lastChatIndex = prevChats.length - 1;
        const lastChat = prevChats[lastChatIndex];
        const lastMessageIndex = lastChat.messages.length - 1;
        const lastMessage = lastChat.messages[lastMessageIndex];
        const updatedChat = {
          ...lastChat,
          messages: [
            ...lastChat.messages.slice(0, lastMessageIndex),
            {
              ...lastChat.messages[lastMessageIndex],
              content: lastMessage.content + content,
            },
          ],
        };
        const updatedChats = [
          ...prevChats.slice(0, lastChatIndex),
          updatedChat,
        ];
        return updatedChats;
      });
      if (done) break;
    }
  } catch (error) {
    return error;
  } finally {
    reader.releaseLock();
  }
}

export function mapNameToExt(langName: string): string {
  const lang = langToExt.find(
    (langExt) => langExt.name.toLowerCase() === langName.toLowerCase(),
  );
  return lang ? lang.extensions[0] : "txt";
}

export function generateRandomNum(): number {
  return Math.floor(Math.random() * 1000);
}

export function formatDate(date: Date | undefined): string {
  if (!date) return "";
  const dateGap = 1;
  const dateObj = new Date(date);
  const today = new Date().getDate();
  const month = dateObj.getMonth();
  const newMonth = month < 10 ? "0" + month : month;
  const day = dateObj.getDate();
  const newDate = day < 10 ? "0" + day : day;
  if (dateObj.getDate() === today) return "Today";
  if (today - dateObj.getDate() === dateGap) return "Yesterday";
  return dateObj.getFullYear() + "-" + newMonth + "-" + newDate;
}

export async function fileToBase64(file: File): Promise<Base64URLString> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // remove Metadata "data:image/png;base64,"
        resolve(reader.result.split(",")[1] as Base64URLString);
      } else
        reject(
          new Error(`Failed to read file as base64 string. ${reader.error}`),
        );
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
}

export function extractMessages(chatList: Chats): Message[] {
  if (chatList.length === 0) return [];
  return chatList[chatList.length - 1].messages;
}

export const extractPdfText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: typedArray,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: TextItem | TextMarkedContent) => {
          if ("str" in item) return item.hasEOL ? item.str + "\n" : item.str;
          return "";
        })
        .join(" ");

      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return fullText.trim();
  } catch (error) {
    throw new Error(
      `Failed to read PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const TEXT_MIME_TYPES = [
  "application/x-shellscript",
  "application/javascript",
  "application/json",
  "application/xml",
];
