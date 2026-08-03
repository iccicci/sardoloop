// cSpell:ignore ahiappettennù annosettennuri beong bombaao roseddandori sbobba shik shikk sondonndaa

import { useCallback, useEffect, useRef, useState } from "react";

import { Ads } from "./Ads";
import { Back, Footer, LanguageVersion, Legal } from "./components";
import { useLanguage } from "./i18n";
import { type CommonProps, isMobile, isMobileLandscape } from "./utils";

type SoundId = "9" | "11" | "13" | "15" | "17" | "19" | "21" | "23" | "25" | "27";

interface SoundEnvelopePoint {
  leftLevel: number;
  pos44: number;
  rightLevel: number;
}

interface SheepDefinition {
  description: string;
  envelope?: SoundEnvelopePoint[];
  loops: number;
  samplesCount: number;
  sound: SoundId;
  x: number;
  y: number;
}

const ENVELOPE_17: SoundEnvelopePoint[] = [
  { leftLevel: 0, pos44: 0, rightLevel: 32768 },
  { leftLevel: 334, pos44: 79016, rightLevel: 32768 },
  { leftLevel: 32768, pos44: 86320, rightLevel: 0 },
  { leftLevel: 32768, pos44: 164672, rightLevel: 0 },
  { leftLevel: 0, pos44: 173968, rightLevel: 32768 },
  { leftLevel: 32768, pos44: 248336, rightLevel: 0 }
];

const ENVELOPE_19: SoundEnvelopePoint[] = [
  { leftLevel: 0, pos44: 0, rightLevel: 32768 },
  { leftLevel: 334, pos44: 79016, rightLevel: 32768 },
  { leftLevel: 32768, pos44: 86320, rightLevel: 0 },
  { leftLevel: 32768, pos44: 164672, rightLevel: 0 },
  { leftLevel: 0, pos44: 164672, rightLevel: 32768 }
];

const ENVELOPE_21: SoundEnvelopePoint[] = [
  { leftLevel: 32768, pos44: 0, rightLevel: 32768 },
  { leftLevel: 32768, pos44: 254976, rightLevel: 32768 },
  { leftLevel: 0, pos44: 310752, rightLevel: 0 }
];

const SHEEP: SheepDefinition[] = [
  { description: "roseddandori", loops: 2, samplesCount: 20959, sound: "9", x: 24.81, y: 24.63 },
  { description: "annosettennuri", loops: 2, samplesCount: 20963, sound: "11", x: 13.08, y: 58.36 },
  { description: "bombaao", loops: 4, samplesCount: 10472, sound: "13", x: 33.42, y: 83.78 },
  { description: "sbobba", loops: 4, samplesCount: 10474, sound: "15", x: 37.74, y: 22.91 },
  { description: "ahiappettennù", envelope: ENVELOPE_17, loops: 4, samplesCount: 20936, sound: "17", x: 15.75, y: 36.96 },
  { description: "sondonndaa", envelope: ENVELOPE_19, loops: 4, samplesCount: 10448, sound: "19", x: 18.75, y: 76.42 },
  { description: "beong be beong", envelope: ENVELOPE_21, loops: 8, samplesCount: 10476, sound: "21", x: 68.41, y: 84.45 },
  { description: "tum tu tum tum", loops: 8, samplesCount: 20944, sound: "23", x: 83.08, y: 72.41 },
  { description: "shik ki shikk", loops: 8, samplesCount: 20946, sound: "25", x: 89.74, y: 51.67 },
  { description: "tum pa tum pa tum", loops: 8, samplesCount: 20964, sound: "27", x: 53.08, y: 87.79 }
];

const repeatBuffer = (ctx: AudioContext, buffer: AudioBuffer, times: number) => {
  const out = ctx.createBuffer(1, buffer.length * times, buffer.sampleRate);
  const dst = out.getChannelData(0);
  const src = buffer.getChannelData(0);

  for(let i = 0; i < times; i++) dst.set(src, i * buffer.length);

  return out;
};

const SWF_SAMPLE_RATE = 11025;
const SWF_SAMPLE_START = 1661;
const SWF_ENVELOPE_LEVEL_MAX = 32768;
const SWF_ENVELOPE_SAMPLE_RATE = 44100;

const trimBuffer = (ctx: AudioContext, src: AudioBuffer, sampleCount: number) => {
  const sampleRatio = src.sampleRate / SWF_SAMPLE_RATE;
  const start = Math.round(SWF_SAMPLE_START * sampleRatio);
  const length = Math.round(sampleCount * sampleRatio);
  const out = ctx.createBuffer(src.numberOfChannels, length, src.sampleRate);
  const channel = src.getChannelData(0);

  out.getChannelData(0).set(channel.subarray(start, start + length));

  return out;
};

