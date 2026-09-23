import type { Link } from "../../reducer/models";
import PageIcon from "../PageIcon/PageIcon";
import "./LinkItem.css";

export default function LinkItem({ link }: { link: Link }) {
  return (
    <a href={link.url} className="link" title={link.text}>
      <span className="link-icon-container">
        <PageIcon domain={new URL(link.url).hostname} />
      </span>
      <span className="link-title">{link.text}</span>
    </a>
  );
}
