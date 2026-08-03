import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Footer, LanguageVersion, Legal } from "./components";
import type { Language } from "./i18n";
import { useLanguage } from "./i18n";
import { type CommonProps, isMobile } from "./utils";

const original: { [key in Language]: string } = { en: "/en/original", it: "/it/originale" };
const reworked: { [key in Language]: string } = { en: "/en/reworked", it: "/it/rielaborato" };

const socials = [
  {
    color: "#181717",
    href:  "https://github.com/iccicci/sardoloop/issues",
    label: "GitHub",
    path:  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  },
  {
    color: "#0A66C2",
    href:  "https://www.linkedin.com/in/daniele-icc/",
    label: "LinkedIn",
    path:  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  },
  {
    color: "#000000",
    href:  "https://x.com/DanieleiCC",
    label: "X",
    path:  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
  },
  {
    color: "#1877F2",
    href:  "https://www.facebook.com/daniele.icc",
    label: "Facebook",
    path:  "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073"
  }
] as const;

export const Home = ({ lang }: CommonProps) => {
  const { t } = useLanguage(lang);
  const languageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [fixedLanguage, setFixedLanguage] = useState(false);

  useEffect(() => {
    const handler = () => {
      if(! languageRef.current || ! textRef.current) return;

      const { top } = textRef.current.getBoundingClientRect();

      setFixedLanguage(top < 0);
    };

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return <div className="home">
    <Legal lang={lang} />
    <div className="title">{t("home.title")}</div>
    <div className="text" ref={textRef}>
      <div className={`language${fixedLanguage ? " fixed" : ""}`} ref={languageRef}>
        <LanguageVersion lang={lang} />
      </div>
      {t("home.intro1")}
      <br />
      <br />
      {t("home.intro2")}
      <br />
      {t("home.intro3")}
      <br />
      <br />
      <img src="/screenshot.jpg" style={{ maxWidth: "100%" }} />
      <br />
      <br />
      {t("home.announce")}
      <br />
      <br />
      {t("home.reason")}
      <br />
      <br />
      {t("home.invite")}
      <ul>
        <li>{isMobile ? `${t("home.original")} (${t("home.mobile")})` : <Link to={original[lang]}>{t("home.original")}</Link>}</li>
        <li>
          <Link to={reworked[lang]}>{t("home.reworked")}</Link>
        </li>
      </ul>
      <br />
      {t("home.feedback")}
      <br />
      <br />
      <span className="socials">
        {socials.map(({ color, href, label, path }) => <a aria-label={label} href={href} key={label} rel="noopener noreferrer" style={{ color }} target="_blank">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
          </svg>
        </a>)}
      </span>
      <br />
      <br />
      <br />
      {t("home.sources")}
      <a href="https://github.com/iccicci/sardoloop#readme" target="_blank" rel="noopener noreferrer">
          github
      </a>
        .
    </div>
    <Footer lang={lang} />
  </div>;
};
