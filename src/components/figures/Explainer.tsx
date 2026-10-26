"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  animate,
  LazyMotion,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import StableSlot from "./StableSlot";

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const readReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function subscribeReducedMotion(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);
const PlaybackContext = createContext<{
  owner: { id: string } | null;
  acquire: (id: string) => void;
  release: (id: string) => void;
}>({ owner: null, acquire: () => {}, release: () => {} });
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<{ id: string } | null>(null);
  const acquire = useCallback((id: string) => setOwner({ id }), []);
  const release = useCallback(
    (id: string) =>
      setOwner((current) => (current?.id === id ? null : current)),
    [],
  );
  const value = useMemo(
    () => ({ owner, acquire, release }),
    [owner, acquire, release],
  );
  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
export type Scene = {
  progress: MotionValue<number>;
  compact: boolean;
  width: number;
  position: number;
  reduced: boolean;
  pause: () => void;
};
export type Chapter = { at: number; label: string; description: string };

export default function Explainer({
  title,
  chapters,
  caption,
  inspect,
  duration = 22,
  children,
  reserveChapters = chapters,
  variant,
}: {
  title: string;
  chapters: Chapter[];
  reserveChapters?: Chapter[];
  variant: "rules" | "ranking" | "agents" | "graph" | "temporal" | "retrieval";
  caption: string;
  inspect: ReactNode;
  duration?: number;
  children: (scene: Scene) => ReactNode;
}) {
  const id = useId();
  const frame = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const [width, setWidth] = useState(960);
  const compact = width < 650;
  const [position, setPosition] = useState(0);
  const chapter = Math.max(
    0,
    chapters.findLastIndex((item) => position / 100 >= item.at),
  );
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    serverReady,
  );
  const { owner, acquire, release } = useContext(PlaybackContext);
  const playing = owner?.id === id && !reduced;
  const pause = useCallback(() => {
    release(id);
  }, [id, release]);
  useMotionValueEvent(progress, "change", (value) => {
    setPosition(Math.floor(value * 100 + 1e-8));
  });
  useEffect(() => {
    const size = new ResizeObserver(([entry]) =>
      setWidth(Math.max(220, Math.round(entry.contentRect.width))),
    );
    const visibility = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    if (frame.current) {
      size.observe(frame.current);
      visibility.observe(frame.current);
    }
    const hidden = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      size.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", hidden);
      release(id);
    };
  }, [id, pause, release]);
  useEffect(() => {
    if (reduced) release(id);
  }, [reduced, id, release]);
  useEffect(() => {
    if (!playing) return;
    const controls = animate(progress, 1, {
      duration: duration * (1 - progress.get()),
      ease: "linear",
      onComplete: pause,
    });
    return () => controls.stop();
  }, [playing, owner, progress, duration, pause]);
  function play() {
    if (playing) return pause();
    if (reduced) {
      const next = chapters.find((item) => item.at > progress.get() + 0.001);
      progress.set(next?.at ?? 1);
    } else {
      if (progress.get() >= 0.999) progress.set(0);
      acquire(id);
    }
  }
  return (
    <LazyMotion features={loadFeatures} strict>
      <figure
        ref={frame}
        className={`explainer animated-explainer ${variant}-explainer`}
        aria-label={title}
        data-playing={playing}
        data-progress={position}
      >
        <div className="animation-scene">
          {children({
            progress,
            compact,
            width,
            position: position / 100,
            reduced,
            pause,
          })}
        </div>
        <div className="animation-transport">
          <button
            type="button"
            disabled={!ready}
            onClick={play}
            aria-label={
              playing
                ? "Pause animation"
                : reduced
                  ? "Next explanation state"
                  : position === 0 || position >= 99
                    ? "Play animation"
                    : "Resume animation"
            }
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>
              {playing
                ? "Pause"
                : reduced
                  ? "Next"
                  : position === 0 || position >= 99
                    ? "Play"
                    : "Resume"}
            </span>
          </button>
          <input
            aria-label="Animation progress"
            type="range"
            min={0}
            max={100}
            value={position}
            disabled={!ready}
            onChange={(event) => {
              pause();
              progress.set(Number(event.target.value) / 100);
            }}
          />
          <button
            type="button"
            disabled={!ready}
            aria-label="Replay animation"
            onClick={() => {
              pause();
              progress.set(0);
              if (!reduced) {
                acquire(id);
              }
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <div
          className="animation-narration"
          aria-live={playing ? "off" : "polite"}
        >
          <StableSlot
            className="narration-slots"
            active={0}
            items={[
              <div className="narration-step" key="active">
                <strong>{chapters[chapter].label}</strong>
                <span>{chapters[chapter].description}</span>
              </div>,
              ...reserveChapters.map((item, i) => (
                <div className="narration-step" key={i}>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </div>
              )),
            ]}
          />
        </div>
        <details
          className="method-inspection"
          onToggle={(event) => {
            if (event.currentTarget.open) pause();
          }}
        >
          <summary>Technical notes</summary>
          <div>{inspect}</div>
        </details>
        <figcaption>{caption}</figcaption>
        <noscript>
          <style>{`.animation-transport,.scene-interactions{display:none!important}.animated-explainer .animation-scene{display:none!important}`}</style>
          <ol className="static-explanation">
            {chapters.map((item) => (
              <li key={item.label}>
                <strong>{item.label}.</strong> {item.description}
              </li>
            ))}
          </ol>
        </noscript>
      </figure>
    </LazyMotion>
  );
}
