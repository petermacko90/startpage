import { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "./state/reducer";
import type { Category } from "./state/models";
import { StateContext } from "./state/context";
import { getState } from "./storage/localStorage";
import EditButtons from "./components/EditButtons/EditButtons";
import CategoryList from "./components/CategoryList/CategoryList";
import "./App.css";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getState().then((state) => {
      dispatch({ type: "fetched", payload: state });
    });

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: chrome.storage.AreaName,
    ) => {
      if (areaName === "local" && (changes.categories || changes.undoState)) {
        dispatch({
          type: "fetched",
          payload: {
            categories: changes.categories.newValue as Category[],
            undoState: changes.undoState?.newValue as Category[] | undefined,
          },
        });
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const [isAppFocused, setIsAppFocused] = useState<boolean>(false);

  useEffect(() => {
    const onFocus = () => setIsAppFocused(true);
    const onBlur = () => setIsAppFocused(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <StateContext value={state}>
      <div className="spacer"></div>
      <CategoryList isAppFocused={isAppFocused} />
      <EditButtons />
    </StateContext>
  );
}
