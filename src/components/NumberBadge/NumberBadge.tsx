import "./NumberBadge.css";

export default function NumberBadge({ index }: { index: number }) {
  const badge = index === 9 ? 0 : index + 1;

  return <div className="number-badge">{badge}</div>;
}
