import { useState } from "react";
import { useTimer } from "./useTimer";
import { ERROR_TIMEOUT } from "../constants";

export function useErrorToast(timeout?: number) {
  const { clearTimer, startTimer } = useTimer();

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showErrorToast(message: string) {
    setIsError(true);
    setErrorMessage(message);
    startTimer(() => setIsError(false), timeout ?? ERROR_TIMEOUT);
  }

  function clearError() {
    setIsError(false);
    clearTimer();
  }

  return { isError, errorMessage, showErrorToast, clearError };
}
