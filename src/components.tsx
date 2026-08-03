import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useLanguage } from "./i18n";
import { type CommonProps, isMobile } from "./utils";

export const Back = ({ lang }: CommonProps) => {
  const { t } = useLanguage(lang);

  return <>
    {t("back")}
    <Link to={`/${lang}/sardoloop`}>home page</Link>.
  </>;
};

const footerUrls = {
  en: { original: "/en/original", reworked: "/en/reworked" },
  it: { original: "/it/originale", reworked: "/it/rielaborato" }
} as const;

export const Footer = ({ lang }: CommonProps) => {
  const { t } = useLanguage(lang);

  return <div>
    <br />
    <hr />
    <br />
    <Link to={`/${lang}/sardoloop`}>Home page</Link>
    {" - "}
    <Link to={footerUrls[lang].original}>{t("home.original")}</Link>
    {" - "}
    <Link to={footerUrls[lang].reworked}>{t("home.reworked")}</Link>
    {/*
    {" - "}
    <Link to="/privacy">Privacy</Link>
    */}
  </div>;
};

export const Legal = ({ lang }: CommonProps) => {
  const { t } = useLanguage(lang);
  const [understood, setUnderstood] = useState(() => localStorage.getItem("legal") === "yes");

  const handleUnderstood = () => {
    localStorage.setItem("legal", "yes");
    setUnderstood(true);
  };

  return understood ? null : <div className="legal" style={isMobile ? { right: 10 } : { width: "40%" }}>
    <div>{t("legal.message")}</div>
    <button onClick={handleUnderstood}>{t("legal.understood")}</button>
  </div>;
};

const languageUrls: { [key: string]: string } = { "/it": "/en", "/it/originale": "/en/original", "/it/rielaborato": "/en/reworked" };

for(const [url1, url2] of Object.entries(languageUrls)) languageUrls[url2] = url1;

export const LanguageVersion = ({ lang }: CommonProps) => {
  const { t } = useLanguage(lang);
  const { pathname } = useLocation();
  const url = languageUrls[pathname];

  if(! url) throw new Error(`Missing alternative URL for: ${pathname}`);

  return <a href={url}>{t("languageVersion")}</a>;
};
