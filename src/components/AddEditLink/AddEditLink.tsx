import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../state/context";
import { type Category, type Link } from "../../state/models";
import { LOCALHOST } from "../../constants";
import { selectLink, selectLinks } from "../../state/selectors";
import { createLink, updateLink } from "../../storage/localStorage/links";
import { useImageUpload } from "../../hooks/useImageUpload";
import { getIconType, type IconType } from "../../utils/getIconType";
import { isBlockedUrl } from "../../utils/isBlockedUrl";
import { isValidEmoji } from "../../utils/isValidEmoji";
import { t } from "../../utils/i18n";
import Button from "../Button/Button";
import EmojiInput from "../Form/EmojiInput";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import IconSelector from "../Form/IconSelector";
import ImageUpload from "../Form/ImageUpload";
import OrderInput from "../Form/OrderInput/OrderInput";
import TextInput from "../Form/TextInput";
import "./AddEditLink.css";

export default function AddEditLink({
  categoryId,
  linkCount,
  linkId,
  cancel,
  textInputRef,
  handleDeleteLink,
  isSynced = false,
  iconSelectorRef,
}: {
  categoryId: Category["id"];
  linkCount: number;
  linkId: Link["id"] | null;
  cancel: () => void;
  textInputRef: RefObject<HTMLInputElement | null>;
  handleDeleteLink?: (linkId: Link["id"], index: number) => void;
  isSynced?: boolean;
  iconSelectorRef?: RefObject<HTMLInputElement | null>;
}) {
  const state = useContext(StateContext);
  const links = selectLinks(state)(categoryId);

  let link: Link | undefined = undefined;
  if (linkId) {
    link = selectLink(state)(categoryId, linkId);
  }

  const [title, setTitle] = useState(link ? link.title : "");
  const [url, setUrl] = useState(link ? link.url : "");
  const [urlError, setUrlError] = useState("");
  const [order, setOrder] = useState(link ? link.order : linkCount);
  const [emoji, setEmoji] = useState(link ? link.emoji : null);
  const [emojiError, setEmojiError] = useState("");
  const [customIconError, setCustomIconError] = useState("");

  const [iconType, setIconType] = useState<IconType>(
    link ? getIconType(link) : "default",
  );

  const {
    customIconId,
    uploadedImage,
    uploadedImageUrl,
    savedIconUrl,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  } = useImageUpload(link?.customIconId, setCustomIconError);

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function handleSave() {
    if (!url.trim()) {
      setUrlError(t("urlRequired"));
      return;
    }

    const formattedUrl = formatUrl(url.trim());

    if (!isValidUrl(formattedUrl)) {
      setUrlError(t("urlNotValid"));
      return;
    }

    if (iconType === "emoji" && !isValidEmoji(emoji?.trim() ?? "")) {
      setEmojiError(t("emojiNotValid"));
      return;
    }

    if (iconType === "upload" && !uploadedImage) {
      setCustomIconError(t("iconNotUploaded"));
      return;
    }

    if (link) {
      updateLink({
        categoryId,
        link: {
          customIconId: link.customIconId,
          emoji: iconType === "emoji" ? emoji : null,
          id: link.id,
          order,
          title: title.trim() || formattedUrl,
          url: formattedUrl,
        },
        customIcon: iconType === "upload" ? uploadedImage : null,
        shouldRemoveIcon: iconType !== "upload",
      });

      cancel();
    } else {
      createLink({
        categoryId,
        order,
        title: title.trim() || formattedUrl,
        url: formattedUrl,
        emoji: iconType === "emoji" ? emoji : null,
        customIcon: iconType === "upload" ? uploadedImage : null,
        linkCount,
      });

      setTitle("");
      setUrl("");
      setOrder(linkCount);
      setUrlError("");

      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  }

  function formatUrl(url: string): string {
    const https = "https://";
    const http = "http://";

    if (url.startsWith(https) || url.startsWith(http) || isBlockedUrl(url)) {
      return url;
    }

    if (url.startsWith(`${LOCALHOST}:`)) return `${http}${url}`;
    return `${https}${url}`;
  }

  return (
    <div className="add-edit-link-container">
      <h1 className="add-edit-link-heading">
        {link ? t("editLink") : t("addLink")}
      </h1>
      <Form>
        <FormField id="title" labelText={t("textLabel")}>
          <TextInput
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleSave}
            value={title}
            inputRef={textInputRef}
            disabled={isSynced}
          />
        </FormField>
        <FormField id="url" labelText={t("urlLabel")} error={urlError}>
          <TextInput
            id="url"
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError("");
            }}
            onPressEnter={handleSave}
            value={url}
            type="url"
            disabled={isSynced}
          />
        </FormField>
        <IconSelector
          iconType={iconType}
          setIconType={setIconType}
          focusRef={iconSelectorRef}
        />
        {iconType === "upload" && (
          <ImageUpload
            label={t("uploadIcon")}
            showDelete={!!customIconId || uploadedImage !== null}
            deleteLabel={t("removeIcon")}
            previewUrl={uploadedImageUrl ?? savedIconUrl}
            handleUpload={handleIconUpload}
            handleDelete={handleIconDelete}
            focusRef={uploadIconRef}
            customIconError={customIconError}
          />
        )}
        {iconType === "emoji" && (
          <EmojiInput
            emoji={emoji}
            setEmoji={setEmoji}
            emojiError={emojiError}
            setEmojiError={setEmojiError}
            handleSave={handleSave}
          />
        )}
        <OrderInput
          value={order}
          max={link ? linkCount - 1 : linkCount}
          setValue={setOrder}
          items={[...links!]}
          itemId={linkId}
          isDisabled={isSynced}
        />
        <div className="buttons-container">
          <Button action={() => handleSave()}>{t("save")}</Button>
          <Button action={cancel}>{t("cancel")}</Button>
          {linkId && !isSynced && (
            <Button
              type="danger"
              action={() => {
                handleDeleteLink!(linkId, order);
                cancel();
              }}
            >
              {t("deleteLink")}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
