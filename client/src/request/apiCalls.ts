import { AxiosError } from "axios";
import axios_ from "./axios";
import React, { type SetStateAction } from "react";
import { handleError } from "../utils/handleError";

const LOGIN_ENDPOINT = "/auth";
const REFRESH_ENDPOINT = "/refresh";
const LOGOUT_ENDPOINT = "/logout";
const SIGNUP_ENDPOINT = "/signup";
const USER_ENDPOINT = "/user";
const CHAT_ENDPOINT = "/chats";
const UPDATE_ACC_ENDPOINT = "/account";
const UPDATE_TITLE_ENDPOINT = "/title";
const OLLAMA_CHAT_ENDPOINT = "/api/chat";
const OLLAMA_TAGS_ENDPOINT = "/api/tags";

export const authenticate = async (
  user: User,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
): Promise<{ data: { accessToken: string } } | undefined> => {
  try {
    setIsLoading(true);
    return await axios_.post(
      LOGIN_ENDPOINT,
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data) throw new Error("$" + err.response.data.message);
    else handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const refreshToken = async (): Promise<string | undefined> => {
  try {
    const response = await axios_.get(REFRESH_ENDPOINT, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data.accessToken;
  } catch (error) {
    return "";
  }
};

export const signup = async (
  user: User,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
): Promise<string | undefined> => {
  try {
    setIsLoading(true);
    const response = await axios_.post(
      SIGNUP_ENDPOINT,
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const logout = async (): Promise<string | undefined> => {
  try {
    return await axios_.delete(LOGOUT_ENDPOINT, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data) return err.response.data.message;
    else return "No Network";
  }
};

export const deleteChat = async (
  _id: string,
  email: string
): Promise<string | undefined> => {
  try {
    const response = await axios_.delete(`${CHAT_ENDPOINT}/${_id}`, {
      data: { email },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data.message;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data) return "$" + err.response.data.message;
  }
};

export const deleteAccount = async (email: string): Promise<string | null> => {
  try {
    const response = await axios_.delete(UPDATE_ACC_ENDPOINT, {
      data: { email: email },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data.message;
  } catch (error) {
    handleError(error);
    return Promise.resolve(null);
  }
};

export const fetchLLMList = async (
  accessToken: string | null
): Promise<any | undefined | null> => {
  if (!accessToken) return Promise.resolve(null);

  try {
    const response = await axios_.get(OLLAMA_TAGS_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return Promise.resolve(null);
  }
};

export const updateTitle = async (
  title: string,
  email: string,
  _id: string
): Promise<string | null> => {
  try {
    const resp = await axios_.put(
      UPDATE_TITLE_ENDPOINT,
      { _id, email, title },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return resp.data.message;
  } catch (error) {
    handleError(error);
    return Promise.resolve(null);
  }
};

export const checkUser = async (
  user: User,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
): Promise<string | undefined> => {
  try {
    setIsLoading(true);
    await axios_.post(USER_ENDPOINT, JSON.stringify({ email: user.email }), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return "success";
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data) return err.response.data.message;
  } finally {
    setIsLoading(false);
  }
};

export const updatePassword = async (
  user: User,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
): Promise<string | null> => {
  try {
    setIsLoading(true);
    await axios_.put(
      UPDATE_ACC_ENDPOINT,
      JSON.stringify({ email: user.email, password: user.password }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return "Password Changed Successfully";
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data) return "$" + err.response.data.message;
    return Promise.resolve(null);
  } finally {
    setIsLoading(false);
  }
};

export const getChat = async (email: string | null): Promise<Chats | null> => {
  try {
    const response = await axios_.post(
      CHAT_ENDPOINT,
      JSON.stringify({ email }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return Promise.resolve(null);
  }
};

export const chat = async (
  messages: Message[],
  accessToken: string | null,
  signal: AbortSignal,
  email: string | null,
  _id: string,
  model: string
): Promise<Response | null> => {
  try {
    return await fetch(
      import.meta.env.VITE_BACKEND_BASEURL + OLLAMA_CHAT_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          _id: _id,
          email: email,
          model: model,
          messages: messages,
          options: {
            temperature: 0.8,
          },
          stream: true,
          keep_alive: "10m",
        }),
        signal: signal,
      }
    );
  } catch (error) {
    handleError(error);
    return Promise.resolve(null);
  }
};
