
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

class FabricManager {
    private static instance: FabricManager | null = null;

    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.OrthographicCamera | null = null;
    private particles: Particle[] = [];
    private particleSystem: THREE.Points | null = null;
    private lineSystem: THREE.LineSegments | null = null;

    private animationFrameId: number | null = null;
    private time: number = 0;
    private isInitialized: boolean = false;
    private currentContainer: HTMLElement | null = null;

    // Config constants
    private readonly particleCount = 400;
    private readonly connectionDist = 150;
    private readonly maxDepth = 400;
    private readonly orbitRadiusMin = 10;
    private readonly orbitRadiusMax = 40;
    private readonly globalRotationSpeed = 0.00015;
    private readonly depthLayerMovementSpeed = 0.0003;
    private readonly minSize = 1;
    private readonly maxSize = 5;
    private readonly minOpacity = 0.08;
    private readonly maxOpacity = 0.6;
    private readonly minLineOpacity = 0.02;
    private readonly maxLineOpacity = 0.2;

    private constructor() { }

    public static getInstance(): FabricManager {
        if (!FabricManager.instance) {
            FabricManager.instance = new FabricManager();
        }
        return FabricManager.instance;
    }

    private createCircleTexture(): THREE.CanvasTexture {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const center = size / 2;
        const radius = size / 2 - 2;

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
    }

    private getDepthFactor(z: number, maxDepth: number): number {
        return 1 - Math.abs(z) / maxDepth;
    }

    public init() {
        if (this.isInitialized) return;
        if (typeof window === 'undefined') return;

        // Config - disable on mobile
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            this.isInitialized = true; // Mark as initialized but do nothing
            return;
        }

        this.scene = new THREE.Scene();

