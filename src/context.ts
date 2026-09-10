import { type ActionDispatch, createContext, useContext } from "react";
import { initialState } from "./reducer/reducer";
import { type State } from "./reducer/models";
import { type Action } from "./reducer/actions";

export const StateContext = createContext<State>(initialState);

export const StateDispatchContext = createContext<ActionDispatch<
  [action: Action]
> | null>(null);

export const useDispatchContext = () => {
  const dispatch = useContext(StateDispatchContext);
  if (!dispatch) {
    throw new Error("useDispatchContext must be used within a Provider");
  }
  return dispatch;
};
