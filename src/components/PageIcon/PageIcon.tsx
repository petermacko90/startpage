import { useEffect, useState, type SyntheticEvent } from "react";
import { LOCALHOST } from "../../constants";
import type { Link } from "../../state/models";
import { getImage } from "../../storage/indexedDB";

export default function PageIcon({
  domain,
  id,
  size = "32px",
}: {
  domain: string;
  id: Link["customIconId"];
  size?: "32px" | "24px";
}) {
  const placeholderImage = "globe.svg";
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const [imgSrc, setImgSrc] = useState(
    shouldFetchIcon(domain) ? url : placeholderImage,
  );

  function shouldFetchIcon(domain: string): boolean {
    if (domain === "" || domain === LOCALHOST || id) return false;
    return true;
  }

  function replacePlaceholderIcon(e: SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    if (img.naturalHeight === 16 && img.naturalWidth === 16) {
      setImgSrc(placeholderImage);
    }
  }

  useEffect(() => {
    let objectUrl = "";

    async function loadCustomIcon() {
      if (id) {
        try {
          const blob = await getImage(id);

          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setImgSrc(objectUrl);
          }
        } catch (e) {
          console.error("failed to fetch image from IndexedDB", e);
          setImgSrc(placeholderImage);
        }
      } else {
        if (domain) {
          setImgSrc(url);
        }
      }
    }

    loadCustomIcon();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, url, domain]);

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