const connectSource = (ctx: AudioContext, source: AudioBufferSourceNode, envelope?: SoundEnvelopePoint[]) => {
  if(! envelope?.length) {
    source.connect(ctx.destination);

    return;
  }

  const gainL = ctx.createGain();
  const gainR = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  const level = (value: number) => value / SWF_ENVELOPE_LEVEL_MAX;
  const t0 = ctx.currentTime;

  source.connect(gainL);
  source.connect(gainR);
  gainL.connect(merger, 0, 0);
  gainR.connect(merger, 0, 1);
  merger.connect(ctx.destination);

  const first = envelope[0];

  gainL.gain.setValueAtTime(level(first.leftLevel), t0);
  gainR.gain.setValueAtTime(level(first.rightLevel), t0);

  for(let i = 1; i < envelope.length; i++) {
    const point = envelope[i];
    const t = t0 + point.pos44 / SWF_ENVELOPE_SAMPLE_RATE;
    const prevT = t0 + envelope[i - 1].pos44 / SWF_ENVELOPE_SAMPLE_RATE;

    if(t <= prevT) {
      gainL.gain.setValueAtTime(level(point.leftLevel), t);
      gainR.gain.setValueAtTime(level(point.rightLevel), t);
    } else {
      gainL.gain.linearRampToValueAtTime(level(point.leftLevel), t);
      gainR.gain.linearRampToValueAtTime(level(point.rightLevel), t);
    }
  }
};

const SHEEP_STYLE = { height: `${(1000 / 992) * 100}%`, width: `${(760 / 1375) * 100}%` };

interface PlayerProps extends CommonProps {
  onLoad: () => void;
  unlockAudioRef: React.RefObject<(() => Promise<void>) | null>;
}

