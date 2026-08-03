import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { Ads } from "./Ads";
import { Back, Footer, LanguageVersion, Legal } from "./components";
import { useLanguage } from "./i18n";
import { loadRuffle } from "./ruffle";
import { type CommonProps, isMobile } from "./utils";

export const Sardoloop = ({ lang }: CommonProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<RufflePlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage(lang);

  useEffect(() => {
    let cancelled = false;

    loadRuffle()
      .then(RufflePlayer => {
        if(cancelled || ! containerRef.current) return;

        const ruffle = RufflePlayer.newest();
        const player = ruffle.createPlayer();

        player.style.width = "100%";
        player.style.height = "100%";
        player.style.display = "block";
        player.style.zIndex = "0";

        containerRef.current.appendChild(player);

        player.addEventListener("loadeddata", () => {
          if(cancelled) return;

          playerRef.current = player;
          setLoading(false);
        });

        player.load("/sardoloop.swf");
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlay = useCallback(() => {
    if(! playerRef.current) return;

    playerRef.current.play();
    setTimeout(() => {
      if(loadingRef.current) loadingRef.current.style.display = "none";
    }, 150);
  }, []);

  const thanks = useMemo(() => {
    const thanks = t("original.thanks").split("Ruffle");

    return <>
      {thanks[0]}
      <a href="https://ruffle.rs/" target="_blank" rel="noopener noreferrer">
        {"Ruffle"}
      </a>
      {thanks[1]}
    </>;
  }, [t]);

  return isMobile ? <Navigate to={lang === "en" ? "/en/reworked" : "/it/rielaborato"} /> : <div className="player">
    <Legal lang={lang} />
    <div className="title">
      {"Sardoloop "}
      <span className="subtitle">{t("original.subtitle")}</span>
    </div>
    <br />
    <LanguageVersion lang={lang} />
    <br />
    <br />
    <div className="player-layout">
      <div className="container" ref={containerRef}>
        <div className="background loading" ref={loadingRef} onClick={handlePlay}>
          {loading ? <img className="spinner" src="/sheep.png" /> : <span className="play">{t("original.play")}</span>}
        </div>
      </div>
      <div className="player-side">
        <Ads lang={lang} />
      </div>
    </div>
    <br />
    {thanks}
    <br />
    <br />
    <Back lang={lang} />
    <Footer lang={lang} />
  </div>;
};
