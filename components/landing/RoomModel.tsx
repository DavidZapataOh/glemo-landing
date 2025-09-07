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
  
  // Cargar el modelo usando useGLTF de manera correcta
  const { scene } = useGLTF('/models/room.glb');

  // Configurar el modelo cuando se carga
  useEffect(() => {
    if (scene && modelRef.current) {
      try {
        // Clonar la escena para evitar problemas de referencia
        const clonedScene = scene.clone();
        
        // Configurar el modelo
        clonedScene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Configurar materiales
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

        // Centrar y escalar el modelo
        const box = new THREE.Box3().setFromObject(clonedScene);
        const center = box.getCenter(new THREE.Vector3());
        clonedScene.position.sub(center);
        
        // Escalar si es necesario
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        if (maxSize > 5) {
          const scale = 5 / maxSize;
          clonedScene.scale.setScalar(scale);
        }

        // Limpiar y agregar el modelo
        modelRef.current.clear();
        modelRef.current.add(clonedScene);
        
        setIsLoaded(true);
        onLoad?.();
      } catch (error) {
        console.error('Error configuring model:', error);
        onError?.('Error al configurar el modelo 3D');
      }
    }
  }, [scene, onError, onLoad]);

  // Animación sutil
  useFrame((state) => {
    if (modelRef.current && isLoaded) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return <group ref={modelRef} />;
}

// Precargar el modelo
useGLTF.preload('/models/room.glb');
