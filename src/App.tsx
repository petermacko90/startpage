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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getState().then((state) => {
      dispatch({ type: "fetched", payload: state });
      setIsLoading(false);
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

  const [isAppFocused, setIsAppFocused] = useState<boolean>(
    document.hasFocus(),
  );

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

  useEffect(() => {
    function handleNumericKeys(e: KeyboardEvent) {
      const isAnyModalOpen = document.querySelector("dialog:modal") !== null;
      if (isAnyModalOpen) return;

      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (
        e.key !== "1" &&
        e.key !== "2" &&
        e.key !== "3" &&
        e.key !== "4" &&
        e.key !== "5" &&
        e.key !== "6" &&
        e.key !== "7" &&
        e.key !== "8" &&
        e.key !== "9" &&
        e.key !== "0"
      ) {
        return;
      }

      e.preventDefault();

      const categories =
        document.querySelectorAll<HTMLButtonElement>(".category-button");

      const index = e.key === "0" ? 9 : Number(e.key) - 1;
      categories[index]?.focus();
      categories[index]?.click();
    }

    window.addEventListener("keydown", handleNumericKeys);
    return () => window.removeEventListener("keydown", handleNumericKeys);
  }, []);

  return (
    <StateContext value={state}>
      <div className="spacer"></div>
      <CategoryList isAppFocused={isAppFocused} isLoading={isLoading} />
      <EditButtons />
    </StateContext>
  );
}
