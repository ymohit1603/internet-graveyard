import { useRef, useCallback } from 'react';
import { Mesh, DoubleSide, Vector2 } from 'three';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Billboard, useTexture } from '@react-three/drei';
import type { Tombstone } from '@/lib/supabase';

interface TombstoneMeshProps extends Partial<Tombstone> {
  onClick?: () => void;
}

export function TombstoneMesh({ 
  x = 0, 
  y = 0, 
  z = 0, 
  title,
  username,
  avatar_url,
  onClick 
}: TombstoneMeshProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Load marble texture for tombstone
  const marbleTexture = useTexture('/textures/tombstone/lambert1_baseColor.jpeg');
  const normalMap = useTexture('/textures/tombstone/lambert1_normal.png');
  const roughnessMap = useTexture('/textures/tombstone/lambert1_metallicRoughness.png');

  // Load avatar texture for profile picture
  const avatarTexture = avatar_url ? useTexture(avatar_url) : null;

  // Hover animation
  const animate = useCallback((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = y + Math.sin(time * 0.5) * 0.05;
  }, [y]);

  useFrame(animate);

  return (
    <group position={[x, y, z]} onClick={onClick}>
      {/* Profile Picture and Username */}
      <Billboard
        follow={true}
        position={[0, 2.7, 0]}
      >
        {/* White Background Panel */}
        <mesh position={[0.45, 0, -0.03]}>
          <planeGeometry args={[2.6, 1.1]} />
          <meshBasicMaterial color="#ffffff" opacity={1} transparent={false} />
        </mesh>

        {/* Profile Picture Circle */}
        <group position={[-0.7, 0, 0]}>
          {/* Profile Picture */}
          <mesh>
            <circleGeometry args={[0.32, 32]} />
            <meshBasicMaterial 
              map={avatarTexture}
              color={avatarTexture ? "#ffffff" : "#cccccc"}
              transparent
              side={DoubleSide}
            />
          </mesh>
          {/* Border Ring */}
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.32, 0.36, 32]} />
            <meshBasicMaterial color="#e0e0e0" />
          </mesh>
        </group>
        {/* Username */}
        {username && (
          <Text
            position={[0.7, 0, 0]}
            fontSize={0.32}
            color="#000000"
            textAlign="left"
            maxWidth={2.0}
          >
            {username}
          </Text>
        )}
      </Billboard>

      {/* Custom 3D Tombstone */}
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Grassy Platform */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.15, 32]} />
          <meshStandardMaterial color="#6b8e23" roughness={1} metalness={0.1} />
        </mesh>
        {/* Fallen Leaves (simple planes, can be improved with textures) */}
        <mesh position={[-0.7, -0.07, 0.5]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.18, 0.09]} />
          <meshStandardMaterial color="#b8860b" />
        </mesh>
        <mesh position={[0.6, -0.07, -0.4]} rotation={[0, -0.3, 0]}>
          <planeGeometry args={[0.14, 0.07]} />
          <meshStandardMaterial color="#deb887" />
        </mesh>
        {/* Tombstone Body: classical arched shape (extruded for 3D) */}
        <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
          <extrudeGeometry args={[
            (() => {
              const shape = new THREE.Shape();
              shape.moveTo(-0.6, 0);
              shape.lineTo(-0.6, 1.0);
              shape.absarc(0, 1.0, 0.6, Math.PI, 0, false);
              shape.lineTo(0.6, 0);
              shape.lineTo(-0.6, 0);
              return shape;
            })(),
            { depth: 0.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.06, bevelSegments: 4 }
          ]} />
          <meshStandardMaterial 
            map={marbleTexture}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            color="#eaeaea"
            metalness={0.2}
            roughness={0.5}
            transparent={false}
          />
        </mesh>
        {/* Floral Engravings (extruded for 3D effect) */}
        <mesh position={[0, 0.71, 0.1]}>
          <extrudeGeometry args={[
            (() => {
              const shape = new THREE.Shape();
              shape.moveTo(-0.3, 0.5);
              shape.quadraticCurveTo(-0.15, 0.7, 0, 0.5);
              shape.quadraticCurveTo(0.15, 0.3, 0.3, 0.5);
              return shape;
            })(),
            { depth: 0.02, bevelEnabled: false }
          ]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.1} roughness={0.7} />
        </mesh>
        {/* Glowing Epitaph */}
        {title && (
          <Text
            position={[0, 1.0, 0.03]}
            fontSize={0.18}
            color="#fff8dc"
            outlineColor="#fff8dc"
            outlineWidth={0.01}
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
            material-emissive="#fff8dc"
            material-emissiveIntensity={0.7}
          >
            {title}
          </Text>
        )}
      </group>
    </group>
  );
} 