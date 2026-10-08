import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, Eye, Layers } from "lucide-react";

export default function ThreeEquipmentViewer({ modelType = "mri", equipmentName = "Diagnostic Equipment" }) {
  const containerRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [statusText, setStatusText] = useState("Calibrated & Ready");

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Deep slate background

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4); // Clinical teal/cyan accent
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.8);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);

    // Subtle grid platform
    const grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    grid.position.y = -0.5;
    scene.add(grid);

    // 5. Build Procedural 3D Medical Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    buildModel(modelType, modelGroup);

    // 6. Interaction handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.005;
      }

      // Dynamic model pulsation / rotation effects
      if (modelGroupRef.current) {
        const ring = modelGroupRef.current.getObjectByName("scanRing");
        if (ring) {
          ring.rotation.z += 0.03;
        }
        const beam = modelGroupRef.current.getObjectByName("pulseBeam");
        if (beam) {
          beam.scale.y = 1 + Math.sin(elapsedTime * 4) * 0.2;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [modelType]);

  // Update wireframe state on existing meshes
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  function buildModel(type, group) {
    // Clear old children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.4 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.8 });
    const emissiveRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1
    });

    if (type === "mri") {
      // MRI Outer Torus Gantry
      const outerGantryGeo = new THREE.CylinderGeometry(1.9, 1.9, 1.6, 32);
      const outerGantry = new THREE.Mesh(outerGantryGeo, whiteMat);
      outerGantry.rotation.x = Math.PI / 2;
      outerGantry.position.set(0, 0.8, -0.2);
      group.add(outerGantry);

      // Bore tunnel
      const boreGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.62, 32);
      const bore = new THREE.Mesh(boreGeo, darkMat);
      bore.rotation.x = Math.PI / 2;
      bore.position.set(0, 0.8, -0.2);
      group.add(bore);

      // Glowing scan ring
      const ringGeo = new THREE.TorusGeometry(1.02, 0.05, 16, 32);
      const ring = new THREE.Mesh(ringGeo, emissiveRingMat);
      ring.name = "scanRing";
      ring.position.set(0, 0.8, 0.58);
      group.add(ring);

      // Patient Table Bed
      const bedGeo = new THREE.BoxGeometry(0.8, 0.15, 3.2);
      const bed = new THREE.Mesh(bedGeo, whiteMat);
      bed.position.set(0, 0.25, 0.6);
      group.add(bed);

      const cushionGeo = new THREE.BoxGeometry(0.65, 0.06, 2.8);
      const cushion = new THREE.Mesh(cushionGeo, blueMat);
      cushion.position.set(0, 0.35, 0.6);
      group.add(cushion);

      // Bed Pedestal Stand
      const standGeo = new THREE.BoxGeometry(0.5, 0.6, 1.8);
      const stand = new THREE.Mesh(standGeo, darkMat);
      stand.position.set(0, -0.15, 0.6);
      group.add(stand);
    } else if (type === "ct") {
      // CT Scanner Tilted Gantry
      const ctGantryGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.8, 32);
      const ctGantry = new THREE.Mesh(ctGantryGeo, whiteMat);
      ctGantry.rotation.x = Math.PI / 2 + 0.12; // Realistic CT gantry tilt
      ctGantry.position.set(0, 0.8, -0.4);
      group.add(ctGantry);

      const boreGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.82, 32);
      const bore = new THREE.Mesh(boreGeo, darkMat);
      bore.rotation.x = Math.PI / 2 + 0.12;
      bore.position.set(0, 0.8, -0.4);
      group.add(bore);

      // Laser alignment beam emitter
      const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.name = "pulseBeam";
      laser.rotation.z = Math.PI / 2;
      laser.position.set(0, 0.8, -0.0);
      group.add(laser);

      // Bed
      const bedGeo = new THREE.BoxGeometry(0.75, 0.12, 3.0);
      const bed = new THREE.Mesh(bedGeo, whiteMat);
      bed.position.set(0, 0.2, 0.8);
      group.add(bed);

      const standGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16);
      const stand = new THREE.Mesh(standGeo, blueMat);
      stand.position.set(0, -0.2, 0.8);
      group.add(stand);
    } else if (type === "ventilator") {
      // ICU Ventilator Column & Stand
      const baseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
      const base = new THREE.Mesh(baseGeo, darkMat);
      base.position.y = -0.4;
      group.add(base);

      // 4 Castor wheels
      for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), darkMat);
        const angle = (i * Math.PI) / 2;
        wheel.position.set(Math.cos(angle) * 0.5, -0.45, Math.sin(angle) * 0.5);
        group.add(wheel);
      }

      // Mast pole
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 16);
      const pole = new THREE.Mesh(poleGeo, whiteMat);
      pole.position.y = 0.3;
      group.add(pole);

      // Main Ventilator Engine Unit
      const engineGeo = new THREE.BoxGeometry(0.8, 0.7, 0.6);
      const engine = new THREE.Mesh(engineGeo, whiteMat);
      engine.position.set(0, 0.9, 0);
      group.add(engine);

      // Digital Touchscreen Display
      const screenGeo = new THREE.BoxGeometry(0.7, 0.45, 0.05);
      const screen = new THREE.Mesh(screenGeo, emissiveRingMat);
      screen.position.set(0, 1.35, 0.15);
      screen.rotation.x = -0.2;
      group.add(screen);

      // Dual breathing circuit tubes
      const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.7, 0.3),
        new THREE.Vector3(0.4, 0.4, 0.6),
        new THREE.Vector3(0.1, 0.2, 1.0)
      ]);
      const tubeGeo1 = new THREE.TubeGeometry(curve1, 20, 0.04, 8, false);
      const tube1 = new THREE.Mesh(tubeGeo1, blueMat);
      group.add(tube1);
    } else if (type === "ecg") {
      // Portable ECG Cart
      const cartGeo = new THREE.BoxGeometry(0.9, 0.9, 0.6);
      const cart = new THREE.Mesh(cartGeo, whiteMat);
      cart.position.y = 0.2;
      group.add(cart);

      // Upper ECG module
      const topGeo = new THREE.BoxGeometry(0.75, 0.25, 0.5);
      const top = new THREE.Mesh(topGeo, blueMat);
      top.position.set(0, 0.75, 0);
      group.add(top);

      // Tilted ECG Monitor
      const monGeo = new THREE.BoxGeometry(0.65, 0.4, 0.06);
      const mon = new THREE.Mesh(monGeo, emissiveRingMat);
      mon.position.set(0, 1.1, 0.1);
      mon.rotation.x = -0.25;
      group.add(mon);

      // Lead Cable arm
      const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
      const arm = new THREE.Mesh(armGeo, darkMat);
      arm.position.set(-0.4, 1.0, 0);
      arm.rotation.z = -0.3;
      group.add(arm);
    } else {
      // Ultrasound Cart
      const bodyGeo = new THREE.BoxGeometry(0.7, 0.9, 0.6);
      const body = new THREE.Mesh(bodyGeo, whiteMat);
      body.position.y = 0.2;
      group.add(body);

      // Articulated Monitor
      const monArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), darkMat);
      monArm.position.set(0, 0.85, -0.1);
      group.add(monArm);

      const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.48, 0.05), emissiveRingMat);
      monitor.position.set(0, 1.15, -0.05);
      group.add(monitor);

      // Probe holster & wire
      const probeGeo = new THREE.CylinderGeometry(0.05, 0.03, 0.25, 12);
      const probe = new THREE.Mesh(probeGeo, blueMat);
      probe.position.set(0.4, 0.7, 0.2);
      group.add(probe);
    }
  }

  const handleZoom = (inOut) => {
    if (!cameraRef.current) return;
    const factor = inOut ? -0.8 : 0.8;
    cameraRef.current.position.z = Math.max(3, Math.min(10, cameraRef.current.position.z + factor));
  };

  const resetCamera = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(0, 2.5, 6.5);
    cameraRef.current.lookAt(0, 0.5, 0);
    modelGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative select-none"
      />

      {/* Floating 3D HUD Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-slate-100">{equipmentName}</span>
        <span className="text-slate-400">·</span>
        <span className="text-teal-400 font-mono text-[11px]">{statusText}</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Auto Rotation"
          className={`p-1.5 rounded-lg transition-colors ${autoRotate ? "bg-teal-500/20 text-teal-300" : "text-slate-400 hover:text-slate-200"}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          title="Toggle Wireframe Inspection"
          className={`p-1.5 rounded-lg transition-colors ${wireframe ? "bg-teal-500/20 text-teal-300" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(true)}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(false)}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetCamera}
          title="Reset View"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="text-slate-500">Interactive 3D:</span>
          <span>Click and drag to rotate freely · Zoom with buttons</span>
        </span>
        <span className="font-mono text-[11px] text-teal-400">Three.js WebGL Engine</span>
      </div>
    </div>
  );
}
