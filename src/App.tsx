import { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "./reducer/reducer";
import type { CategoryRecord } from "./reducer/models";
import { StateContext } from "./context";
import { getState } from "./storage";
import EditButton from "./components/Button/EditButton";
import CategoryList from "./components/CategoryList";
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
      if (areaName === "local" && changes.categories) {
        dispatch({
          type: "fetched",
          payload: {
            categories: changes.categories.newValue as CategoryRecord,
          },
        });
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return (
    <StateContext value={state}>
      <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      <CategoryList isEditMode={isEditMode} />
      <div className="spacer"></div>
    </StateContext>
  );
}
