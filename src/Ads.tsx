import { useLanguage } from "./i18n";
import type { CommonProps } from "./utils";

export const Ads = ({ lang }: CommonProps) => {
  // Remove this line to configure ads
  return null;

  const { t } = useLanguage(lang);

  return <div style={{ height: "100%", width: "100%" }}>
    <div
      style={{
        alignItems:     "center",
        border:         "2px solid black",
        boxSizing:      "border-box",
        display:        "flex",
        height:         "100%",
        justifyContent: "center",
        textAlign:      "center",
        width:          "100%",
        zIndex:         0
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5em" }}>{t("ads.title")}</div>
        <div style={{ marginTop: "1.5em" }}>{t("ads.content")}</div>
      </div>
    </div>
  </div>;
};
