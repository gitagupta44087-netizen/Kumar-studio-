import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { STUDIO_CONFIG, GearProduct } from '../config/studioConfig';
import { buildGearWhatsAppUrl } from '../utils/studioLogic';
import { RotateCw, ArrowUpRight } from 'lucide-react';

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

function buildProceduralGearModel(
  modelType: GearProduct['modelType'],
  isSoftwareGl: boolean
): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x18181d,
    roughness: 0.42,
    metalness: 0.78,
  });

  const bronzeMat = new THREE.MeshPhysicalMaterial({
    color: 0xc8893b,
    roughness: 0.2,
    metalness: 0.94,
    clearcoat: 0.4,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2c27b,
    roughness: 0.16,
    metalness: 0.96,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd8f3ff,
    roughness: 0.05,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.88,
    transparent: true,
    opacity: isSoftwareGl ? 0.45 : 1.0,
    ior: 1.6,
    clearcoat: 1.0,
    depthWrite: false,
  });

  if (modelType === 'cinema-prime') {
    // 6-part Cinema Prime Lens
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.95, 2.1, 40), bodyMat);
    const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.45, 36), bronzeMat);
    focusRing.position.y = 0.25;
    const irisRing = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.24, 36), goldMat);
    irisRing.position.y = -0.35;
    const frontHood = new THREE.Mesh(
      new THREE.CylinderGeometry(1.16, 1.05, 0.4, 40, 1, true),
      bodyMat
    );
    frontHood.position.y = 1.15;
    const frontGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 32, 16, 0, Math.PI * 2, 0, 0.65),
      glassMat
    );
    frontGlass.scale.set(1, 0.45, 1);
    frontGlass.position.y = 0.88;
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.68, 0.3, 32), goldMat);
    mount.position.y = -1.15;

    group.add(barrel, focusRing, irisRing, frontHood, frontGlass, mount);
    group.rotation.z = THREE.MathUtils.degToRad(-28);
    group.rotation.x = THREE.MathUtils.degToRad(18);
  } else if (modelType === 'medium-format-body') {
    // 7-part Full-Frame / Medium Format Cinema Camera Body
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.55, 1.15), bodyMat);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 1.52, 24), bodyMat);
    grip.position.set(-0.95, 0, 0.35);
    const evfPrism = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.38, 0.95), bodyMat);
    evfPrism.position.set(0, 0.92, -0.05);
    const mountFlange = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.08, 16, 40), bronzeMat);
    mountFlange.position.set(0.1, -0.04, 0.6);
    const sensorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.54, 0.05), glassMat);
    sensorGlass.position.set(0.1, -0.04, 0.58);
    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 20), goldMat);
    shutterBtn.position.set(-0.88, 0.82, 0.42);
    const topDial = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 24), bronzeMat);
    topDial.position.set(-0.55, 0.82, 0.1);

    group.add(chassis, grip, evfPrism, mountFlange, sensorGlass, shutterBtn, topDial);
  } else if (modelType === 'carbon-gimbal') {
    // 6-part 3-Axis Pro Gimbal Stabilizer
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.65, 24), bodyMat);
    handle.position.y = -0.75;
    const panMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 28), bronzeMat);
    panMotor.position.y = 0.12;
    const armHorizontal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.16, 0.22), bodyMat);
    armHorizontal.position.set(0.45, 0.32, 0);
    const rollMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.24, 24), goldMat);
    rollMotor.rotation.x = Math.PI / 2;
    rollMotor.position.set(1.1, 0.85, 0);
    const verticalArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.15, 0.22), bodyMat);
    verticalArm.position.set(1.1, 0.85, 0);
    const cameraPlate = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.75), bronzeMat);
    cameraPlate.position.set(0.15, 0.95, 0);

    group.add(handle, panMotor, armHorizontal, rollMotor, verticalArm, cameraPlate);
  } else {
    // 6-part Studio Strobe Monolight
    const strobeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.72, 1.75, 36), bodyMat);
    strobeBody.rotation.z = Math.PI / 2;
    const reflectorDish = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 0.72, 0.65, 36, 1, true),
      bronzeMat
    );
    reflectorDish.rotation.z = Math.PI / 2;
    reflectorDish.position.x = 1.1;
    const flashTubeDome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), glassMat);
    flashTubeDome.position.x = 0.92;
    const goldBand = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.04, 12, 40), goldMat);
    goldBand.rotation.y = Math.PI / 2;
    goldBand.position.x = 0.2;
    const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.1, 20), bodyMat);
    bracket.position.y = -0.95;

    group.add(strobeBody, reflectorDish, flashTubeDome, goldBand, bracket);
  }

  return group;
}

