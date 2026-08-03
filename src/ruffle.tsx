declare global {
  interface Window {
    RufflePlayer: {
      newest: () => RuffleConstructor;
    };
  }

  interface RuffleConstructor {
    createPlayer: () => RufflePlayer;
  }

  interface RufflePlayer extends HTMLElement {
    load: (url: string) => void;
    play: () => void;
  }
}

type RuffleAPI = typeof window.RufflePlayer;

let rufflePromise: Promise<RuffleAPI> | null = null;

export const loadRuffle = () => {
  if(rufflePromise) return rufflePromise;

  rufflePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.async = true;
    script.src = "https://unpkg.com/@ruffle-rs/ruffle";

    script.onerror = () => reject(new Error("Failed to load Ruffle"));
    script.onload = () => resolve(window.RufflePlayer);

    document.body.appendChild(script);
  });

  return rufflePromise;
};
