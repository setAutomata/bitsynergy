export type ButtonToggleT = {
  model: boolean;
  search: boolean;
};

export type HomeState = {
  prompt: string;
  isSubmitted: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  clicked: ButtonToggleT;
};

export type HomeAction =
  | { type: "SET_PROMPT"; payload: string }
  | { type: "SET_SUBMITTED"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "EXPAND_LLM" }
  | { type: "TOGGLE_SEARCH" }
  | { type: "RESET_STATE" };

export const initialState: HomeState = {
  prompt: "",
  isSubmitted: false,
  isLoading: false,
  isStreaming: false,
  clicked: {
    model: false,
    search: false,
  },
};

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "SET_PROMPT":
      return { ...state, prompt: action.payload };
    case "SET_SUBMITTED":
      return { ...state, isSubmitted: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };
    case "EXPAND_LLM":
      return {
        ...state,
        clicked: { ...state.clicked, model: !state.clicked.model },
      };
    case "TOGGLE_SEARCH":
      return {
        ...state,
        clicked: { ...state.clicked, search: !state.clicked.search },
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}
