import { useState, type SyntheticEvent } from "react";

export default function PageIcon({
  domain,
  size = "32px",
}: {
  domain: string;
  size?: "32px" | "24px";
}) {
  const placeholderImage = "globe.svg";

  const [imgSrc, setImgSrc] = useState(
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  );

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
