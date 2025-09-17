/// <reference types="vite/client" />

// For svg ==================================
declare module "*.svg?react" {
  import { FunctionComponent, SVGProps } from "react";
  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}

// Chat[] ==================================
type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  images?: Base64URLString[];
};

type Chat = {
  _id?: ObjectID;
  title?: string;
  messages: Message[];
  timestamp?: Date;
};

type Chats = Chat[];

// JwtPayloadCustomT =========================
type JwtPayloadCustomT = {
  email: string;
};

// User =======================================
interface User {
  email?: string;
  password?: string;
  confirmPwd?: string;
  code?: string;
}

//search and deep thin R1 button
type ButtonToggleT = {
  think: boolean;
  search: boolean;
};

// For submit function parameter in Home.tsx
type SubmitEventT =
  | React.FormEvent<HTMLFormElement>
  | React.KeyboardEvent
  | React.MouseEvent<HTMLButtonElement>
  | React.MouseEvent<HTMLDivElement>;

// for LLM List in Home.tsx======================
type Model = {
  name: string;
  model: string;
  modified_at: string;
  size: string;
  digest: string;
};
