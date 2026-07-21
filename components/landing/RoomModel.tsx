"use client"
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export function Model({ onError, onLoad }: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load the model correctly using useGLTF
  const { scene } = useGLTF('/models/room.glb');

  // Set up the model once it loads
  useEffect(() => {
    if (scene && modelRef.current) {
      try {
        // Clone the scene to avoid reference issues
        const clonedScene = scene.clone();

        // Set up the model
        clonedScene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Set up materials
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material: THREE.Material) => {
                  material.needsUpdate = true;
                });
              } else {
                child.material.needsUpdate = true;
              }
            }
          }
        });

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(clonedScene);
        const center = box.getCenter(new THREE.Vector3());
        clonedScene.position.sub(center);

        // Scale if needed
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        if (maxSize > 5) {
          const scale = 5 / maxSize;
          clonedScene.scale.setScalar(scale);
        }

        // Clear and add the model
        modelRef.current.clear();
        modelRef.current.add(clonedScene);
        
        setIsLoaded(true);
        onLoad?.();
      } catch (error) {
        console.error('Error configuring model:', error);
        onError?.('Error configuring the 3D model');
      }
    }
  }, [scene, onError, onLoad]);

  // Subtle animation
  useFrame((state) => {
    if (modelRef.current && isLoaded) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return <group ref={modelRef} />;
}

// Preload the model
useGLTF.preload('/models/room.glb');
