import { useState, type SyntheticEvent } from "react";
import { LOCALHOST } from "../../constants";

export default function PageIcon({
  domain,
  size = "32px",
}: {
  domain: string;
  size?: "32px" | "24px";
}) {
  const placeholderImage = "globe.svg";

  const [imgSrc, setImgSrc] = useState(
    shouldFetchIcon(domain)
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      : placeholderImage,
  );

  function shouldFetchIcon(domain: string): boolean {
    if (domain === "" || domain === LOCALHOST) return false;
    return true;
  }

  function replacePlaceholderIcon(e: SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    if (img.naturalHeight === 16 && img.naturalWidth === 16) {
      setImgSrc(placeholderImage);
    }
  }

  return (
    <img
      src={imgSrc}
      style={{ width: size, height: size }}
      alt={`${domain} icon`}
      onError={() => {
        if (imgSrc !== placeholderImage) {
          setImgSrc(placeholderImage);
        }
      }}
      onLoad={(e) => replacePlaceholderIcon(e)}
    />
  );
}
