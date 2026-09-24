import { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "./reducer/reducer";
import type { CategoryRecord } from "./reducer/models";
import { StateContext } from "./context";
import { getState } from "./storage/localStorage";
import EditButtons from "./components/EditButtons/EditButtons";
import CategoryList from "./components/CategoryList/CategoryList";
import "./App.css";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditMode, setIsEditMode] = useState(false);

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
            categories: changes.categories.newValue as CategoryRecord,
            undoState: changes.undoState?.newValue as
              | CategoryRecord
              | undefined,
          },
        });
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return (
    <StateContext value={state}>
      <EditButtons isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      <CategoryList isEditMode={isEditMode} />
      <div className="spacer"></div>
    </StateContext>
  );
}
