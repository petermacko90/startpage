import { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "./state/reducer";
import type { Category } from "./state/models";
import { StateContext } from "./state/context";
import { getState } from "./storage/localStorage";
import { handleNumericKeys } from "./utils/handleNumericKeys";
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

  const [isAnyModalOpen, setIsAnyModalOpen] = useState<boolean>(
    () => document.querySelector("dialog:modal") !== null,
  );

  useEffect(() => {
    const checkModal = () => {
      const isOpen = document.querySelector("dialog:modal") !== null;
      setIsAnyModalOpen(isOpen);
    };

    const observer = new MutationObserver(() => {
      checkModal();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["open"],
      childList: true,
    });

    checkModal();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.querySelector("dialog:modal") !== null) return;

      handleNumericKeys(e, () =>
        document.querySelectorAll<HTMLButtonElement>(".category-button"),
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <StateContext value={state}>
      <div className="spacer"></div>
      <CategoryList
        shouldDisplayHints={isAppFocused && !isAnyModalOpen}
        isLoading={isLoading}
      />
      <EditButtons />
    </StateContext>
  );
}
