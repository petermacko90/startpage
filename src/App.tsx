import { useReducer, useState } from "react";
import Categories from "./components/Categories";
import { initialState, reducer } from "./reducer/reducer";
import { StateContext, StateDispatchContext } from "./context";
import EditButton from "./components/Button/EditButton";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <StateContext value={state}>
      <StateDispatchContext value={dispatch}>
        <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        <Categories isEditMode={isEditMode} />
      </StateDispatchContext>
    </StateContext>
  );
}
