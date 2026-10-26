import type { ReactNode } from "react";

// Stack text alternatives in the same grid cell. Their intrinsic maximum size
// reserves only the space the actual copy needs, including after font reflow.
export default function StableSlot({
  items,
  active,
  className = "",
}: {
  items: ReactNode[];
  active: number;
  className?: string;
}) {
  return (
    <div className={`stable-slot ${className}`}>
      {items.map((item, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          style={{ visibility: i === active ? undefined : "hidden" }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
