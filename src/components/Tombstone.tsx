
import { useState, useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MeshStandardMaterial, Mesh } from 'three';
import { stoneTextureBase64 } from '../../public/textures/stone';

export type TombstoneProps = {
  id?: string;
  x: number;
  y: number;
  z: number;
  twitter_handle?: string;
  username?: string;
  avatar_url?: string;
  title?: string;
  description?: string;
  promo_url?: string;
  buried_at?: string;
  approved?: boolean;
  onClick?: () => void;
};

export const Tombstone = ({ x, y, z, onClick }: TombstoneProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [textureError, setTextureError] = useState(false);
  
  // Load stone texture with error handling
  const textureProps = useMemo(() => ({
    onLoad: () => setTextureLoaded(true),
    onError: () => setTextureError(true)
  }), []);
  
  let stoneTexture;
  try {
    if (!textureLoaded && !textureError) {
      stoneTexture = useTexture('/textures/stone.jpg', textureProps);
    }
  } catch (error) {
    console.warn('Failed to load stone texture:', error);
    setTextureError(true);
  }
  
  // Create a dynamic fallback texture using the base64 string if needed
  const fallbackTexture = useMemo(() => {
    if (textureError || !stoneTexture) {
      const img = new Image();
      img.src = stoneTextureBase64;
      const tex = useTexture({ map: img.src });
      return tex?.map || null;
    }
    return null;
  }, [textureError, stoneTexture]);
  
  const handlePointerOver = useCallback(() => {
    setHover(true);
  }, []);
  
  const handlePointerOut = useCallback(() => {
    setHover(false);
  }, []);
  
  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    if (onClick) onClick();
  }, [onClick]);
  
  // Hover animation
  useFrame(() => {
    if (!meshRef.current) return;
    
    if (hovered) {
      // Subtle float effect on hover
      meshRef.current.position.y = y + 0.05 + Math.sin(Date.now() * 0.002) * 0.02;
      
      // Subtle glow effect - adjusting emissive intensity
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.1 + Math.sin(Date.now() * 0.003) * 0.05;
    } else {
      meshRef.current.position.y = y;
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0;
    }
  });
  
  return (
    <group position={[x, y, z]}>
      {/* Main tombstone */}
      <mesh 
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Simple tombstone shape - rounded top */}
        <boxGeometry args={[0.6, 1.0, 0.1]} />
        <meshStandardMaterial
          map={textureError ? fallbackTexture : stoneTexture}
          roughness={0.8}
          metalness={0.1}
          color={hovered ? "#D6BCFA" : "#8A898C"}
          emissive="#6b21a8"
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Base of the tombstone */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.3]} />
        <meshStandardMaterial
          map={textureError ? fallbackTexture : stoneTexture}
          color="#555555"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};
