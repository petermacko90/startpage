import { useEffect, useState, type SyntheticEvent } from "react";
import { LOCALHOST } from "../../constants";
import type { Category, Link } from "../../state/models";
import { getImage } from "../../storage/indexedDB";
import "./PageIcon.css";

export default function PageIcon({
  domain,
  id,
  emoji,
  size = "32px",
}: {
  domain: string;
  id: Category["customIconId"] | Link["customIconId"];
  emoji: Link["emoji"];
  size?: "32px" | "24px" | "48px";
}) {
  const placeholderImage = "globe.svg";
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const [imgSrc, setImgSrc] = useState<string>(placeholderImage);

  function replacePlaceholderIcon(e: SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    if (img.naturalHeight === 16 && img.naturalWidth === 16) {
      setImgSrc(placeholderImage);
    }
  }

  useEffect(() => {
    if (emoji) return;

    let objectUrl = "";
    let isMounted = true;

    async function setIcon() {
      if (!id) {
        if (!domain || domain === LOCALHOST) {
          if (isMounted) setImgSrc(placeholderImage);
        } else {
          if (isMounted) setImgSrc(url);
        }

        return;
      }

      try {
        const blob = await getImage(id);

        if (blob && isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setImgSrc(objectUrl);
        } else if (isMounted) {
          setImgSrc(placeholderImage);
        }
      } catch (e) {
        console.error("failed to fetch image from IndexedDB", e);
        if (isMounted) setImgSrc(placeholderImage);
      }
    }

    setIcon();

    return () => {
      isMounted = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [emoji, id, domain, url]);

  if (emoji) {
    return (
      <div
        className="emoji"
        style={{ width: size, height: size, fontSize: `calc(${size} * 0.75)` }}
      >
        {emoji}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      style={{ width: size, height: size }}
      alt={`${domain || "page"} icon`}
      draggable="false"
      onError={() => {
        if (imgSrc !== placeholderImage) {
          setImgSrc(placeholderImage);
        }
      }}
      onLoad={replacePlaceholderIcon}
    />
  );
}