export const GearShop3DViewer: React.FC = () => {
  const [selectedGear, setSelectedGear] = useState<GearProduct>(STUDIO_CONFIG.gearShop[0]);
  const [rotationPreset, setRotationPreset] = useState<{ yaw: number; pitch: number }>({
    yaw: 0.55,
    pitch: 0.22,
  });

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0.55, pitch: 0.22 });
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRenderRef = useRef<(() => void) | null>(null);
  const rebuildModelRef = useRef<((type: GearProduct['modelType']) => void) | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.5, 5.6);
    camera.lookAt(0, 0, 0);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const hemi = new THREE.HemisphereLight(0xf4efe6, 0x16151c, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffdca8, 2.4);
    key.position.set(4, 5, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffb347, 1.9);
    rim.position.set(-4, 2, -4);
    scene.add(rim);

    // Turntable pedestal ring
    const pedestal = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.02, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0xc8893b })
    );
    pedestal.rotation.x = Math.PI / 2;
    pedestal.position.y = -1.55;
    scene.add(pedestal);

    const holder = new THREE.Group();
    scene.add(holder);

    let activeModel = buildProceduralGearModel(selectedGear.modelType, isSoftwareGl);
    holder.add(activeModel);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let isDisposed = false;
    let currentYaw = rotationRef.current.yaw;
    let currentPitch = rotationRef.current.pitch;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (st === gl.UNSIGNALED) {
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

        currentYaw = THREE.MathUtils.lerp(currentYaw, rotationRef.current.yaw, 0.22);
        currentPitch = THREE.MathUtils.lerp(currentPitch, rotationRef.current.pitch, 0.22);

        holder.rotation.y = currentYaw;
        holder.rotation.x = currentPitch;

        renderer.render(scene, camera);

        if (
          Math.abs(currentYaw - rotationRef.current.yaw) > 0.003 ||
          Math.abs(currentPitch - rotationRef.current.pitch) > 0.003
        ) {
          renderDirty = true;
        }

        const done = () => {
          renderBusy = false;
          if (renderDirty && !isDisposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;
    rebuildModelRef.current = (newType: GearProduct['modelType']) => {
      holder.remove(activeModel);
      activeModel = buildProceduralGearModel(newType, isSoftwareGl);
      holder.add(activeModel);
      requestRender();
    };

    requestRender();

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (rebuildModelRef.current) {
      rebuildModelRef.current(selectedGear.modelType);
    }
  }, [selectedGear]);

  const applyPresetAngle = (yaw: number, pitch: number) => {
    rotationRef.current = { yaw, pitch };
    setRotationPreset({ yaw, pitch });
    if (requestRenderRef.current) requestRenderRef.current();
  };

  return (
    <section
      id="gear-shop"
      aria-labelledby="gear-shop-heading"
      className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0B0B0D]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12">
          <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
            05 · Pro Camera Shop & Rentals · Kacheri Station Road
          </p>
          <h2
            id="gear-shop-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#F4EFE6]"
          >
            3D Optical & Studio Gear Showroom
          </h2>
          <p className="text-[#8E8A84] text-base mt-3 max-w-2xl">
            Drag to rotate our flagship cinema bodies, master primes, gimbals, and strobes in 360°
            before renting or purchasing at our Chhapra showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive 3D Drag-to-Rotate Viewport */}
          <div className="lg:col-span-7 bg-[#121216] border border-gold-hairline rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] viewfinder-frame">
            {/* Top Spec Readout */}
            <div className="p-5 flex items-center justify-between z-10 pointer-events-none">
              <span className="font-mono-spec text-xs text-[#F2C27B]">
                {selectedGear.category.toUpperCase()} · {selectedGear.exifBadge}
              </span>
              <span className="font-mono-spec text-xs text-[#8E8A84] inline-flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#C8893B]" />
                <span>DRAG TO ROTATE 360°</span>
              </span>
            </div>

            {/* Isolated WebGL Canvas Container */}
            <div
              ref={canvasMountRef}
              data-testid="gear-3d-canvas"
              onPointerDown={(e) => {
                isDraggingRef.current = true;
                prevPointerRef.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerMove={(e) => {
                if (!isDraggingRef.current) return;
                const dx = e.clientX - prevPointerRef.current.x;
                const dy = e.clientY - prevPointerRef.current.y;
                prevPointerRef.current = { x: e.clientX, y: e.clientY };
                rotationRef.current = {
                  yaw: rotationRef.current.yaw + dx * 0.012,
                  pitch: Math.max(-0.8, Math.min(0.8, rotationRef.current.pitch + dy * 0.01)),
                };
                if (requestRenderRef.current) requestRenderRef.current();
              }}
              onPointerUp={() => {
                isDraggingRef.current = false;
              }}
              onPointerLeave={() => {
                isDraggingRef.current = false;
              }}
              className="w-full h-[320px] sm:h-[360px] cursor-grab active:cursor-grabbing"
            />

            {/* Bottom Camera Angle Presets */}
            <div className="p-4 border-t border-white/10 bg-[#15151A] flex items-center justify-between gap-2 flex-wrap z-10">
              <span className="text-xs font-mono-spec text-[#8E8A84]">CAMERA ANGLE:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Studio 45°', yaw: 0.55, pitch: 0.22 },
                  { label: 'Front Axis', yaw: 0, pitch: 0 },
                  { label: 'Profile 90°', yaw: 1.57, pitch: 0.1 },
                  { label: 'Top Overhead', yaw: 0.3, pitch: 0.75 },
                ].map((preset) => {
                  const isCurrent =
                    Math.abs(rotationPreset.yaw - preset.yaw) < 0.05 &&
                    Math.abs(rotationPreset.pitch - preset.pitch) < 0.05;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPresetAngle(preset.yaw, preset.pitch)}
                      className={`px-2.5 py-1 text-xs font-mono-spec rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'bg-[#C8893B] text-[#0B0B0D] font-semibold'
                          : 'bg-[#1D1D24] text-[#F4EFE6] hover:text-[#F2C27B]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Gear Selector & WhatsApp Enquiry Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#131317] border border-gold-hairline rounded-2xl p-6 sm:p-8">
            <div>
              <span className="text-xs font-mono-spec text-[#8E8A84] block mb-2">
                SELECT EQUIPMENT MODEL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {STUDIO_CONFIG.gearShop.map((gear) => {
                  const active = gear.id === selectedGear.id;
                  return (
                    <button
                      key={gear.id}
                      type="button"
                      onClick={() => setSelectedGear(gear)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1E1B16] border-[#F2C27B] text-[#F4EFE6]'
                          : 'bg-[#17171C] border-white/10 text-[#8E8A84] hover:text-[#F4EFE6]'
                      }`}
                    >
                      <div className="font-mono-spec text-[11px] text-[#F2C27B]">
                        {gear.category}
                      </div>
                      <div className="text-xs font-semibold text-[#F4EFE6] mt-0.5 truncate">
                        {gear.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-semibold text-[#F4EFE6]">
                {selectedGear.name}
              </h3>
              <p className="text-sm text-[#8E8A84] mt-2 leading-relaxed">
                {selectedGear.tagline}
              </p>

              <ul className="mt-5 pt-5 border-t border-white/10 space-y-2 text-xs text-[#F4EFE6]">
                {selectedGear.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 font-mono-spec">
                    <span className="text-[#C8893B]">·</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-[11px] font-mono-spec text-[#8E8A84]">
                    RENTAL RATE
                  </span>
                  <span className="text-xl font-mono-spec font-semibold text-[#F2C27B]">
                    {selectedGear.pricePerDay}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] font-mono-spec text-[#8E8A84]">
                    RETAIL PURCHASE
                  </span>
                  <span className="text-base font-mono-spec text-[#F4EFE6]">
                    {selectedGear.purchasePrice}
                  </span>
                </div>
              </div>

              <a
                href={buildGearWhatsAppUrl(selectedGear.name, selectedGear.pricePerDay)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl bg-gold-gradient text-[#0B0B0D] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all whitespace-nowrap"
              >
                <span>Enquire on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
