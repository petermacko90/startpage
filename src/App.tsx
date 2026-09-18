import { useReducer, useState } from "react";
import { initialState, reducer } from "./reducer/reducer";
import { StateContext, StateDispatchContext } from "./context";
import EditButton from "./components/Button/EditButton";
import CategoryList from "./components/CategoryList";
import "./App.css";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <StateContext value={state}>
      <StateDispatchContext value={dispatch}>
        <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        <CategoryList isEditMode={isEditMode} />
        <div className="spacer"></div>
      </StateDispatchContext>
    </StateContext>
  );
}
