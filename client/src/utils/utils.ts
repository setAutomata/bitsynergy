import React from "react";
import langToExt from "./lang-to-ext-map.ts";

export function handleInputState(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<User>>
) {
  const name = e.target.name;
  const value = e.target.value;
  setState((prev) => ({ ...prev, [name]: value }));
}

export function validateEmail(
  email: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>
) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email)
    setErrorMsg((prev) => ({
      ...prev,
      email: "Please enter the phone number / email address.",
    }));

  if (!emailRegex.test(email))
    setErrorMsg((prev) => ({
      ...prev,
      email: "Please provide a valid email address.",
    }));
}

export function validatePassword(
  password: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>
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
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>
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
  setErrorMsg: React.Dispatch<React.SetStateAction<User>>
) {
  const codeRegex = /^[0-9]{3,6}$/;
  if (!code) {
    return setErrorMsg((prev) => ({
      ...prev,
      code: "Empty verification code.",
    }));
  }
  if (!codeRegex.test(code) || !code)
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
      .replace(/[\x00-\x1F]/g, "")
      .trim()
  );
}

export async function streamResponse(
  response: Response,
  setChats: React.Dispatch<React.SetStateAction<Chats>>
): Promise<void | unknown> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      const content: string = JSON.parse(
        decoder.decode(value, { stream: true })
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
    (langExt) => langExt.name.toLowerCase() === langName.toLowerCase()
  );
  return lang ? lang.extensions[0] : "txt";
}

export function generateRandomNum() {
  return Math.floor((1000 % Math.random()) * 999);
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
  let base64Image: Base64URLString = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // remove "data:image/png;base64,"
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.split(",")[1];
        resolve(base64 as Base64URLString);
      } else reject(new Error("Failed to read file as base64 string"));
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
  return base64Image;
}

export function extractMessages(chatList: Chats): Message[] {
  return chatList.flatMap((chat) => chat.messages);
}
