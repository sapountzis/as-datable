"use client";
import {
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, type ReactNode } from "react";
export function interpolate(value: number, at: number[], values: number[]) {
  if (value <= at[0]) return values[0];
  for (let i = 1; i < at.length; i++)
    if (value <= at[i]) {
      const t = (value - at[i - 1]) / (at[i] - at[i - 1]);
      return values[i - 1] + (values[i] - values[i - 1]) * t * t * (3 - 2 * t);
    }
  return values.at(-1)!;
}
export function Move({
  progress,
  at,
  x,
  y,
  opacity,
  scale,
  children,
  className,
}: {
  progress: MotionValue<number>;
  at: number[];
  x?: number[];
  y?: number[];
  opacity?: number[];
  scale?: number[];
  children: ReactNode;
  className?: string;
}) {
  const transform = useTransform(
    progress,
    (v) =>
      `translate(${x ? interpolate(v, at, x) : 0}px, ${y ? interpolate(v, at, y) : 0}px) scale(${scale ? interpolate(v, at, scale) : 1})`,
  );
  const alpha = useTransform(progress, (v) =>
    opacity ? interpolate(v, at, opacity) : 1,
  );
  return (
    <MotionGroup transform={transform} opacity={alpha} className={className}>
      {children}
    </MotionGroup>
  );
}

export function Reveal({
  progress,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  return <m.g style={{ opacity }}>{children}</m.g>;
}
export function DrawLine({
  progress,
  from,
  to,
  x1,
  y1,
  x2,
  y2,
  className,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className?: string;
}) {
  const path = useTransform(() => {
    const value = progress.get();
    return `M${x1} ${y1}L${interpolate(value, [from, to], [x1, x2])} ${interpolate(value, [from, to], [y1, y2])}`;
  });
  const opacity = useTransform(progress, [from, from + 0.01], [0, 1]);
  return (
    <MotionPath
      d={path}
      opacity={opacity}
      className={className ?? "scene-link"}
    />
  );
}

// Update SVG geometry directly: Motion's SVG attribute snapshots can retain old
// coordinates after a responsive reflow. Subscriptions keep the path current.
export function MotionPath({
  d,
  opacity,
  className,
  fill = "none",
  stroke,
  strokeWidth,
  strokeDasharray,
  markerEnd,
}: {
  d: MotionValue<string>;
  opacity?: MotionValue<number>;
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  markerEnd?: string;
}) {
  const path = useRef<SVGPathElement>(null);
  const full = useMotionValue(1);
  const alpha = opacity ?? full;
  useMotionValueEvent(d, "change", (value) =>
    path.current?.setAttribute("d", value),
  );
  useMotionValueEvent(alpha, "change", (value) => {
    if (path.current) path.current.style.opacity = String(value);
  });
  useEffect(() => {
    path.current?.setAttribute("d", d.get());
    if (path.current) path.current.style.opacity = String(alpha.get());
  });
  return (
    <path
      ref={path}
      d={d.get()}
      style={{ opacity: alpha.get() }}
      className={className}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      markerEnd={markerEnd}
    />
  );
}

export function MotionGroup({
  transform,
  opacity,
  className,
  children,
  ...props
}: {
  transform: MotionValue<string>;
  opacity?: MotionValue<number>;
  className?: string;
  children: ReactNode;
} & Omit<
  React.SVGProps<SVGGElement>,
  "transform" | "opacity" | "children" | "ref"
>) {
  const group = useRef<SVGGElement>(null);
  const full = useMotionValue(1);
  const alpha = opacity ?? full;
  useMotionValueEvent(transform, "change", (value) => {
    if (group.current) group.current.style.transform = value;
  });
  useMotionValueEvent(alpha, "change", (value) => {
    if (group.current) group.current.style.opacity = String(value);
  });
  useEffect(() => {
    if (group.current) {
      group.current.style.transform = transform.get();
      group.current.style.opacity = String(alpha.get());
    }
  });
  return (
    <g
      {...props}
      ref={group}
      style={{ transform: transform.get(), opacity: alpha.get() }}
      className={className}
    >
      {children}
    </g>
  );
}
