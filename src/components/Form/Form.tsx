import type { ReactNode } from "react";
import "./Form.css";

export default function Form({ children }: { children: ReactNode }) {
  return <div className="form">{children}</div>;
}
