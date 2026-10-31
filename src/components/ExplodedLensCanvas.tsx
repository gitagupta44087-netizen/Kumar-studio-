import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { STUDIO_CONFIG } from '../config/studioConfig';
import { computeLensExplosionState, LensExplosionState } from '../utils/studioLogic';
import { getHeroFallbackLensDataUrl } from '../utils/proceduralArt';

interface ExplodedLensCanvasProps {
  scrollProgress: number;
  onSelectPart?: (partId: 'glass' | 'iris' | 'gears' | 'barrel') => void;
}

const detectSoftwareGl = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
};

function createCarbonFiberTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#121215';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      const even = ((x + y) / 16) % 2 === 0;
      ctx.fillStyle = even ? '#1B1B20' : '#0E0E11';
      ctx.fillRect(x, y, 15, 15);
      ctx.fillStyle = even ? '#262429' : '#161519';
      ctx.fillRect(x + 2, y + 2, 11, 5);
    }
  }

  // Gold distance scale ring markings
  ctx.fillStyle = '#C8893B';
  ctx.fillRect(0, 122, 256, 3);
  ctx.fillStyle = '#F2C27B';
  for (let x = 8; x < 256; x += 16) {
    const h = x % 32 === 8 ? 14 : 8;
    ctx.fillRect(x, 126, 2, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export const ExplodedLensCanvas: React.FC<ExplodedLensCanvasProps> = ({
  scrollProgress,
  onSelectPart,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [isLiteFallback, setIsLiteFallback] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  const effectiveProgress = manualProgress !== null ? manualProgress : scrollProgress;
  const explosionState: LensExplosionState = computeLensExplosionState(effectiveProgress);

  const targetProgressRef = useRef<number>(effectiveProgress);
  const pointerTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    targetProgressRef.current = effectiveProgress;
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [effectiveProgress]);

  useEffect(() => {
    if (isLiteFallback) return;
    const container = canvasMountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    const isSoftwareGl = detectSoftwareGl();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglReady(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0d, 0.045);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0.3, 0.4, 9.2);
    camera.lookAt(0, 0, 0);

    // Mandatory studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xf4efe6, 0x18151c, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffdca8, 2.6);
    keyLight.position.set(5, 6, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffb347, 2.2);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    const coolFill = new THREE.PointLight(0x7ca6d8, 1.1, 16);
    coolFill.position.set(-4, -4, 4);
    scene.add(coolFill);

    // Master Lens Group tilted at iconic 45-degree cinema angle
    const lensRoot = new THREE.Group();
    lensRoot.rotation.z = THREE.MathUtils.degToRad(-35);
    lensRoot.rotation.y = THREE.MathUtils.degToRad(28);
    lensRoot.rotation.x = THREE.MathUtils.degToRad(14);
    scene.add(lensRoot);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const carbonTex = createCarbonFiberTexture(maxAniso);

    // PBR Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: carbonTex,
      roughness: 0.48,
      metalness: 0.35,
    });

    const moltenBronzeMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8893b,
      roughness: 0.22,
      metalness: 0.92,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    const brushedGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf2c27b,
      roughness: 0.16,
      metalness: 0.96,
    });

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x19191e,
      roughness: 0.35,
      metalness: 0.82,
    });

    const opticalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdff4ff,
      roughness: 0.05,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 1.0,
      ior: 1.62,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0xf2c27b),
      attenuationDistance: 2.8,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const amberCoatingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffb347,
      roughness: 0.08,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.86,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 0.95,
      ior: 1.75,
      clearcoat: 1.0,
      depthWrite: false,
    });

    // Sub-Groups for Exploded View Assembly along Y axis of lensRoot
    const frontGlassGroup = new THREE.Group();
    const irisAssemblyGroup = new THREE.Group();
    const bronzeGearsGroup = new THREE.Group();
    const rearBarrelGroup = new THREE.Group();

    lensRoot.add(frontGlassGroup, irisAssemblyGroup, bronzeGearsGroup, rearBarrelGroup);

    // 1. FRONT GLASS ELEMENT GROUP (Parts 1, 2, 3)
    const frontHoodGeo = new THREE.CylinderGeometry(1.48, 1.42, 0.38, 48, 1, true);
    const frontHoodMesh = new THREE.Mesh(frontHoodGeo, darkTitaniumMat);
    frontHoodMesh.position.y = 1.05;
    frontGlassGroup.add(frontHoodMesh);

    const goldFilterRingGeo = new THREE.TorusGeometry(1.44, 0.035, 16, 64);
    const goldFilterRing = new THREE.Mesh(goldFilterRingGeo, brushedGoldMat);
    goldFilterRing.rotation.x = Math.PI / 2;
    goldFilterRing.position.y = 1.22;
    frontGlassGroup.add(goldFilterRing);

    // Aspherical Convex Front Glass Meniscus
    const frontLensGeo = new THREE.SphereGeometry(1.36, 40, 24, 0, Math.PI * 2, 0, 0.68);
    const frontLensMesh = new THREE.Mesh(frontLensGeo, opticalGlassMat);
    frontLensMesh.scale.set(1, 0.48, 1);
    frontLensMesh.position.y = 0.72;
    frontLensMesh.renderOrder = 4;
    frontGlassGroup.add(frontLensMesh);

    // Secondary Chromatic Doublet Glass
    const doubletGeo = new THREE.CylinderGeometry(1.22, 1.18, 0.22, 40);
    const doubletMesh = new THREE.Mesh(doubletGeo, amberCoatingMat);
    doubletMesh.position.y = 0.56;
    doubletMesh.renderOrder = 3;
    frontGlassGroup.add(doubletMesh);

    // 2. MECHANICAL 9-BLADE IRIS APERTURE GROUP (Parts 4, 5)
    const irisHousingGeo = new THREE.CylinderGeometry(1.34, 1.34, 0.28, 48, 1, true);
    const irisHousing = new THREE.Mesh(irisHousingGeo, darkTitaniumMat);
    irisHousing.position.y = 0.2;
    irisAssemblyGroup.add(irisHousing);

    const irisGoldBezelGeo = new THREE.TorusGeometry(1.35, 0.025, 12, 48);
    const irisGoldBezel = new THREE.Mesh(irisGoldBezelGeo, moltenBronzeMat);
    irisGoldBezel.rotation.x = Math.PI / 2;
    irisGoldBezel.position.y = 0.32;
    irisAssemblyGroup.add(irisGoldBezel);

    const bladePivots: THREE.Object3D[] = [];
    const bladeCount = 9;
    const bladeGeo = new THREE.BoxGeometry(0.68, 0.018, 0.34);
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const pivot = new THREE.Object3D();
      pivot.position.set(Math.cos(angle) * 0.92, 0.2 + i * 0.002, Math.sin(angle) * 0.92);
      pivot.rotation.y = -angle;

      const blade = new THREE.Mesh(bladeGeo, darkTitaniumMat);
      blade.position.set(-0.32, 0, 0.12);
      pivot.add(blade);

      // Tiny gold rivet on each iris blade
      const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), brushedGoldMat);
      rivet.position.set(0, 0.015, 0);
      pivot.add(rivet);

      irisAssemblyGroup.add(pivot);
      bladePivots.push(pivot);
    }

    // 3. MOLTEN BRONZE GEARS & HELICOID RING GROUP (Parts 6, 7)
    const helicoidCoreGeo = new THREE.CylinderGeometry(1.28, 1.28, 0.46, 48);
    const helicoidCore = new THREE.Mesh(helicoidCoreGeo, moltenBronzeMat);
    helicoidCore.position.y = -0.22;
    bronzeGearsGroup.add(helicoidCore);

    // Instanced 40 Precision Gear Teeth around the Helicoid Ring
    const toothCount = 40;
    const toothGeo = new THREE.BoxGeometry(0.08, 0.38, 0.09);
    const gearTeethInstanced = new THREE.InstancedMesh(toothGeo, brushedGoldMat, toothCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < toothCount; i++) {
      const a = (i / toothCount) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 1.31, -0.22, Math.sin(a) * 1.31);
      dummy.rotation.set(0, -a, 0);
      dummy.updateMatrix();
      gearTeethInstanced.setMatrixAt(i, dummy.matrix);
    }
    gearTeethInstanced.instanceMatrix.needsUpdate = true;
    gearTeethInstanced.computeBoundingSphere();
    bronzeGearsGroup.add(gearTeethInstanced);

    // Secondary Follow-Focus Pinion Gear on the flank
    const pinionGroup = new THREE.Group();
    pinionGroup.position.set(1.56, -0.22, 0);
    const pinionCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.32, 24),
      brushedGoldMat
    );
    const pinionShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.65, 16),
      darkTitaniumMat
    );
    pinionGroup.add(pinionCyl, pinionShaft);
    bronzeGearsGroup.add(pinionGroup);

    // 4. CARBON-FIBER BARREL & BAYONET MOUNT GROUP (Parts 8, 9, 10)
    const mainBarrelGeo = new THREE.CylinderGeometry(1.36, 1.26, 1.05, 48);
    const mainBarrel = new THREE.Mesh(mainBarrelGeo, carbonMat);
    mainBarrel.position.y = -0.95;
    rearBarrelGroup.add(mainBarrel);

    const goldAccentBand = new THREE.Mesh(
      new THREE.TorusGeometry(1.365, 0.022, 12, 64),
      brushedGoldMat
    );
    goldAccentBand.rotation.x = Math.PI / 2;
    goldAccentBand.position.y = -0.52;
    rearBarrelGroup.add(goldAccentBand);

    // Rear Apochromatic Glass Element
    const rearGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.88, 32, 16, 0, Math.PI * 2, 0, 0.65),
      opticalGlassMat
    );
    rearGlass.scale.set(1, -0.45, 1);
    rearGlass.position.y = -1.45;
    rearGlass.renderOrder = 2;
    rearBarrelGroup.add(rearGlass);

    // Machined Bayonet Mount + 8 Gold Electronic Contacts (InstancedMesh)
    const bayonetMount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.96, 0.88, 0.28, 36),
      darkTitaniumMat
    );
    bayonetMount.position.y = -1.58;
    rearBarrelGroup.add(bayonetMount);

    const contactsInstanced = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.038, 12, 12),
      brushedGoldMat,
      8
    );
    for (let i = 0; i < 8; i++) {
      const a = -0.6 + i * 0.17;
      dummy.position.set(Math.cos(a) * 0.78, -1.72, Math.sin(a) * 0.78);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      contactsInstanced.setMatrixAt(i, dummy.matrix);
    }
    contactsInstanced.instanceMatrix.needsUpdate = true;
    contactsInstanced.computeBoundingSphere();
    rearBarrelGroup.add(contactsInstanced);

    // Contact Shadow Grounding Plane beneath the floating lens
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,0.65)');
    grad.addColorStop(0.5, 'rgba(200,137,59,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 5.5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.45;
    scene.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Damped state for smooth interpolation
    let currentProgress = targetProgressRef.current;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let isDisposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const applySceneState = (prog: number, tiltX: number, tiltY: number) => {
      const st = computeLensExplosionState(prog);
      frontGlassGroup.position.y = st.glassOffset * 0.55;
      irisAssemblyGroup.position.y = st.irisOffset * 0.45;
      bronzeGearsGroup.position.y = st.gearsOffset * 0.45;
      rearBarrelGroup.position.y = st.barrelOffset * 0.52;

      // Rotate bronze gears & pinion as lens focuses/explodes
      bronzeGearsGroup.rotation.y = prog * Math.PI * 1.4;
      pinionGroup.rotation.y = -prog * Math.PI * 3.8;

      // Open and close mechanical iris blades
      const bladeSwing = THREE.MathUtils.lerp(0.12, 0.72, 1 - st.apertureBladesOpen);
      for (let i = 0; i < bladePivots.length; i++) {
        bladePivots[i].rotation.y = -(i / bladePivots.length) * Math.PI * 2 + bladeSwing;
      }

      // Gentle tilt parallax
      lensRoot.rotation.z = THREE.MathUtils.degToRad(-35) + tiltX * 0.18;
      lensRoot.rotation.x = THREE.MathUtils.degToRad(14) + tiltY * 0.18;
      lensRoot.rotation.y = THREE.MathUtils.degToRad(28) + prog * 0.45 + tiltX * 0.12;
    };

    const requestRender = () => {
      if (isDisposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (isDisposed) return;
        renderDirty = false;

        const targetProg = targetProgressRef.current;
        const targetX = pointerTiltRef.current.x;
        const targetY = pointerTiltRef.current.y;

        currentProgress = THREE.MathUtils.lerp(currentProgress, targetProg, 0.18);
        currentTiltX = THREE.MathUtils.lerp(currentTiltX, targetX, 0.15);
        currentTiltY = THREE.MathUtils.lerp(currentTiltY, targetY, 0.15);

        applySceneState(currentProgress, currentTiltX, currentTiltY);
        renderer.render(scene, camera);

        const stillMoving =
          Math.abs(currentProgress - targetProg) > 0.002 ||
          Math.abs(currentTiltX - targetX) > 0.003 ||
          Math.abs(currentTiltY - targetY) > 0.003;

        if (stillMoving) {
          renderDirty = true;
        }

        const done = () => {
          renderBusy = false;
          if (renderDirty && !isDisposed) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    requestRenderRef.current = requestRender;
    applySceneState(currentProgress, 0, 0);
    requestRender();

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerTiltRef.current = { x: nx, y: ny };
      requestRender();
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const nx = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
        const ny = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
        pointerTiltRef.current = { x: nx, y: ny };
        requestRender();
      }
    };

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      requestRenderRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', handleResize);
      carbonTex.dispose();
      shadowTex.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [isLiteFallback]);

  const activePart =
    STUDIO_CONFIG.lensParts.find((p) => p.id === explosionState.activePartId) ||
    STUDIO_CONFIG.lensParts[0];

  const handlePartJump = (partId: 'glass' | 'iris' | 'gears' | 'barrel') => {
    const mapProgress: Record<'glass' | 'iris' | 'gears' | 'barrel', number> = {
      glass: 0.15,
      iris: 0.38,
      gears: 0.62,
      barrel: 0.9,
    };
    setManualProgress(mapProgress[partId]);
    if (onSelectPart) onSelectPart(partId);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none" data-testid="hero-3d-viewport">
      {/* Layer 1: Octane-Render 16:9 Backdrop Image with CSS Parallax */}
      <img
        src={getHeroFallbackLensDataUrl()}
        alt="Exploded 3D luxury cinema lens render with bronze gears and optical glass"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none transition-transform duration-300"
        style={{
          transform: `scale(${1 + explosionState.progress * 0.06})`,
        }}
      />

      {/* Layer 2: Dedicated Isolated WebGL Canvas Mount (Zero backdrop-filter over canvas) */}
      {!isLiteFallback && webglReady && (
        <div
          ref={canvasMountRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Measured Scrim for Left-Column Editorial Typography Contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,11,13,0.92) 0%, rgba(11,11,13,0.68) 42%, rgba(11,11,13,0.18) 72%, rgba(11,11,13,0.55) 100%)',
        }}
      />

      {/* Top-Right Optical Telemetry Readout (Static, Tabular Numerals, Zero Pulsing Dots) */}
      <div className="hidden lg:flex flex-col items-end gap-1.5 absolute top-24 right-8 z-10 pointer-events-none font-mono-spec text-xs text-[#8E8A84]">
        <div className="text-[#F4EFE6] tracking-wider">
          OPTICAL AXIS · {Math.round(explosionState.progress * 100)}% EXPLODED
        </div>
        <div>
          APERTURE {explosionState.fStopLabel} · 1/250s · ISO 100 · 85MM
        </div>
        <div className="text-[#F2C27B]">
          ACTIVE ELEMENT: {activePart.code} / {activePart.name.toUpperCase()}
        </div>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[min(920px,94vw)]">
        <div className="flex justify-center mb-1.5">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="px-3 py-1 text-xs font-mono-spec text-[#F4EFE6] bg-[#141418] border border-gold-hairline rounded-t-md hover:border-[#F2C27B] transition-colors whitespace-nowrap shrink-0"
            aria-expanded={!dockCollapsed}
          >
            {dockCollapsed ? '▴ Show Optical Controls' : '▾ Hide Optical Controls'}
          </button>
        </div>

        {!dockCollapsed && (
          <div className="bg-[#121216] border border-gold-hairline rounded-xl px-4 py-2.5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Part Selector Buttons: Glass, Iris, Gears, Barrel */}
            <div className="flex items-center gap-1.5 shrink-0">
              {STUDIO_CONFIG.lensParts.map((part) => {
                const isActive = explosionState.activePartId === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => handlePartJump(part.id as 'glass' | 'iris' | 'gears' | 'barrel')}
                    className={`px-3 py-1.5 text-xs font-mono-spec rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#C8893B] text-[#0B0B0D] font-semibold'
                        : 'bg-[#1A1A20] text-[#F4EFE6] hover:text-[#F2C27B]'
                    }`}
                  >
                    {part.name}
                  </button>
                );
              })}
              {manualProgress !== null && (
                <button
                  type="button"
                  onClick={() => setManualProgress(null)}
                  className="px-2 py-1 text-xs font-mono-spec text-[#F2C27B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Exploded View Slider */}
            <div className="flex items-center gap-2.5 shrink-0">
              <label
                htmlFor="lens-explode-slider"
                className="text-xs font-mono-spec text-[#8E8A84] whitespace-nowrap shrink-0"
              >
                Explode
              </label>
              <input
                id="lens-explode-slider"
                type="range"
                min={0}
                max={100}
                value={Math.round(effectiveProgress * 100)}
                onChange={(e) => setManualProgress(Number(e.target.value) / 100)}
                className="w-28 accent-[#C8893B] cursor-pointer"
              />
              <span className="text-xs font-mono-spec text-[#F2C27B] w-10 text-right shrink-0">
                {explosionState.fStopLabel}
              </span>
            </div>

            {/* Active Part Readout & Lite Fallback Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden xl:block text-xs text-[#8E8A84] truncate max-w-[200px]">
                <span className="text-[#F4EFE6] font-medium">{activePart.name}:</span>{' '}
                {activePart.fullTitle}
              </div>
              <button
                type="button"
                onClick={() => setIsLiteFallback((prev) => !prev)}
                className="px-2.5 py-1 text-xs font-mono-spec border border-white/15 rounded text-[#8E8A84] hover:text-[#F4EFE6] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isLiteFallback ? 'Enable 3D Lens' : '2D Lite Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
