// components/landing/Gallery3D.tsx
"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const Gallery3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Capturar el valor actual del ref al inicio del efecto
    const container = containerRef.current;
    if (!container) return;

    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x202020); // Slightly lighter background

    // Isometric Camera
    const aspectRatio = width / height;
    const cameraSize = 6;
    const camera = new THREE.OrthographicCamera(
      -cameraSize * aspectRatio, 
      cameraSize * aspectRatio, 
      cameraSize, 
      -cameraSize, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    
    // Position the camera for isometric view
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5; // Increased exposure
    container.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.3,  // strength - increased
      0.4,  // radius
      0.85  // threshold
    );
    composer.addPass(bloomPass);

    // Make the camera position fixed for isometric view
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disable controls to keep fixed view

    // Improved Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient light
    scene.add(ambientLight);

    // Main directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Brighter directional light
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);
    
    // Add spotlights specifically for certificates
    const createSpotlight = (x: number, y: number, z: number, color = 0xffffff, intensity = 1.5) => {
      const spotlight = new THREE.SpotLight(color, intensity);
      spotlight.position.set(x, y, z);
      spotlight.angle = Math.PI / 6;
      spotlight.penumbra = 0.5;
      spotlight.decay = 2;
      spotlight.distance = 15;
      spotlight.castShadow = true;
      spotlight.shadow.bias = -0.0001;
      scene.add(spotlight);
      return spotlight;
    };
    
    // Create multiple spotlights to ensure good lighting
    createSpotlight(3, 8, 3);
    createSpotlight(-3, 8, 3, 0xf5f5f5, 1.2);
    createSpotlight(0, 8, -3, 0xffffff, 1.2);
    
    // Add soft fill light
    const fillLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(fillLight);

    // Create room
    const roomSize = 10;
    const roomHeight = 6;
    
    // Colors for the room - Brighter and more appealing
    const floorColor = 0x404040; // Slightly lighter floor
    const wallColor = 0x4a4a4a; // Lighter walls
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: floorColor, 
      roughness: 0.7, 
      metalness: 0.1 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls - now with texture to make them more interesting
    const createWallTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base wall color
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle pattern
        ctx.fillStyle = '#636363';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 4 + 1;
          ctx.fillRect(x, y, size, size);
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 2);
      
      return texture;
    };
    
    const wallTexture = createWallTexture();
    
    // Enhanced wall material
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      map: wallTexture,
      color: wallColor, 
      roughness: 0.8, 
      metalness: 0.1,
      envMapIntensity: 0.5
    });

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -roomSize / 2;
    backWall.position.y = roomHeight / 2;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -roomSize / 2;
    leftWall.position.y = roomHeight / 2;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Add some floor decoration - a more attractive carpet
    const carpetGeometry = new THREE.PlaneGeometry(roomSize * 0.7, roomSize * 0.7);
    const carpetMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E4178, 
      roughness: 0.9, 
      metalness: 0.1,
      emissive: 0x1E4178,
      emissiveIntensity: 0.05 // Subtle glow
    });
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01; // Slightly above the floor to avoid z-fighting
    carpet.position.x = 0;
    carpet.position.z = 0;
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Add carpet border
    const carpetBorderGeometry = new THREE.PlaneGeometry(roomSize * 0.75, roomSize * 0.75);
    const carpetBorderMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x103058, 
      roughness: 0.9, 
      metalness: 0.2,
      emissive: 0x103058,
      emissiveIntensity: 0.05 // Subtle glow
    });
    const carpetBorder = new THREE.Mesh(carpetBorderGeometry, carpetBorderMaterial);
    carpetBorder.rotation.x = -Math.PI / 2;
    carpetBorder.position.y = 0.005; // Just below the carpet
    carpetBorder.position.x = 0;
    carpetBorder.position.z = 0;
    carpetBorder.receiveShadow = true;
    scene.add(carpetBorder);

    // Create enhanced certificates for the walls
    const createCertificates = () => {
      // Certificate positions - adjusted to be more visible
      const positions = [
        { wall: 'back', x: -2.5, y: 3, z: -roomSize/2 + 0.05, rotation: [0, 0, 0] },
        { wall: 'back', x: 1.5, y: 3, z: -roomSize/2 + 0.05, rotation: [0, 0, 0] },
        { wall: 'left', x: -roomSize/2 + 0.05, y: 3, z: -1.5, rotation: [0, Math.PI/2, 0] },
        { wall: 'left', x: -roomSize/2 + 0.05, y: 3, z: 2, rotation: [0, Math.PI/2, 0] },
      ];

      // Certificate colors - brighter and more vibrant
      const colors = [
        { primary: 0x1a73e8, secondary: 0x03a9f4 },
        { primary: 0x9c27b0, secondary: 0xe91e63 },
        { primary: 0x4caf50, secondary: 0x8bc34a },
        { primary: 0xff9800, secondary: 0xffeb3b },
      ];

      // Create certificates
      positions.forEach((pos, index) => {
        const certificateWidth = 1.8;
        const certificateHeight = 1.2;
        
        // Create frame with ambient occlusion to make it pop
        const frameGeometry = new THREE.BoxGeometry(certificateWidth + 0.1, certificateHeight + 0.1, 0.08);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x222222, 
          roughness: 0.7, 
          metalness: 0.3,
          emissive: 0x222222,
          emissiveIntensity: 0.05
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(pos.x, pos.y, pos.z);
        frame.rotation.set(pos.rotation[0], pos.rotation[1], pos.rotation[2]);
        
        // Adjust position based on wall
        if (pos.wall === 'back') {
          frame.position.z += 0.04;
        } else if (pos.wall === 'left') {
          frame.position.x += 0.04;
        }
        
        frame.castShadow = true;
        frame.receiveShadow = true;
        scene.add(frame);
        
        // Create spotlights specifically for certificates
        const certLight = new THREE.SpotLight(0xffffff, 1.5);
        certLight.position.set(
          pos.x + (pos.wall === 'back' ? 0 : -1),
          pos.y + 1, 
          pos.z + (pos.wall === 'left' ? 0 : -1)
        );
        certLight.target = frame;
        certLight.angle = Math.PI / 8;
        certLight.penumbra = 0.7;
        certLight.decay = 1.5;
        certLight.distance = 8;
        certLight.castShadow = false; // Avoid excessive shadow calculations
        scene.add(certLight);
        
        // Create certificate with enhanced design
        const color = colors[index % colors.length];
        
        // Certificate canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 384;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, `#${color.primary.toString(16).padStart(6, '0')}`);
          gradient.addColorStop(1, `#${color.secondary.toString(16).padStart(6, '0')}`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add decorative pattern
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(
              Math.random() * canvas.width, 
              Math.random() * canvas.height, 
              Math.random() * 30 + 10, 
              0, 
              Math.PI * 2
            );
            ctx.fill();
          }
          
          // Add border
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 8;
          ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
          
          // Add ornamental corners
          const cornerSize = 30;
          // Top left
          ctx.beginPath();
          ctx.moveTo(15, 15 + cornerSize);
          ctx.lineTo(15, 15);
          ctx.lineTo(15 + cornerSize, 15);
          ctx.lineWidth = 12;
          ctx.stroke();
          
          // Top right
          ctx.beginPath();
          ctx.moveTo(canvas.width - 15 - cornerSize, 15);
          ctx.lineTo(canvas.width - 15, 15);
          ctx.lineTo(canvas.width - 15, 15 + cornerSize);
          ctx.stroke();
          
          // Bottom left
          ctx.beginPath();
          ctx.moveTo(15, canvas.height - 15 - cornerSize);
          ctx.lineTo(15, canvas.height - 15);
          ctx.lineTo(15 + cornerSize, canvas.height - 15);
          ctx.stroke();
          
          // Bottom right
          ctx.beginPath();
          ctx.moveTo(canvas.width - 15 - cornerSize, canvas.height - 15);
          ctx.lineTo(canvas.width - 15, canvas.height - 15);
          ctx.lineTo(canvas.width - 15, canvas.height - 15 - cornerSize);
          ctx.stroke();
          
          // Add text with shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('CERTIFICATE', canvas.width / 2, 80);
          
          ctx.font = 'bold 24px Arial';
          ctx.fillText('of Achievement', canvas.width / 2, 120);
          
          // Turn off shadow for remaining text
          ctx.shadowColor = 'transparent';
          
          ctx.font = '18px Arial';
          ctx.fillText('This certifies that', canvas.width / 2, 170);
          
          ctx.font = 'bold 28px Arial';
          ctx.fillText('John Doe', canvas.width / 2, 210);
          
          ctx.font = '16px Arial';
          ctx.fillText('has successfully completed', canvas.width / 2, 240);
          
          ctx.font = 'bold 20px Arial';
          const courses = [
            'Blockchain Development',
            'Frontend Mastery',
            'Data Science',
            'UI/UX Design'
          ];
          ctx.fillText(courses[index % courses.length], canvas.width / 2, 270);
          
          // Add date
          ctx.font = '16px Arial';
          ctx.fillText('June 15, 2025', canvas.width / 2, 320);
          
          // Add signature line
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 100, 350);
          ctx.lineTo(canvas.width / 2 + 100, 350);
          ctx.stroke();
          
          // Add a seal/badge
          ctx.beginPath();
          ctx.arc(canvas.width - 70, canvas.height - 70, 40, 0, Math.PI * 2);
          ctx.fillStyle = 'gold';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.fillStyle = '#000';
          ctx.font = 'bold 12px Arial';
          ctx.fillText('VERIFIED', canvas.width - 70, canvas.height - 70);
          ctx.fillText('BLOCKCHAIN', canvas.width - 70, canvas.height - 55);
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create certificate material with texture and emission for better visibility
        const certificateGeometry = new THREE.PlaneGeometry(certificateWidth, certificateHeight);
        const certificateMaterial = new THREE.MeshStandardMaterial({ 
          map: texture,
          roughness: 0.2,
          metalness: 0.1,
          emissive: 0xffffff,
          emissiveIntensity: 0.15, // Making it emit light for better visibility
          emissiveMap: texture
        });
        
        const certificate = new THREE.Mesh(certificateGeometry, certificateMaterial);
        certificate.position.set(pos.x, pos.y, pos.z);
        certificate.rotation.set(pos.rotation[0], pos.rotation[1], pos.rotation[2]);
        
        // Adjust position based on wall
        if (pos.wall === 'back') {
          certificate.position.z += 0.05;
        } else if (pos.wall === 'left') {
          certificate.position.x += 0.05;
        }
        
        certificate.castShadow = true;
        certificate.receiveShadow = true;
        scene.add(certificate);
      });
    };

    // Add furniture - a simple display stand/desk
    const createFurniture = () => {
      // Desk
      const deskGeometry = new THREE.BoxGeometry(5, 0.2, 2);
      const deskMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5d4037, 
        roughness: 0.8, 
        metalness: 0.2 
      });
      const desk = new THREE.Mesh(deskGeometry, deskMaterial);
      desk.position.set(0, 1, 0);
      desk.castShadow = true;
      desk.receiveShadow = true;
      scene.add(desk);
      
      // Desk legs
      const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
      const legPositions = [
        { x: -2.3, z: -0.8 },
        { x: -2.3, z: 0.8 },
        { x: 2.3, z: -0.8 },
        { x: 2.3, z: 0.8 }
      ];
      
      legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, deskMaterial);
        leg.position.set(pos.x, 0.5, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        scene.add(leg);
      });
      
      // Add some decorative items on the desk
      
      // 3D Badge/Trophy
      const trophyBaseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.1, 32);
      const trophyBaseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.2, 
        metalness: 0.8 
      });
      const trophyBase = new THREE.Mesh(trophyBaseGeometry, trophyBaseMaterial);
      trophyBase.position.set(-1.5, 1.15, 0);
      trophyBase.castShadow = true;
      trophyBase.receiveShadow = true;
      scene.add(trophyBase);
      
      const trophyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
      const trophyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        roughness: 0.1, 
        metalness: 1.0,
        emissive: 0xffd700,
        emissiveIntensity: 0.3
      });
      const trophy = new THREE.Mesh(trophyGeometry, trophyMaterial);
      trophy.position.set(-1.5, 1.45, 0);
      trophy.castShadow = true;
      trophy.receiveShadow = true;
      scene.add(trophy);
      
      // Add a star on top
      const starGeometry = new THREE.OctahedronGeometry(0.2, 0);
      const starMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        roughness: 0.1, 
        metalness: 1.0,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(-1.5, 1.85, 0);
      star.rotation.y = Math.PI / 4;
      star.castShadow = true;
      scene.add(star);
      
      // Small display certificate on desk
      const standGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.1);
      const standMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x303030, 
        roughness: 0.7, 
        metalness: 0.2 
      });
      const stand = new THREE.Mesh(standGeometry, standMaterial);
      stand.position.set(0.5, 1.5, 0);
      stand.rotation.x = -Math.PI / 12; // Slight tilt
      stand.castShadow = true;
      stand.receiveShadow = true;
      scene.add(stand);
      
      // Certificate on stand
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#8BC34A');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE', canvas.width / 2, 50);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillText('John Doe', canvas.width / 2, 100);
        
        ctx.font = '14px Arial';
        ctx.fillText('Blockchain Master', canvas.width / 2, 130);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      
      const certificateGeometry = new THREE.PlaneGeometry(1.1, 0.7);
      const certificateMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveIntensity: 0.15,
        emissiveMap: texture
      });
      
      const certificate = new THREE.Mesh(certificateGeometry, certificateMaterial);
      certificate.position.set(0.5, 1.5, 0.051);
      certificate.rotation.x = -Math.PI / 12; // Same tilt as stand
      certificate.castShadow = true;
      scene.add(certificate);
      
      // Add a laptop
      const laptopBaseGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.6);
      const laptopScreenGeometry = new THREE.BoxGeometry(0.78, 0.5, 0.02);
      const laptopMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        roughness: 0.5, 
        metalness: 0.7 
      });
      
      const laptopBase = new THREE.Mesh(laptopBaseGeometry, laptopMaterial);
      laptopBase.position.set(1.8, 1.12, 0);
      laptopBase.castShadow = true;
      laptopBase.receiveShadow = true;
      scene.add(laptopBase);
      
      const laptopScreen = new THREE.Mesh(laptopScreenGeometry, laptopMaterial);
      laptopScreen.position.set(1.8, 1.4, -0.28);
      laptopScreen.rotation.x = -Math.PI / 4; // Tilt screen up
      laptopScreen.castShadow = true;
      laptopScreen.receiveShadow = true;
      scene.add(laptopScreen);
      
      // Laptop screen content (simplified)
      const screenContentGeometry = new THREE.PlaneGeometry(0.76, 0.48);
      const screenContentMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        side: THREE.FrontSide,

      });
      const screenContent = new THREE.Mesh(screenContentGeometry, screenContentMaterial);
      screenContent.position.set(0, 0, 0.011);
      laptopScreen.add(screenContent);
    };

    // Add floating badges
    const createFloatingBadges = () => {
      const badgePositions = [
        { x: 1, y: 2.5, z: 1.5 },
        { x: -1.5, y: 2.2, z: 0.5 },
        { x: 0.5, y: 2.8, z: -1 }
      ];
      
      const badgeColors = [
        0x1E88E5, // Blue
        0xE91E63, // Pink
        0xFFC107  // Amber
      ];
      
      badgePositions.forEach((pos, index) => {
        // Create badge
        const badgeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
        const badgeMaterial = new THREE.MeshStandardMaterial({ 
          color: badgeColors[index], 
          roughness: 0.3, 
          metalness: 0.8,
          emissive: badgeColors[index],
          emissiveIntensity: 0.4
        });
        const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
        badge.position.set(pos.x, pos.y, pos.z);
        badge.rotation.x = Math.PI / 2; // Make it horizontal
        badge.castShadow = true;
        scene.add(badge);
        
        // Add ring
        const ringGeometry = new THREE.TorusGeometry(0.4, 0.02, 16, 32);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xDDDDDD, 
          roughness: 0.1, 
          metalness: 0.9,
          emissive: 0xDDDDDD,
          emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(badge.position);
        ring.rotation.x = Math.PI / 2;
        ring.castShadow = true;
        scene.add(ring);
        
        // Add a spotlight specifically for the badge
        const badgeLight = new THREE.PointLight(badgeColors[index], 1, 3);
        badgeLight.position.set(pos.x, pos.y + 0.2, pos.z);
        scene.add(badgeLight);
        
        // Animation - rotation and floating
        const animate = () => {
          const time = Date.now() * 0.001;
          badge.rotation.z = time * 0.5;
          badge.position.y = pos.y + Math.sin(time) * 0.05;
          ring.position.copy(badge.position);
          ring.rotation.z = -time * 0.3;
          badgeLight.position.y = badge.position.y + 0.2;
          
          requestAnimationFrame(animate);
        };
        animate();
      });
    };

    // Initialize room elements
    createCertificates();
    createFurniture();
    createFloatingBadges();

    // Add glow to the floor edges for a more modern look
    const addFloorGlow = () => {
      const geometryLine = new THREE.BoxGeometry(roomSize - 0.1, 0.05, 0.05);
      const materialLine = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        emissive: 0x4CAF50,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      
      // Bottom edge
      const bottomLine = new THREE.Mesh(geometryLine, materialLine);
      bottomLine.position.set(0, 0.03, roomSize / 2 - 0.05);
      scene.add(bottomLine);
      
      // Top edge
      const topLine = new THREE.Mesh(geometryLine, materialLine);
      topLine.position.set(0, 0.03, -roomSize / 2 + 0.05);
      scene.add(topLine);
      
      // Left edge
      const leftLine = new THREE.Mesh(geometryLine, materialLine);
      leftLine.rotation.y = Math.PI / 2;
      leftLine.position.set(-roomSize / 2 + 0.05, 0.03, 0);
      scene.add(leftLine);
      
      // Right edge (not visible from isometric view but added for completeness)
      const rightLine = new THREE.Mesh(geometryLine, materialLine);
      rightLine.rotation.y = Math.PI / 2;
      rightLine.position.set(roomSize / 2 - 0.05, 0.03, 0);
      scene.add(rightLine);
    };
    
    addFloorGlow();

    // Add a subtle animation to the scene
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Gentle camera movement to give life to the scene
      const time = Date.now() * 0.0001;
      camera.position.x = 10 + Math.sin(time) * 0.2;
      camera.position.y = 10 + Math.cos(time) * 0.1;
      camera.position.z = 10 + Math.sin(time * 0.5) * 0.2;
      camera.lookAt(0, 0, 0);
      
      composer.render();
    };

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const aspectRatio = width / height;

      if (cameraRef.current) {
        cameraRef.current.left = -cameraSize * aspectRatio;
        cameraRef.current.right = cameraSize * aspectRatio;
        cameraRef.current.top = cameraSize;
        cameraRef.current.bottom = -cameraSize;
        cameraRef.current.updateProjectionMatrix();
      }

      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && container) { // Usar la referencia capturada
        container.removeChild(rendererRef.current.domElement);
      }
      
      if (sceneRef.current) {
        // Dispose scene
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  if (material.map) material.map.dispose();
                  material.dispose();
                });
              } else {
                if (object.material.map) object.material.map.dispose();
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ 
        position: 'relative',
        minHeight: '100%'
      }}
    >
      <div className="absolute bottom-4 left-4 bg-elementBackground/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-xs z-10">
        Gallery 3D personalizable
      </div>
    </div>
  );
};

export default Gallery3D;