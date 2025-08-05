
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ModelViewerProps {
  modelUrl: string;
}

export function ModelViewer({ modelUrl }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0xa050be,
      metalness: 0.1,
      roughness: 0.6,
    });

    // Loader
    const loader = new STLLoader();
    loader.load(
      modelUrl,
      function (geometry) {
        console.log(`Model successfully loaded: ${modelUrl}`);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Center and scale the model
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        if (boundingBox) {
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            mesh.position.sub(center);

            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.5 / maxDim;
            mesh.scale.set(scale, scale, scale);
        }

        scene.add(mesh);
        
        // Adjust camera to fit the model
        const box = new THREE.Box3().setFromObject(mesh);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        
        camera.position.z = boxSize * 1.2;
        camera.position.x = boxCenter.x;
        camera.position.y = boxCenter.y;
        
        controls.target.copy(boxCenter);
        controls.update();

      },
      (xhr) => {
        // Log progress if needed
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.error(`An error happened while loading the model: ${modelUrl}. This is often due to a 404 error (file not found). Please check if the file exists in the public/models directory and the path is correct.`, error);
      }
    );

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[300px] md:min-h-[500px] rounded-lg bg-gray-200 border"
      aria-label="3D model viewer"
    />
  );
}
