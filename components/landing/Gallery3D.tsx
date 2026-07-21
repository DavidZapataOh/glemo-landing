// components/landing/Gallery3D.tsx
"use client"
import React, { useState } from 'react';
import Image from 'next/image';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Gallery3D = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window === 'undefined' || !containerRef.current) return;

  //   // Create scene
  //   const scene = new THREE.Scene();
  //   sceneRef.current = scene;

  //   // Create orthographic camera with a closer zoom
  //   const width = containerRef.current.clientWidth;
  //   const height = containerRef.current.clientHeight;
  //   const aspect = width / height;
    
  //   const camera = new THREE.OrthographicCamera(
  //     -0.2 * aspect, // left
  //     0.2 * aspect,  // right
  //     0.25,           // top
  //     -0.15,          // bottom
  //     0.1,            // near
  //     1000            // far
  //   );
    
  //   camera.position.set(0.3, 0.3, 0.3);
  //   camera.lookAt(0, 0, 0);
  //   cameraRef.current = camera;
    
  //   // Create optimized renderer
  //   const renderer = new THREE.WebGLRenderer({ 
  //     antialias: true, 
  //     alpha: true,
  //     powerPreference: "high-performance"
  //   });
  //   renderer.setSize(width, height);
  //   renderer.setClearColor(0x1a1a1a, 0);
  //   // Disable shadows for better performance
  //   renderer.shadowMap.enabled = false;
  //   rendererRef.current = renderer;

  //   containerRef.current.appendChild(renderer.domElement);

  //   // Optimized lighting without shadows
  //   const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Bumped up the intensity
  //   scene.add(ambientLight);

  //   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  //   directionalLight.position.set(10, 10, 5);
  //   // No shadows for better performance
  //   directionalLight.castShadow = false;
  //   scene.add(directionalLight);
    
  //   const pointLight = new THREE.PointLight(0xffffff, 0.3);
  //   pointLight.position.set(-5, 5, -5);
  //   scene.add(pointLight);

  //   // Load model
  //   const loader = new GLTFLoader();
  //   loader.load(
  //     '/models/room.glb',
  //     (gltf) => {
  //       const model = gltf.scene;
  //       modelRef.current = model;
        
  //       // Set up the model without shadows for better performance
  //       model.traverse((child) => {
  //         if (child instanceof THREE.Mesh) {
  //           // Disable shadows for every object
  //           child.castShadow = false;
  //           child.receiveShadow = false;

  //           // Optimize materials
  //           if (child.material) {
  //             if (Array.isArray(child.material)) {
  //               child.material.forEach((material: THREE.Material) => {
  //                 material.needsUpdate = true;
  //                 // Optimize for better performance
  //                 if (material instanceof THREE.MeshStandardMaterial) {
  //                   material.envMapIntensity = 0.5;
  //                 }
  //               });
  //             } else {
  //               child.material.needsUpdate = true;
  //               if (child.material instanceof THREE.MeshStandardMaterial) {
  //                 child.material.envMapIntensity = 0.5;
  //               }
  //             }
  //           }
  //         }
  //       });

  //       // Compute the model's bounding box
  //       const box = new THREE.Box3().setFromObject(model);
  //       const center = box.getCenter(new THREE.Vector3());
  //       const size = box.getSize(new THREE.Vector3());
        
  //       console.log('Model center:', center);
  //       console.log('Model size:', size);

  //       // Center the model on X and Z only, keep Y at 0
  //       model.position.x = -center.x;
  //       model.position.z = -center.z;
  //       model.position.y = 0;
        
  //       // Scale the model so it is visible
  //       const maxSize = Math.max(size.x, size.y, size.z);
  //       let scale = 1;
        
  //       if (maxSize > 0) {
  //         scale = 2 / maxSize;
  //         model.scale.setScalar(scale);
  //       }

  //       console.log('Model scale:', scale);
  //       console.log('Model position after centering:', model.position);

  //       // Adjust the camera position
  //       camera.position.set(0.3, 0.6, 0.3);
  //       camera.lookAt(0, 0, 0);
        
  //       console.log('Camera position:', camera.position);

  //       scene.add(model);
  //       setIsLoaded(true);
  //     },
  //     (progress) => {
  //       console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
  //     },
  //     (error) => {
  //       console.error('Error loading model:', error);
  //       setError('Error loading the 3D model');
  //     }
  //   );

  //   // Optimized render function
  //   let lastTime = 0;
  //   const animate = (currentTime: number) => {
  //     requestAnimationFrame(animate);
      
  //     // Cap FPS for better performance
  //     if (currentTime - lastTime > 16) { // ~60 FPS
  //       if (modelRef.current) {
  //         modelRef.current.rotation.y += 0.005;
  //       }
        
  //       renderer.render(scene, camera);
  //       lastTime = currentTime;
  //     }
  //   };

  //   animate(0);

  //   // Handle resizing
  //   const handleResize = () => {
  //     if (!containerRef.current || !camera || !renderer) return;

  //     const width = containerRef.current.clientWidth;
  //     const height = containerRef.current.clientHeight;
  //     const aspect = width / height;
      
  //     // Update the orthographic camera bounds
  //     camera.left = -0.2 * aspect;
  //     camera.right = 0.2 * aspect;
  //     camera.top = 0.25;
  //     camera.bottom = -0.15;
  //     camera.updateProjectionMatrix();
      
  //     renderer.setSize(width, height);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     if (rendererRef.current) {
  //       rendererRef.current.dispose();
  //     }
  //     if (containerRef.current && rendererRef.current) {
  //       containerRef.current.removeChild(rendererRef.current.domElement);
  //     }
  //   };
  // }, []);

  if (error) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center text-textSecondary p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm mb-2">3D rendering error</p>
          <p className="text-xs opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <div className="w-full h-full relative">
        <Image
          src="/models/room.png"
          alt="Gallery 3D Room"
          fill
          className="object-cover rounded-2xl"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError('Error loading the room image')}
        />
        
        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 bg-elementBackground/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-xs z-10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
            Customizable 3D Gallery
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery3D;