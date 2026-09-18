import type { Category, Link } from "./models";
import type { State } from "./models";

export type Action =
  | { type: "fetched"; payload: State }
  | { type: "category added"; payload: Category }
  | { type: "category edited"; payload: Category }
  | { type: "category deleted"; payload: Category["id"] }
  | { type: "link added"; payload: { categoryId: Category["id"]; link: Link } }
  | {
      type: "link edited";
      payload: { categoryId: Category["id"]; link: Link };
    }
  | {
      type: "link deleted";
      payload: { categoryId: Category["id"]; linkId: Link["id"] };
    }
  | { type: "undo" };
