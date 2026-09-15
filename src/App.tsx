import { useReducer, useState } from "react";
import CategoryList from "./components/CategoryList";
import { initialState, reducer } from "./reducer/reducer";
import { StateContext, StateDispatchContext } from "./context";
import EditButton from "./components/Button/EditButton";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <StateContext value={state}>
      <StateDispatchContext value={dispatch}>
        <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        <CategoryList isEditMode={isEditMode} />
      </StateDispatchContext>
    </StateContext>
  );
}