const Player = ({ lang, onLoad, unlockAudioRef }: PlayerProps) => {
  const { t } = useLanguage(lang);
  const [label, setLabel] = useState<string | null>(null);
  const [wobbling, setWobbling] = useState<Set<SoundId>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const buffersRef = useRef<Map<SoundId, AudioBuffer>>(new Map());
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleStop = useCallback(() => {
    for(const source of sourcesRef.current) {
      source.onended = null;

      try {
        source.stop();
      } catch(error) {
        void error;
      }
    }

    sourcesRef.current.clear();
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    const ctx = (audioContextRef.current = new AudioContext());
    const buffers = buffersRef.current;

    unlockAudioRef.current = () => (ctx.state === "closed" ? Promise.resolve() : ctx.resume());

    void (async () => {
      try {
        await Promise.all(
          SHEEP.map(async sheep => {
            const { loops, samplesCount, sound } = sheep;
            const response = await fetch(`/${sound}.mp3`, { signal: abort.signal });

            if(! response.ok) throw new Error(`Failed to load /${sound}.mp3`);

            const decoded = await ctx.decodeAudioData(await response.arrayBuffer());

            if(abort.signal.aborted) return;

            buffers.set(sound, repeatBuffer(ctx, trimBuffer(ctx, decoded, samplesCount), loops));
          })
        );

        if(abort.signal.aborted) return;

        onLoad();
      } catch(error) {
        if(error instanceof DOMException && error.name === "AbortError") return;

        onLoad();
      }
    })();

    return () => {
      abort.abort();
      handleStop();
      buffers.clear();
      void ctx.close();
      audioContextRef.current = null;
      unlockAudioRef.current = null;
    };
  }, [handleStop, onLoad, unlockAudioRef]);

  const addWobbling = useCallback((sound: SoundId) => {
    setWobbling(prev => new Set(prev).add(sound));
  }, []);

  const removeWobbling = useCallback((sound: SoundId) => {
    setWobbling(prev => {
      if(! prev.has(sound)) return prev;

      const next = new Set(prev);

      next.delete(sound);

      return next;
    });
  }, []);

  const handleEnter = useCallback(
    ({ description, envelope, sound }: SheepDefinition) => {
      const ctx = audioContextRef.current;
      const buffer = buffersRef.current.get(sound);

      if(ctx && buffer) {
        void ctx.resume();

        const source = ctx.createBufferSource();

        source.buffer = buffer;
        connectSource(ctx, source, envelope);
        source.onended = () => sourcesRef.current.delete(source);
        sourcesRef.current.add(source);
        source.start();
      }

      setLabel(description);
      addWobbling(sound);
    },
    [addWobbling]
  );

  const handleLeave = useCallback(
    (sound: SoundId) => {
      setLabel(null);
      removeWobbling(sound);
    },
    [removeWobbling]
  );

  const handleAction = useCallback(
    (sound: SoundId) => {
      handleStop();
      removeWobbling(sound);
      requestAnimationFrame(() => {
        addWobbling(sound);
      });
    },
    [handleStop, removeWobbling, addWobbling]
  );

  const activeTouchSoundRef = useRef<SoundId | null>(null);

  const sheepAtPoint = useCallback((x: number, y: number) => {
    for(const el of document.elementsFromPoint(x, y)) {
      if(! (el instanceof HTMLElement)) continue;

      const hit = el.closest<HTMLElement>("[data-sound]");

      if(hit) return SHEEP.find(({ sound }) => sound === hit.dataset.sound);
    }

    return undefined;
  }, []);

  const updateActiveTouch = useCallback(
    (sheep: SheepDefinition | undefined) => {
      const next = sheep?.sound ?? null;
      const prev = activeTouchSoundRef.current;

      if(next === prev) return;

      if(prev) handleLeave(prev);

      if(sheep) handleEnter(sheep);

      activeTouchSoundRef.current = next;
    },
    [handleEnter, handleLeave]
  );

  useEffect(() => {
    if(! isMobile) return;

    const el = backgroundRef.current;

    if(! el) return;

    const onTouchStart = (event: TouchEvent) => {
      if(event.touches.length !== 1) return;

      const { clientX, clientY } = event.touches[0];

      updateActiveTouch(sheepAtPoint(clientX, clientY));
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();

      if(event.touches.length !== 1) {
        updateActiveTouch(undefined);

        return;
      }

      const { clientX, clientY } = event.touches[0];

      updateActiveTouch(sheepAtPoint(clientX, clientY));
    };

    const onTouchEnd = (event: TouchEvent) => {
      if(event.touches.length > 0) return;

      updateActiveTouch(undefined);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [sheepAtPoint, updateActiveTouch]);

  return <div className="background reworked" ref={backgroundRef}>
    <span className="reworked-hint">{t(`reworked.hint.${isMobile ? "mobile" : "desktop"}`)}</span>
    <span className="reworked-site">https://sardoloop.it</span>
    {label !== null && <span className="sheep-label">{label}</span>}
    {SHEEP.map(sheep => {
      const { sound, x, y } = sheep;

      return <span className="sheep-spot" key={sound} style={{ left: `${x}%`, top: `${y}%` }}>
        <span
          className="sheep-hit"
          data-sound={sound}
          style={SHEEP_STYLE}
          onClick={() => {
            handleAction(sound);

            if(isMobile) {
              requestAnimationFrame(() => {
                handleLeave(sound);
              });
            }
          }}
          {...(! isMobile && {
            onMouseEnter: () => handleEnter(sheep),
            onMouseLeave: () => handleLeave(sound)
          })}
        />
        <img className={`sheep${wobbling.has(sound) ? " sheep-wobbling" : ""}`} src="/sheep.png" alt="" draggable={false} />
      </span>;
    })}
  </div>;
};

const useMobileLandscape = () => {
  const [landscape, setLandscape] = useState(isMobileLandscape);

  useEffect(() => {
    if(! isMobile) return;

    const sync = () => setLandscape(isMobileLandscape());
    const onOrientationChange = () => {
      sync();
      requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  return landscape;
};

export const Reworked = ({ lang }: CommonProps) => {
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const unlockAudioRef = useRef<(() => Promise<void>) | null>(null);
  const [loading, setLoading] = useState(true);
  const landscape = useMobileLandscape();
  const { t } = useLanguage(lang);

  const handlePlay = useCallback(() => {
    if(loading) return;

    void unlockAudioRef.current?.();

    setTimeout(() => {
      if(loadingRef.current) loadingRef.current.style.display = "none";
    }, 50);
  }, [loading]);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return <div className="player">
    <Legal lang={lang} />
    <div className="title">
      {"Sardoloop "}
      <span className="subtitle">{t("reworked.subtitle")}</span>
    </div>
    <br />
    <LanguageVersion lang={lang} />
    <br />
    <br />
    {landscape ? <div className="player-layout-horizontal">{t("reworked.horizontal")}</div> : <div className={`player-layout${isMobile ? " player-layout-mobile" : ""}`}>
      <div className="container">
        <div className="background loading" ref={loadingRef} onClick={handlePlay}>
          {loading ? <img className="spinner" src="/sheep.png" /> : <span className="play">{t(isMobile ? "reworked.play" : "original.play")}</span>}
        </div>
        <Player lang={lang} onLoad={handleLoad} unlockAudioRef={unlockAudioRef} />
      </div>
      <div className="player-side">
        <Ads lang={lang} />
      </div>
    </div>}
    <br />
    {t("reworked.description")}
    <br />
    <br />
    <Back lang={lang} />
    <Footer lang={lang} />
  </div>;
};
