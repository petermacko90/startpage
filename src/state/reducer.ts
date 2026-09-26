import type { State } from "./models";

type Action = { type: "fetched"; payload: State };

export const initialState: State = {
  categories: [],
};

export function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "fetched":
      return action.payload;
  }
}
