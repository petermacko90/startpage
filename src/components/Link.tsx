import type { Link } from "../reducer/models";
import "./Link.css";

export default function Link({ link }: { link: Link }) {
  return (
    <a href={link.url} className="link">
      <span className="link-icon-container">
        <span className="link-icon"></span>
      </span>
      <span className="link-title">{link.text}</span>
    </a>
  );
}
