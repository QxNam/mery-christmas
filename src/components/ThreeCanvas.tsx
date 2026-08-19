import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { ParticleState, MemoryPhoto, AppSettings } from '../types';
import { createParticleTexture, createTextTexture, createTreeStarTexture } from '../utils/textureGenerator';
import { THEME_PRESETS } from '../utils/themes';

export interface ThreeCanvasRef {
  captureSnapshot: () => string | null;
  resetCamera: () => void;
  selectPhotoIndex: (idx: number) => void;
}

interface Props {
  state: ParticleState;
  setState: (s: ParticleState) => void;
  photos: MemoryPhoto[];
  selectedPhotoIndex: number;
  setSelectedPhotoIndex: (idx: number) => void;
  settings: AppSettings;
  handX: number; // 0 to 1
  isHandActive: boolean;
}

export const ThreeCanvas = forwardRef<ThreeCanvasRef, Props>(({
  state,
  setState,
  photos,
  selectedPhotoIndex,
  setSelectedPhotoIndex,
  settings,
  handX,
  isHandActive
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to mutable Three.js items
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);

  const groupGoldRef = useRef<THREE.Points | null>(null);
  const groupRedRef = useRef<THREE.Points | null>(null);
  const groupGiftRef = useRef<THREE.Points | null>(null);
  const groupSnowRef = useRef<THREE.Points | null>(null);

  const photoMeshesRef = useRef<THREE.Mesh[]>([]);
  const titleMeshRef = useRef<THREE.Mesh | null>(null);
  const starMeshRef = useRef<THREE.Mesh | null>(null);
  const loveMeshRef = useRef<THREE.Mesh | null>(null);

  // Interaction / Dragging state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentRotationY: 0,
    targetRotationY: 0,
    pitchAngle: 0,
    targetPitchAngle: 0
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const selectedIdxRef = useRef(selectedPhotoIndex);
  selectedIdxRef.current = selectedPhotoIndex;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const handXRef = useRef(handX);
  handXRef.current = handX;

  const isHandActiveRef = useRef(isHandActive);
  isHandActiveRef.current = isHandActive;

  // Expose API to parent for snapshots & direct navigation
  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return null;
    },
    resetCamera: () => {
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, 100);
        cameraRef.current.lookAt(0, 0, 0);
      }
      dragRef.current.targetRotationY = 0;
      dragRef.current.targetPitchAngle = 0;
    },
    selectPhotoIndex: (idx: number) => {
      setSelectedPhotoIndex(idx);
    }
  }));

  // Initialize Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.0018);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Build Particles & Decorations
    const theme = THEME_PRESETS.find(t => t.id === settings.theme) || THEME_PRESETS[0];

    const qualityCounts = {
      low: { gold: 1200, red: 180, gift: 80, snow: 400 },
      medium: { gold: 2400, red: 350, gift: 160, snow: 800 },
      high: { gold: 3800, red: 500, gift: 250, snow: 1400 }
    }[settings.particleQuality];

    // Particle Texture maps
    const texGold = createParticleTexture('gold');
    const texRed = createParticleTexture('red');
    const texGift = createParticleTexture('gift');
    const texSnow = createParticleTexture('snow');

    const CONFIG = {
      treeHeight: 72,
      treeBaseRadius: 36,
      explodeRadius: 68
    };

    function createParticleGroup(type: 'gold' | 'red' | 'gift', count: number, size: number, hexColor: number) {
      const pPositions = [];
      const pExplodeTargets = [];
      const pTreeTargets = [];
      const pHeartTargets = [];
      const sizes = [];
      const phases = [];

      for (let i = 0; i < count; i++) {
        // --- TREE SHAPE ---
        const h = Math.random() * CONFIG.treeHeight;
        const y = h - CONFIG.treeHeight / 2;
        const radiusRatio = type === 'gold' ? Math.sqrt(Math.random()) : 0.88 + Math.random() * 0.14;
        const maxR = (1 - h / CONFIG.treeHeight) * CONFIG.treeBaseRadius;
        const r = maxR * radiusRatio;
        const theta = Math.random() * Math.PI * 2;
        pTreeTargets.push(r * Math.cos(theta), y, r * Math.sin(theta));

        // --- EXPLODE SPHERE SHAPE ---
        const u = Math.random();
        const v = Math.random();
        const phi = Math.acos(2 * v - 1);
        const lam = 2 * Math.PI * u;
        const radMult = type === 'gift' ? 1.25 : 1.0;
        const rad = CONFIG.explodeRadius * Math.cbrt(Math.random()) * radMult;
        pExplodeTargets.push(rad * Math.sin(phi) * Math.cos(lam), rad * Math.sin(phi) * Math.sin(lam), rad * Math.cos(phi));

        // --- HEART SHAPE ---
        const tHeart = Math.random() * Math.PI * 2;
        let hx = 16 * Math.pow(Math.sin(tHeart), 3);
        let hy = 13 * Math.cos(tHeart) - 5 * Math.cos(2 * tHeart) - 2 * Math.cos(3 * tHeart) - Math.cos(4 * tHeart);
        const rFill = Math.pow(Math.random(), 0.35);
        hx *= rFill;
        hy *= rFill;
        const hz = (Math.random() - 0.5) * 10 * rFill;
        const noise = 0.8;
        hx += (Math.random() - 0.5) * noise;
        hy += (Math.random() - 0.5) * noise;
        const scaleH = 2.3;
        pHeartTargets.push(hx * scaleH, hy * scaleH + 4, hz + (Math.random() - 0.5) * noise);

        // INITIAL AT TREE
        pPositions.push(pTreeTargets[i * 3], pTreeTargets[i * 3 + 1], pTreeTargets[i * 3 + 2]);
        sizes.push(size);
        phases.push(Math.random() * Math.PI * 2);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
      geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      const colors = new Float32Array(count * 3);
      const baseColor = new THREE.Color(hexColor);

      for (let i = 0; i < count; i++) {
        colors[i * 3] = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      geo.userData = {
        tree: pTreeTargets,
        explode: pExplodeTargets,
        heart: pHeartTargets,
        phases: phases,
        baseColor: baseColor,
        baseSize: size
      };

      const texture = type === 'gold' ? texGold : type === 'red' ? texRed : texGift;
      const mat = new THREE.PointsMaterial({
        size: size,
        map: texture,
        transparent: true,
        opacity: 0.95,
        vertexColors: true,
        blending: type === 'gift' ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return points;
    }

    // Create snowfall system
    function createSnowSystem(count: number) {
      const positions = [];
      const velocities = [];
      for (let i = 0; i < count; i++) {
        positions.push(
          (Math.random() - 0.5) * 220,
          Math.random() * 160 - 40,
          (Math.random() - 0.5) * 220
        );
        velocities.push(
          (Math.random() - 0.5) * 0.15,
          -0.25 - Math.random() * 0.4,
          (Math.random() - 0.5) * 0.15
        );
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.userData = { velocities };

      const mat = new THREE.PointsMaterial({
        size: 3.2,
        map: texSnow,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });
      const snow = new THREE.Points(geo, mat);
      scene.add(snow);
      return snow;
    }

    groupGoldRef.current = createParticleGroup('gold', qualityCounts.gold, 2.2, theme.goldHex);
    groupRedRef.current = createParticleGroup('red', qualityCounts.red, 3.6, theme.redHex);
    groupGiftRef.current = createParticleGroup('gift', qualityCounts.gift, 3.2, theme.giftHex);
    groupSnowRef.current = createSnowSystem(qualityCounts.snow);

    // Billboards / Text
    // 1. Merry Christmas / Custom tree text
    const treeTextTex = createTextTexture(settings.customTreeText || 'MERRY CHRISTMAS', '✨ Holiday Magic ✨', '#FFD700', '#FF2200');
    const titleMat = new THREE.MeshBasicMaterial({ map: treeTextTex, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(62, 16), titleMat);
    titleMesh.position.set(0, 48, 0);
    scene.add(titleMesh);
    titleMeshRef.current = titleMesh;

    // 2. Star atop tree
    const starTex = createTreeStarTexture();
    const starMat = new THREE.MeshBasicMaterial({ map: starTex, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const starMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), starMat);
    starMesh.position.set(0, CONFIG.treeHeight / 2 + 3, 0);
    scene.add(starMesh);
    starMeshRef.current = starMesh;

    // 3. Heart Text "I LOVE YOU ❤️" / Custom Heart text
    const heartTextTex = createTextTexture(settings.customHeartText || 'I LOVE YOU ❤️', 'Forever & Always', '#FF69B4', '#FF1493');
    const loveMat = new THREE.MeshBasicMaterial({ map: heartTextTex, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const loveMesh = new THREE.Mesh(new THREE.PlaneGeometry(68, 18), loveMat);
    loveMesh.position.set(0, 0, 20);
    loveMesh.visible = false;
    scene.add(loveMesh);
    loveMeshRef.current = loveMesh;

    // 4. Memory Photo Cards (Interactive 3D Carousel)
    const textureLoader = new THREE.TextureLoader();
    const photoMeshes: THREE.Mesh[] = [];
    const photoGeo = new THREE.PlaneGeometry(9, 9);
    const borderGeo = new THREE.PlaneGeometry(10.2, 10.2);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });

    photos.forEach((photo, i) => {
      const tex = textureLoader.load(photo.url);
      const pMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      const pMesh = new THREE.Mesh(photoGeo, pMat);
      pMesh.userData = { photoIndex: i, photoData: photo };

      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.z = -0.08;
      pMesh.add(border);

      pMesh.visible = false;
      pMesh.scale.set(0, 0, 0);
      scene.add(pMesh);
      photoMeshes.push(pMesh);
    });
    photoMeshesRef.current = photoMeshes;

    // --- Particle Animation Helpers ---
    function updateParticles(group: THREE.Points, type: 'gold' | 'red' | 'gift', targetState: ParticleState, speed: number, time: number) {
      const positions = group.geometry.attributes.position.array as Float32Array;
      const sizes = group.geometry.attributes.size.array as Float32Array;
      const colors = group.geometry.attributes.color.array as Float32Array;
      const phases = group.geometry.userData.phases as number[];
      const baseColor = group.geometry.userData.baseColor as THREE.Color;
      const baseSize = group.geometry.userData.baseSize as number;

      const targetKey = targetState === 'TREE' ? 'tree' : targetState === 'HEART' ? 'heart' : 'explode';
      const targets = group.geometry.userData[targetState === 'PHOTO' ? 'explode' : targetKey] as number[];

      // Morph position towards targets
      for (let i = 0; i < positions.length; i++) {
        positions[i] += (targets[i] - positions[i]) * speed;
      }
      group.geometry.attributes.position.needsUpdate = true;

      const count = positions.length / 3;

      if (targetState === 'TREE') {
        for (let i = 0; i < count; i++) {
          sizes[i] = baseSize;
          let brightness = 1.0;
          if (type === 'red') {
            brightness = 0.5 + 0.5 * Math.sin(time * 3.5 + phases[i]);
          } else if (type === 'gold') {
            brightness = 0.75 + 0.45 * Math.sin(time * 8.0 + phases[i]);
          }
          colors[i * 3] = baseColor.r * brightness;
          colors[i * 3 + 1] = baseColor.g * brightness;
          colors[i * 3 + 2] = baseColor.b * brightness;
        }
        group.geometry.attributes.color.needsUpdate = true;
        group.geometry.attributes.size.needsUpdate = true;

      } else if (targetState === 'HEART') {
        const beatScale = 1.0 + Math.abs(Math.sin(time * 3.2)) * 0.14;
        group.scale.set(beatScale, beatScale, beatScale);

        for (let i = 0; i < count; i++) {
          colors[i * 3] = baseColor.r;
          colors[i * 3 + 1] = baseColor.g;
          colors[i * 3 + 2] = baseColor.b;
          sizes[i] = i % 3 === 0 ? baseSize * 1.1 : baseSize * 0.3;
        }
        group.geometry.attributes.color.needsUpdate = true;
        group.geometry.attributes.size.needsUpdate = true;

      } else {
        // EXPLODE or PHOTO
        group.scale.set(1, 1, 1);
        for (let i = 0; i < count; i++) {
          sizes[i] = baseSize;
          let brightness = 1.0;
          if (type === 'gold' || type === 'red') {
            brightness = 0.75 + 0.5 * Math.sin(time * 10 + phases[i]);
          }
          colors[i * 3] = baseColor.r * brightness;
          colors[i * 3 + 1] = baseColor.g * brightness;
          colors[i * 3 + 2] = baseColor.b * brightness;
        }
        group.geometry.attributes.color.needsUpdate = true;
        group.geometry.attributes.size.needsUpdate = true;
      }
    }

    // Snow update
    function updateSnow(snow: THREE.Points) {
      if (!settingsRef.current.snowfallEnabled) {
        snow.visible = false;
        return;
      }
      snow.visible = true;
      const positions = snow.geometry.attributes.position.array as Float32Array;
      const vels = snow.geometry.userData.velocities as number[];
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += vels[i * 3];
        positions[i * 3 + 1] += vels[i * 3 + 1];
        positions[i * 3 + 2] += vels[i * 3 + 2];

        // Wrap around bottom
        if (positions[i * 3 + 1] < -60) {
          positions[i * 3 + 1] = 90;
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
      }
      snow.geometry.attributes.position.needsUpdate = true;
    }

    // Animation Loop
    let lastTime = performance.now();
    function animate() {
      reqIdRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) * 0.001;
      lastTime = now;
      const time = now * 0.001;

      const currentState = stateRef.current;
      const speed = 0.09;

      // Handle user drag rotation & hand tracking
      if (isHandActiveRef.current) {
        // Hand gestures X coordinate drives rotation (-0.5 to 0.5) with 1.5x increased speed and sensitivity
        const targetRot = (handXRef.current - 0.5) * 9.75;
        dragRef.current.currentRotationY += (targetRot - dragRef.current.currentRotationY) * 0.12;
      } else {
        // Mouse/touch drag rotation with inertia
        dragRef.current.currentRotationY += (dragRef.current.targetRotationY - dragRef.current.currentRotationY) * 0.1;
        dragRef.current.pitchAngle += (dragRef.current.targetPitchAngle - dragRef.current.pitchAngle) * 0.1;

        if (settingsRef.current.autoRotate && currentState === 'TREE') {
          dragRef.current.targetRotationY += delta * 0.35;
        }
      }

      // Update Particle Systems
      if (groupGoldRef.current) updateParticles(groupGoldRef.current, 'gold', currentState, speed, time);
      if (groupRedRef.current) updateParticles(groupRedRef.current, 'red', currentState, speed, time);
      if (groupGiftRef.current) updateParticles(groupGiftRef.current, 'gift', currentState, speed, time);
      if (groupSnowRef.current) updateSnow(groupSnowRef.current);

      // Rotate groups based on drag
      const rotY = dragRef.current.currentRotationY;
      const rotX = dragRef.current.pitchAngle;

      [groupGoldRef.current, groupRedRef.current, groupGiftRef.current].forEach(g => {
        if (g) {
          if (currentState === 'HEART') {
            g.rotation.set(rotX * 0.3, rotY * 0.5, 0);
          } else {
            g.rotation.set(rotX * 0.4, rotY, 0);
          }
        }
      });

      // Update Billboards & Photos
      const title = titleMeshRef.current;
      const star = starMeshRef.current;
      const love = loveMeshRef.current;
      const meshes = photoMeshesRef.current;

      if (currentState === 'TREE') {
        if (title) {
          title.visible = true;
          title.position.set(0, 48, 0);
          title.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          title.lookAt(camera.position);
        }
        if (star) {
          star.visible = true;
          star.rotation.z -= 0.025;
          (star.material as THREE.MeshBasicMaterial).opacity = 0.75 + 0.25 * Math.sin(time * 5);
        }
        if (love) love.visible = false;

        meshes.forEach(m => {
          m.scale.lerp(new THREE.Vector3(0, 0, 0), 0.12);
          if (m.scale.x < 0.01) m.visible = false;
        });

      } else if (currentState === 'HEART') {
        if (title) title.visible = false;
        if (star) star.visible = false;
        if (love) {
          love.visible = true;
          const s = 1.0 + Math.abs(Math.sin(time * 3.2)) * 0.14;
          love.scale.set(s, s, 1);
          love.lookAt(camera.position);
        }
        meshes.forEach(m => {
          m.scale.lerp(new THREE.Vector3(0, 0, 0), 0.12);
          if (m.scale.x < 0.01) m.visible = false;
        });

      } else if (currentState === 'EXPLODE') {
        if (title) title.visible = false;
        if (star) star.visible = false;
        if (love) love.visible = false;

        const photoCount = Math.max(1, meshes.length);
        const baseAngle = rotY;
        const angleStep = (Math.PI * 2) / photoCount;
        const orbitRadius = 26;

        let bestIdx = 0;
        let maxZ = -9999;

        meshes.forEach((mesh, i) => {
          mesh.visible = true;
          const angle = baseAngle + i * angleStep;
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;
          const y = Math.sin(time * 1.5 + i * 1.2) * 3.5;

          mesh.position.lerp(new THREE.Vector3(x, y, z), 0.12);
          mesh.lookAt(camera.position);

          if (z > maxZ) {
            maxZ = z;
            bestIdx = i;
          }

          // Scale card larger when closest to camera
          if (z > 4) {
            const dynamicScale = 1.1 + (z / orbitRadius) * 0.9;
            mesh.scale.lerp(new THREE.Vector3(dynamicScale, dynamicScale, dynamicScale), 0.12);
          } else {
            mesh.scale.lerp(new THREE.Vector3(0.7, 0.7, 0.7), 0.12);
          }
        });

        if (bestIdx !== selectedIdxRef.current) {
          selectedIdxRef.current = bestIdx;
          setSelectedPhotoIndex(bestIdx);
        }

      } else if (currentState === 'PHOTO') {
        if (title) title.visible = false;
        if (star) star.visible = false;
        if (love) love.visible = false;

        const targetIndex = selectedIdxRef.current;
        meshes.forEach((mesh, i) => {
          if (i === targetIndex) {
            mesh.visible = true;
            mesh.position.lerp(new THREE.Vector3(0, 0, 58), 0.1);
            mesh.scale.lerp(new THREE.Vector3(4.8, 4.8, 4.8), 0.1);
            mesh.lookAt(camera.position);
          } else {
            mesh.scale.lerp(new THREE.Vector3(0, 0, 0), 0.12);
            if (mesh.scale.x < 0.01) mesh.visible = false;
          }
        });
      }

      renderer.render(scene, camera);
    }

    animate();

    // Window / Container resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [settings.theme, settings.particleQuality, photos.length]);

  // Update photo textures dynamically when user uploads or edits photos
  useEffect(() => {
    if (!sceneRef.current) return;
    const loader = new THREE.TextureLoader();
    photoMeshesRef.current.forEach((mesh, i) => {
      if (photos[i]) {
        loader.load(photos[i].url, newTex => {
          mesh.material = new THREE.MeshBasicMaterial({ map: newTex, side: THREE.DoubleSide });
          mesh.userData = { photoIndex: i, photoData: photos[i] };
        });
      }
    });
  }, [photos]);

  // Update billboard text when custom text settings change
  useEffect(() => {
    if (titleMeshRef.current) {
      const tex = createTextTexture(settings.customTreeText || 'MERRY CHRISTMAS', '✨ Holiday Magic ✨', '#FFD700', '#FF2200');
      titleMeshRef.current.material = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
    }
    if (loveMeshRef.current) {
      const tex = createTextTexture(settings.customHeartText || 'I LOVE YOU ❤️', 'Forever & Always', '#FF69B4', '#FF1493');
      loveMeshRef.current.material = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
    }
  }, [settings.customTreeText, settings.customHeartText]);

  // Pointer / Touch Handlers for Dragging & Tapping
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;

    dragRef.current.targetRotationY += dx * 0.008;
    dragRef.current.targetPitchAngle = Math.max(-0.4, Math.min(0.4, dragRef.current.targetPitchAngle + dy * 0.005));
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Click / Tap detection on photo cards in 3D scene
  const handleClick = (e: React.MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const activePhotoMeshes = photoMeshesRef.current.filter(m => m.visible);
    const intersects = raycaster.intersectObjects(activePhotoMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const idx = hit.userData?.photoIndex;
      if (typeof idx === 'number') {
        setSelectedPhotoIndex(idx);
        if (stateRef.current === 'EXPLODE') {
          setState('PHOTO');
        } else if (stateRef.current === 'PHOTO') {
          setState('EXPLODE');
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    />
  );
});
