import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  angle: number;
  angleSpeed: number;
  orbitRadius: number;
  phaseX: number;
  phaseY: number;
  phaseZ: number;
  centerDistanceFactor: number;
}

// Create circular particle texture
const createCircleTexture = (): THREE.CanvasTexture => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const center = size / 2;
  const radius = size / 2 - 2;
  
  // Create radial gradient for soft edges
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Map z value (0 = closest, -maxDepth = furthest) to size/opacity
const getDepthFactor = (z: number, maxDepth: number): number => {
  return 1 - Math.abs(z) / maxDepth; // 1 at z=0, 0 at z=-maxDepth
};

const NeuralFabric = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef(0);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Config - disable on mobile, create 3D neural fabric on desktop
    const isMobile = window.innerWidth < 768;
    
    // Disable on mobile entirely
    if (isMobile) {
      return () => {};
    }
    
    const particleCount = 400; // Dense mesh for 3D fabric effect
    const connectionDist = 150; // Tighter connections for mesh
    const maxDepth = 400; // Much deeper z-space for pronounced depth
    const orbitRadiusMin = 10;
    const orbitRadiusMax = 40; // Smaller orbits, more mesh-like
    const globalRotationSpeed = 0.00015; // Faster rotation to show 3D structure
    const depthLayerMovementSpeed = 0.0003; // Layers move at different speeds
    
    // Strong depth-based visibility
    const minSize = 1;
    const maxSize = 5; // Dramatic size difference for depth
    const minOpacity = 0.08; // Far particles very faint
    const maxOpacity = 0.6; // Close particles more visible
    const minLineOpacity = 0.02;
    const maxLineOpacity = 0.2; // More visible mesh lines

    // Cleanup existing renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      containerRef.current.innerHTML = '';
    }

    const scene = new THREE.Scene();
    
    // Use container dimensions instead of window dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const camera = new THREE.OrthographicCamera(
      -w / 2, w / 2,
      h / 2, -h / 2,
      1, 1000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create circle texture for crisp particles
    const circleTexture = createCircleTexture();

    // Particle data - 3D mesh with depth layers
    const particles: Particle[] = [];
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 4); // RGBA for opacity

    // Full viewport with deeper particles pushed to edges
    const spawnW = w * 1.2;
    const spawnH = h * 1.2;

    for (let i = 0; i < particleCount; i++) {
      // Random position
      const originX = (Math.random() - 0.5) * spawnW;
      const originY = (Math.random() - 0.5) * spawnH;
      
      // Calculate distance from center for depth mapping
      const normalizedX = Math.abs(originX) / (spawnW / 2);
      const normalizedY = Math.abs(originY) / (spawnH / 2);
      const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
      
      // Create 3D fabric: center particles are further back, edge particles are closer
      // This creates a bowl/fabric shape that wraps around content
      // 70% of depth range used, with center pushed back
      const depthBias = Math.pow(1 - Math.min(distanceFromCenter, 1), 2); // 0=edge, 1=center
      const originZ = -depthBias * maxDepth * 0.7 - (Math.random() * maxDepth * 0.3);
      
      // Orbital parameters for constrained chaotic movement
      const orbitRadius = orbitRadiusMin + Math.random() * (orbitRadiusMax - orbitRadiusMin);
      const angle = Math.random() * Math.PI * 2;
      const angleSpeed = (Math.random() - 0.5) * 0.008; // Individual rotation speed
      
      // Phase offsets for 3D lissajous patterns
      const phaseX = Math.random() * Math.PI * 2;
      const phaseY = Math.random() * Math.PI * 2;
      const phaseZ = Math.random() * Math.PI * 2;
      
      const depthFactor = getDepthFactor(originZ, maxDepth);
      
      // Center fade factor for content readability
      const centerDistanceFactor = Math.min(1, distanceFromCenter * 1.2);
      
      particles.push({
        x: originX,
        y: originY,
        z: originZ,
        originX,
        originY,
        originZ,
        angle,
        angleSpeed,
        orbitRadius,
        phaseX,
        phaseY,
        phaseZ,
        centerDistanceFactor,
      });

      positions[i * 3] = originX;
      positions[i * 3 + 1] = originY;
      positions[i * 3 + 2] = originZ;
      
      // Dramatic size based on depth for 3D effect
      sizes[i] = minSize + (maxSize - minSize) * Math.pow(depthFactor, 1.5);
      
      // Opacity based on depth with subtle center fade
      const baseOpacity = minOpacity + (maxOpacity - minOpacity) * Math.pow(depthFactor, 1.2);
      const opacity = baseOpacity * (0.5 + 0.5 * centerDistanceFactor); // 50-100% based on distance
      
      colors[i * 4] = 1;     // R
      colors[i * 4 + 1] = 1; // G
      colors[i * 4 + 2] = 1; // B
      colors[i * 4 + 3] = opacity; // A
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 4));

    // Custom shader material for particles with per-particle size and opacity
    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: circleTexture },
      },
      vertexShader: `
        attribute float size;
        attribute vec4 color;
        varying vec4 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * 2.0; // Scale up for visibility
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec4 vColor;
        
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          if (texColor.a < 0.1) discard;
          gl_FragColor = vec4(vColor.rgb, vColor.a * texColor.a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Line system with vertex colors for depth-based opacity
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSystem);

    const animate = () => {
      timeRef.current += 0.01; // Time progression
      
      const pPositions = particleSystem.geometry.attributes.position.array as Float32Array;
      const pSizes = particleSystem.geometry.attributes.size.array as Float32Array;
      const pColors = particleSystem.geometry.attributes.color.array as Float32Array;
      
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      // Global rotation for spinning 3D fabric effect
      const globalRotation = timeRef.current * globalRotationSpeed;
      
      // Camera subtle rotation for enhanced 3D perception
      const cameraRotation = Math.sin(timeRef.current * 0.00005) * 0.1;
      camera.position.x = Math.sin(cameraRotation) * 10;
      camera.position.y = Math.cos(cameraRotation) * 10;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      particles.forEach((p, i) => {
        // Update individual particle angle for orbital movement
        p.angle += p.angleSpeed;
        
        // Create 3D orbital movement with lissajous curves
        const time = timeRef.current * 0.001;
        
        // Multi-dimensional oscillation - more pronounced Z movement for depth
        const offsetX = Math.cos(p.angle + p.phaseX) * p.orbitRadius;
        const offsetY = Math.sin(p.angle + p.phaseY) * p.orbitRadius;
        const offsetZ = Math.sin(time * 3 + p.phaseZ) * (p.orbitRadius * 0.8); // More Z movement
        
        // Apply global rotation in 3D space
        const rotatedX = offsetX * Math.cos(globalRotation) - offsetY * Math.sin(globalRotation);
        const rotatedY = offsetX * Math.sin(globalRotation) + offsetY * Math.cos(globalRotation);
        
        // Different depth layers move at slightly different speeds for parallax
        const depthLayerSpeed = (1 - Math.abs(p.originZ) / maxDepth) * depthLayerMovementSpeed;
        const layerRotation = timeRef.current * depthLayerSpeed;
        const finalRotatedX = rotatedX * Math.cos(layerRotation) - rotatedY * Math.sin(layerRotation);
        const finalRotatedY = rotatedX * Math.sin(layerRotation) + rotatedY * Math.cos(layerRotation);
        
        // Update position relative to origin (constrained movement)
        p.x = p.originX + finalRotatedX;
        p.y = p.originY + finalRotatedY;
        p.z = p.originZ + offsetZ;

        // Update position buffer
        pPositions[i * 3] = p.x;
        pPositions[i * 3 + 1] = p.y;
        pPositions[i * 3 + 2] = p.z;
        
        // Update size and opacity based on current z for dramatic 3D depth
        const depthFactor = getDepthFactor(p.z, maxDepth);
        pSizes[i] = minSize + (maxSize - minSize) * Math.pow(depthFactor, 1.5);
        
        // Apply depth-based opacity with subtle center fade
        const baseOpacity = minOpacity + (maxOpacity - minOpacity) * Math.pow(depthFactor, 1.2);
        pColors[i * 4 + 3] = baseOpacity * (0.5 + 0.5 * p.centerDistanceFactor);

        // Connections - use 3D distance for true mesh
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          
          // Calculate 3D distance for authentic mesh
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = (p.z - p2.z) * 0.5; // Weight Z less for more connections across layers
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDist ** 2) {
            // Add line segment positions
            linePositions.push(p.x, p.y, p.z);
            linePositions.push(p2.x, p2.y, p2.z);
            
            // Calculate opacity based on depth of both particles
            const depth1 = getDepthFactor(p.z, maxDepth);
            const depth2 = getDepthFactor(p2.z, maxDepth);
            
            // Fade by 3D distance between particles
            const dist = Math.sqrt(distSq);
            const distFade = 1 - dist / connectionDist;
            
            // Apply subtle center fade to lines
            const centerFade1 = 0.5 + 0.5 * p.centerDistanceFactor;
            const centerFade2 = 0.5 + 0.5 * p2.centerDistanceFactor;
            const avgCenterFade = (centerFade1 + centerFade2) / 2;
            
            // Use pow for more dramatic depth effect
            const opacity1 = (minLineOpacity + (maxLineOpacity - minLineOpacity) * Math.pow(depth1, 1.2)) * distFade * avgCenterFade;
            const opacity2 = (minLineOpacity + (maxLineOpacity - minLineOpacity) * Math.pow(depth2, 1.2)) * distFade * avgCenterFade;
            
            // Indigo-300 color: rgb(165, 180, 252) normalized
            const r = 165 / 255;
            const g = 180 / 255;
            const b = 252 / 255;
            
            // First vertex color
            lineColors.push(r * opacity1, g * opacity1, b * opacity1);
            // Second vertex color  
            lineColors.push(r * opacity2, g * opacity2, b * opacity2);
          }
        }
      });

      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.size.needsUpdate = true;
      particleSystem.geometry.attributes.color.needsUpdate = true;

      if (linePositions.length > 0) {
        lineSystem.geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(linePositions, 3)
        );
        lineSystem.geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute(lineColors, 3)
        );
        lineSystem.geometry.setDrawRange(0, linePositions.length / 3);
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newW = rect.width;
      const newH = rect.height;
      
      camera.left = -newW / 2;
      camera.right = newW / 2;
      camera.top = newH / 2;
      camera.bottom = -newH / 2;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      circleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cleanup = initScene();

    return () => {
      cleanup?.();
    };
  }, [initScene]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default NeuralFabric;