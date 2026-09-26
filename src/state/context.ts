import { createContext } from "react";
import { initialState } from "./reducer";
import { type State } from "./models";

export const StateContext = createContext<State>(initialState);
