
import { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useTexture } from '@react-three/drei';
import { Vector3, RepeatWrapping, Raycaster, Vector2, Mesh, Fog, MeshStandardMaterial, Color } from 'three';
import { Tombstone, TombstoneProps } from './Tombstone';
import { useIsMobile } from '../hooks/use-mobile';

type SceneProps = {
  tombstones: TombstoneProps[];
  onRightClick: (position: { x: number; y: number; z: number }) => void;
  onTombstoneClick: (tombstone: TombstoneProps) => void;
};

export const Scene = ({ tombstones = [], onRightClick, onTombstoneClick }: SceneProps) => {
  const handleCanvasRightClick = useCallback(
    (event) => {
      // Prevent default right-click menu
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  return (
    <div className="canvas-container" onContextMenu={handleCanvasRightClick}>
      <Canvas shadows dpr={[1, 2]}>
        <fog attach="fog" args={['#242730', 10, 40]} />
        <Environment preset="night" />
        <SceneContent 
          tombstones={tombstones} 
          onRightClick={onRightClick} 
          onTombstoneClick={onTombstoneClick}
        />
      </Canvas>
    </div>
  );
};

const SceneContent = ({ tombstones, onRightClick, onTombstoneClick }: SceneProps) => {
  const { camera, gl, scene } = useThree();
  const groundRef = useRef<Mesh>(null);
  const isMobile = useIsMobile();
  
  // Safe texture loading with proper dependency management
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [textureError, setTextureError] = useState(false);
  
  // Create raycaster and mouse outside of render to avoid rerenders
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useMemo(() => new Vector2(), []);
  
  // Safe texture loading with proper error handling
  let grassTexture = null;
  try {
    grassTexture = useTexture('/textures/grass.jpg');
    if (grassTexture && !textureLoaded) {
      grassTexture.repeat.set(20, 20);
      grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
      setTextureLoaded(true);
    }
  } catch (error) {
    if (!textureError) {
      console.warn('Failed to load grass texture:', error);
      setTextureError(true);
    }
  }
  
  // Create a fallback material if texture fails to load
  const fallbackMaterial = useMemo(() => {
    return new MeshStandardMaterial({
      color: "#1f2025",
      roughness: 0.9,
      metalness: 0.1
    });
  }, []);
  
  // Fog animation effect
  useFrame(() => {
    if (!scene) return;
    
    const time = Date.now() * 0.0005;
    const fogColor = new Vector3(0.14, 0.15, 0.18);
    const haze = Math.sin(time) * 0.01 + 0.1;
    fogColor.addScalar(haze);
    
    if (scene.fog) {
      (scene.fog as Fog).color.set(
        `rgb(${Math.floor(fogColor.x * 255)},${Math.floor(fogColor.y * 255)},${Math.floor(fogColor.z * 255)})`
      );
    }
  });

  // Handle right-click to place tombstone
  const handlePlaceTombstone = useCallback((event: any) => {
    // Only process right-click (button 2)
    if (event.button !== 2) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the picking ray
    if (groundRef.current) {
      const intersects = raycaster.intersectObject(groundRef.current, false);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        onRightClick({ 
          x: Math.round(point.x * 100) / 100, 
          y: Math.round(point.y * 100) / 100, 
          z: Math.round(point.z * 100) / 100 
        });
      }
    }
  }, [camera, gl, mouse, onRightClick, raycaster]);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.5}
        minDistance={3} 
        maxDistance={20}
      />
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Directional "moonlight" */}
      <directionalLight 
        position={[-5, 8, -10]} 
        color="#a0a8ff" 
        intensity={0.3} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Ground plane */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]} 
        receiveShadow 
        onPointerDown={handlePlaceTombstone}
      >
        <planeGeometry args={[100, 100]} />
        {grassTexture ? (
          <meshStandardMaterial 
            map={grassTexture}
            roughness={0.9}
            metalness={0.1}
            color="#1f2025"
          />
        ) : (
          <meshStandardMaterial 
            color="#1f2025"
            roughness={0.9}
            metalness={0.1}
          />
        )}
      </mesh>
      
      {/* Render all tombstones */}
      {tombstones.map((tombstone, index) => (
        <Tombstone
          key={tombstone.id || index}
          {...tombstone}
          onClick={() => onTombstoneClick(tombstone)}
        />
      ))}
    </>
  );
};
