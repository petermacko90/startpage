import { createContext } from "react";
import { initialState } from "./reducer/reducer";
import { type State } from "./reducer/models";

export const StateContext = createContext<State>(initialState);
