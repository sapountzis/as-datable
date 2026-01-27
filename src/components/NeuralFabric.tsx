"use client";

import { useEffect, useRef } from 'react';
import FabricManager from '@/lib/fabricManager';

const NeuralFabric = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const manager = FabricManager.getInstance();

    // We defer the mount slightly to ensure the container is ready and layout is stable? 
    // Usually not needed, but safe.
    if (containerRef.current) {
      manager.mount(containerRef.current);
    }

    return () => {
      manager.unmount();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default NeuralFabric;