        // Initial camera setup (will be updated in resize)
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -w / 2, w / 2,
            h / 2, -h / 2,
            1, 1000
        );
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(w, h); // Initial size
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        const circleTexture = this.createCircleTexture();

        // Init Particles
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const colors = new Float32Array(this.particleCount * 4);

        const spawnW = w * 1.2;
        const spawnH = h * 1.2;

        for (let i = 0; i < this.particleCount; i++) {
            const originX = (Math.random() - 0.5) * spawnW;
            const originY = (Math.random() - 0.5) * spawnH;

            const normalizedX = Math.abs(originX) / (spawnW / 2);
            const normalizedY = Math.abs(originY) / (spawnH / 2);
            const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

            const depthBias = Math.pow(1 - Math.min(distanceFromCenter, 1), 2);
            const originZ = -depthBias * this.maxDepth * 0.7 - (Math.random() * this.maxDepth * 0.3);

            const orbitRadius = this.orbitRadiusMin + Math.random() * (this.orbitRadiusMax - this.orbitRadiusMin);
            const angle = Math.random() * Math.PI * 2;
            const angleSpeed = (Math.random() - 0.5) * 0.008;

            const phaseX = Math.random() * Math.PI * 2;
            const phaseY = Math.random() * Math.PI * 2;
            const phaseZ = Math.random() * Math.PI * 2;

            const depthFactor = this.getDepthFactor(originZ, this.maxDepth);
            const centerDistanceFactor = Math.min(1, distanceFromCenter * 1.2);

            this.particles.push({
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

            sizes[i] = this.minSize + (this.maxSize - this.minSize) * Math.pow(depthFactor, 1.5);

            const baseOpacity = this.minOpacity + (this.maxOpacity - this.minOpacity) * Math.pow(depthFactor, 1.2);
            const opacity = baseOpacity * (0.5 + 0.5 * centerDistanceFactor);

            colors[i * 4] = 1;
            colors[i * 4 + 1] = 1;
            colors[i * 4 + 2] = 1;
            colors[i * 4 + 3] = opacity;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 4));

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
          gl_PointSize = size * 2.0;
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

        this.particleSystem = new THREE.Points(particleGeo, particleMat);
        this.scene.add(this.particleSystem);

        const lineGeo = new THREE.BufferGeometry();
        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        this.lineSystem = new THREE.LineSegments(lineGeo, lineMat);
        this.scene.add(this.lineSystem);

        this.isInitialized = true;

        // Start global animation loop if not already handled by mount
        // Actually, we process data frames even if not mounted? 
        // Re-rendering without a DOM element is pointless, but calculating might be useful if we want "seamless" time.
        // However, for performance, we should only render when mounted. 
        // But we might want to update time/physics? No, let's pause when unmounted to save battery.
    }

    public mount(container: HTMLElement) {
        if (!this.isInitialized) {
            this.init();
        }

        if (!this.renderer || !this.scene || !this.camera) return; // Likely mobile or failed init

        this.currentContainer = container;

        // Append existing canvas
        if (!container.contains(this.renderer.domElement)) {
            container.appendChild(this.renderer.domElement);
        }

        // Resize to fit current container immediately
        this.handleResize();

        // Start/Resume animation
        if (!this.animationFrameId) {
            this.animate();
        }

        window.addEventListener('resize', this.boundResize);
    }

    public unmount() {
        // If we want to detatch the canvas:
        if (this.currentContainer && this.renderer) {
            try {
                if (this.currentContainer.contains(this.renderer.domElement)) {
                    this.currentContainer.removeChild(this.renderer.domElement);
                }
            } catch (e) {
                console.warn("Failed to remove canvas from container", e);
            }
        }
        this.currentContainer = null;

        // Stop animation to save resources while hidden
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        window.removeEventListener('resize', this.boundResize);
    }

    private boundResize = () => {
        this.handleResize();
    }

    private handleResize() {
        if (!this.currentContainer || !this.renderer || !this.camera) return;

        // Use container dimensions
        const rect = this.currentContainer.getBoundingClientRect();
        const newW = rect.width || window.innerWidth;
        const newH = rect.height || window.innerHeight;

        this.camera.left = -newW / 2;
        this.camera.right = newW / 2;
        this.camera.top = newH / 2;
        this.camera.bottom = -newH / 2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(newW, newH);
    }

    private animate = () => {
        if (!this.renderer || !this.scene || !this.camera || !this.particleSystem || !this.lineSystem) return;

        this.time += 0.01;

        const pPositions = this.particleSystem.geometry.attributes.position.array as Float32Array;
        const pSizes = this.particleSystem.geometry.attributes.size.array as Float32Array;
        const pColors = this.particleSystem.geometry.attributes.color.array as Float32Array;

        const linePositions: number[] = [];
        const lineColors: number[] = [];

        const globalRotation = this.time * this.globalRotationSpeed;

        const cameraRotation = Math.sin(this.time * 0.00005) * 0.1;
        this.camera.position.x = Math.sin(cameraRotation) * 10;
        this.camera.position.y = Math.cos(cameraRotation) * 10;
        this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix();

        this.particles.forEach((p, i) => {
            p.angle += p.angleSpeed;

            const time = this.time * 0.001;
            const offsetX = Math.cos(p.angle + p.phaseX) * p.orbitRadius;
            const offsetY = Math.sin(p.angle + p.phaseY) * p.orbitRadius;
            const offsetZ = Math.sin(time * 3 + p.phaseZ) * (p.orbitRadius * 0.8);

            const rotatedX = offsetX * Math.cos(globalRotation) - offsetY * Math.sin(globalRotation);
            const rotatedY = offsetX * Math.sin(globalRotation) + offsetY * Math.cos(globalRotation);

            const depthLayerSpeed = (1 - Math.abs(p.originZ) / this.maxDepth) * this.depthLayerMovementSpeed;
            const layerRotation = this.time * depthLayerSpeed;
            const finalRotatedX = rotatedX * Math.cos(layerRotation) - rotatedY * Math.sin(layerRotation);
            const finalRotatedY = rotatedX * Math.sin(layerRotation) + rotatedY * Math.cos(layerRotation);

            p.x = p.originX + finalRotatedX;
            p.y = p.originY + finalRotatedY;
            p.z = p.originZ + offsetZ;

            pPositions[i * 3] = p.x;
            pPositions[i * 3 + 1] = p.y;
            pPositions[i * 3 + 2] = p.z;

            const depthFactor = this.getDepthFactor(p.z, this.maxDepth);
            pSizes[i] = this.minSize + (this.maxSize - this.minSize) * Math.pow(depthFactor, 1.5);

            const baseOpacity = this.minOpacity + (this.maxOpacity - this.minOpacity) * Math.pow(depthFactor, 1.2);
            pColors[i * 4 + 3] = baseOpacity * (0.5 + 0.5 * p.centerDistanceFactor);

            for (let j = i + 1; j < this.particleCount; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dz = (p.z - p2.z) * 0.5;
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < this.connectionDist ** 2) {
                    linePositions.push(p.x, p.y, p.z);
                    linePositions.push(p2.x, p2.y, p2.z);

                    const depth1 = this.getDepthFactor(p.z, this.maxDepth);
                    const depth2 = this.getDepthFactor(p2.z, this.maxDepth);
                    const dist = Math.sqrt(distSq);
                    const distFade = 1 - dist / this.connectionDist;

                    const centerFade1 = 0.5 + 0.5 * p.centerDistanceFactor;
                    const centerFade2 = 0.5 + 0.5 * p2.centerDistanceFactor;
                    const avgCenterFade = (centerFade1 + centerFade2) / 2;

                    const opacity1 = (this.minLineOpacity + (this.maxLineOpacity - this.minLineOpacity) * Math.pow(depth1, 1.2)) * distFade * avgCenterFade;
                    const opacity2 = (this.minLineOpacity + (this.maxLineOpacity - this.minLineOpacity) * Math.pow(depth2, 1.2)) * distFade * avgCenterFade;

                    const r = 165 / 255;
                    const g = 180 / 255;
                    const b = 252 / 255;

                    lineColors.push(r * opacity1, g * opacity1, b * opacity1);
                    lineColors.push(r * opacity2, g * opacity2, b * opacity2);
                }
            }
        });

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.size.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;

        if (linePositions.length > 0) {
            this.lineSystem.geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(linePositions, 3)
            );
            this.lineSystem.geometry.setAttribute(
                'color',
                new THREE.Float32BufferAttribute(lineColors, 3)
            );
            this.lineSystem.geometry.setDrawRange(0, linePositions.length / 3);
        } else {
            this.lineSystem.geometry.setDrawRange(0, 0);
        }

        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(this.animate);
    }
}

export default FabricManager;
