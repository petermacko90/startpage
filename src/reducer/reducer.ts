import type { State } from "./models";
import type { Action } from "./actions";

export const initialState: State = {
  categories: {},
};

export function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "fetched":
      return action.payload;
  }
}
