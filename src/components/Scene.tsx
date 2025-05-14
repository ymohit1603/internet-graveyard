import { useState, useRef, useMemo, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useTexture, Sky, Stars, useGLTF, Text, Billboard } from '@react-three/drei';
import { Vector3, RepeatWrapping, Raycaster, Vector2, Mesh, Fog, MeshStandardMaterial, Color, DoubleSide, InstancedMesh, Object3D, Shape, ShapeGeometry, InstancedBufferAttribute, PlaneGeometry, BufferGeometry, Float32BufferAttribute, Box3 } from 'three';
import * as THREE from 'three';
import type { TombstoneProps } from './Tombstone';
import { useIsMobile } from '../hooks/use-mobile';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { isPositionAvailable } from '@/lib/supabase';

// Preload the model
useGLTF.preload('/tombstone-old-cemetery-freiburg/source/shareModel1363733899550499227/model.glb');

// GLB Model component
function TombstoneGLB({ x = 0, y = 0, z = 0, onClick, tombstone }) {
  const [modelError, setModelError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const profileGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Load the model textures
  const textures = useTexture({
    diffuse: '/tombstone-old-cemetery-freiburg/source/shareModel1363733899550499227/tex_u0_v0_diffuse.jpg',
    normal: '/tombstone-old-cemetery-freiburg/source/shareModel1363733899550499227/tex_u0_v0_normal.jpg'
  });

  // Create a unique instance of the model for each tombstone
  const { scene: originalScene } = useGLTF('/tombstone-old-cemetery-freiburg/source/shareModel1363733899550499227/model.glb');
  const scene = useMemo(() => originalScene.clone(true), [originalScene]);

  // Load profile image texture
  const profileTexture = useTexture(tombstone.avatar_url);

  // Make profile card face camera
  useFrame((state) => {
    if (profileGroupRef.current) {
      // Make the content face the camera
      const cardPosition = new THREE.Vector3();
      profileGroupRef.current.getWorldPosition(cardPosition);
      
      // Calculate direction to camera
      const direction = new THREE.Vector3();
      camera.getWorldPosition(direction);
      direction.sub(cardPosition);
      
      // Update the quaternion to face camera
      const quaternion = new THREE.Quaternion();
      const matrix = new THREE.Matrix4();
      
      // Create rotation matrix that looks at camera
      matrix.lookAt(direction, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      quaternion.setFromRotationMatrix(matrix);
      
      // Apply the rotation to the profile group
      profileGroupRef.current.quaternion.copy(quaternion);
    }
  });

  return (
    <group position={[x, y, z]} onClick={onClick}>
      {/* The actual tombstone model */}
      <primitive 
        object={scene} 
        position={[0, 5.3, 0]}
        scale={[1.5, 1.5, 1.5]}
        rotation={[0, Math.PI, 0]}
        visible={true}
      />

      {/* Profile card */}
      <group ref={profileGroupRef} position={[0.4, 2.5, 0.9]}>
        {/* Solid white background with no transparency */}
        <mesh>
          <planeGeometry args={[1.4, 0.7]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent={false}
            opacity={1}
            side={DoubleSide}
          />
        </mesh>

        {/* Profile picture circle with actual Twitter avatar */}
        <mesh position={[-0.5, 0, 0.01]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial 
            map={profileTexture}
            metalness={0.0}
            roughness={1.0}
            transparent={false}
          />
        </mesh>

        {/* Profile picture border */}
        <mesh position={[-0.5, 0, 0.02]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.19, 0.21, 32]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* Text elements */}
        <group position={[0, 0, 0.02]}>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.12}
            color="black"
            anchorX="left"
            anchorY="middle"
            maxWidth={1}
            letterSpacing={-0.05}
            font={undefined}
            fontWeight="600"
          >
            {tombstone.title || tombstone.name}
          </Text>
          
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.09}
            color="#666666"
            anchorX="left"
            anchorY="middle"
            maxWidth={1}
            letterSpacing={-0.05}
            font={undefined}
            fontWeight="500"
          >
            @{tombstone.twitter_handle}
          </Text>
        </group>
      </group>
    </group>
  );
}

type SceneProps = {
  tombstones: TombstoneProps[];
  onRightClick: (position: { x: number; y: number; z: number }) => void;
  onTombstoneClick: (tombstone: TombstoneProps) => void;
};

export const Scene = ({ tombstones = [], onRightClick, onTombstoneClick }: SceneProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const handleCanvasRightClick = useCallback(
    (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  return (
    <>
      {/* Instructions Panel */}
      <div 
        className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-sm"
      >
        <h1 className="text-2xl font-serif mb-2 text-black">
          Internet Graveyard <span className="text-purple-600">3D</span>
        </h1>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>🖱️ Hold Ctrl + Right click + drag to rotate view</li>
          <li>🖱️ Right-click anywhere to plant a grave</li>
          <li>✌️ Two finger pinch/spread to zoom in/out</li>
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          {tombstones.length} projects laid to rest
        </p>
      </div>

      <div className="canvas-container" onContextMenu={handleCanvasRightClick}>
        <Canvas shadows dpr={[1, 2]}>
          <Environment preset="dawn" />
          <color attach="background" args={['#87CEEB']} />
          <Sky 
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0.6}
            azimuth={0.1}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={0.5}
            turbidity={10}
          />
          <SceneContent 
            tombstones={tombstones} 
            onRightClick={onRightClick} 
            onTombstoneClick={onTombstoneClick}
            isDarkMode={false}
          />
        </Canvas>
      </div>
    </>
  );
};

// Realistic Grass Field Component
function GrassField({ onPointerDown, groundRef }) {
  const fieldSize = 80;
  const bladeCount = 20000; // Increased for better coverage
  const bladeSegments = 4; // For curved blades
  const dummy = useMemo(() => new Object3D(), []);
  
  // Ground geometry with more subtle undulations
  const groundGeom = useMemo(() => {
    const geom = new PlaneGeometry(fieldSize, fieldSize, 32, 32);
    for (let i = 0; i < geom.attributes.position.count; i++) {
      const x = geom.attributes.position.getX(i);
      const y = geom.attributes.position.getY(i);
      // More natural undulation pattern
      const undulation = 
        Math.sin(x * 0.3 + Math.cos(y * 0.2)) * 0.2 +
        Math.cos(y * 0.25 + Math.sin(x * 0.15)) * 0.2 +
        (Math.random() * 0.1);
      geom.attributes.position.setZ(i, undulation);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Improved grass blade geometry with natural curve
  const bladeGeom = useMemo(() => {
    const points = [];
    const width = 0.12;
    const height = 0.8;
    
    // Create a curved blade shape
    for (let i = 0; i <= bladeSegments; i++) {
      const t = i / bladeSegments;
      const x = width * 0.5 * Math.sin(t * Math.PI) * (1 - t); // Tapers at top
      const y = height * t;
      const z = 0.2 * Math.sin(t * Math.PI); // Natural curve
      points.push(new Vector3(-x, y, z), new Vector3(x, y, z));
    }

    const geometry = new BufferGeometry();
    const vertices = [];
    const indices = [];

    // Create faces between points
    for (let i = 0; i < bladeSegments; i++) {
      const base = i * 2;
      vertices.push(...points[base].toArray(), ...points[base + 1].toArray());
      vertices.push(...points[base + 2].toArray(), ...points[base + 3].toArray());
      
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Natural grass colors
  const colors = useMemo(() => {
    const baseColors = [
      new Color('#2d5a27'), // Deep forest green
      new Color('#3f7d30'), // Natural grass green
      new Color('#528c35'), // Medium grass green
      new Color('#345e2e'), // Shadowed green
      new Color('#4b6d34'), // Olive grass green
    ];
    const arr = new Float32Array(bladeCount * 3);
    
    for (let i = 0; i < bladeCount; i++) {
      const color = baseColors[Math.floor(Math.random() * baseColors.length)].clone();
      // Add slight random variation to each color
      color.multiplyScalar(0.9 + Math.random() * 0.2); // Subtler variation
      const idx = i * 3;
      arr[idx] = color.r;
      arr[idx + 1] = color.g;
      arr[idx + 2] = color.b;
    }
    return arr;
  }, [bladeCount]);

  // Optimized grass blade placement
  const setInstancedMesh = useCallback((mesh) => {
    if (!mesh) return;

    // Create a grid-based distribution with randomness
    const gridSize = Math.sqrt(bladeCount);
    const cellSize = fieldSize / gridSize;

    for (let i = 0; i < bladeCount; i++) {
      // Grid position with random offset
      const gridX = (i % gridSize) * cellSize - fieldSize / 2;
      const gridZ = Math.floor(i / gridSize) * cellSize - fieldSize / 2;
      
      const x = gridX + (Math.random() - 0.5) * cellSize;
      const z = gridZ + (Math.random() - 0.5) * cellSize;
      
      // Sample ground height at this position
      const groundHeight = 
        Math.sin(x * 0.3 + Math.cos(z * 0.2)) * 0.2 +
        Math.cos(z * 0.25 + Math.sin(x * 0.15)) * 0.2;

      dummy.position.set(x, groundHeight, z);
      
      // Natural variation in rotation and scale
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.1;
      
      const scale = 0.8 + Math.random() * 0.4;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute('color', new InstancedBufferAttribute(colors, 3));
  }, [bladeCount, colors, dummy, fieldSize]);

  return (
    <group ref={groundRef}>
      {/* Rich soil ground */}
    <mesh 
        geometry={groundGeom} 
      rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
      receiveShadow 
      onPointerDown={onPointerDown}
    >
        <meshStandardMaterial 
          color="#1B5E20"
          roughness={1}
          metalness={0.1}
        />
      </mesh>

      {/* Grass blades */}
      <instancedMesh
        args={[bladeGeom, undefined, bladeCount]}
        ref={setInstancedMesh}
        castShadow
        receiveShadow
      >
      <meshStandardMaterial 
          vertexColors
          side={DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
      </instancedMesh>
    </group>
  );
}

const SceneContent = ({ tombstones, onRightClick, onTombstoneClick, isDarkMode }: SceneProps & { isDarkMode: boolean }) => {
  const { camera, gl, scene } = useThree();
  const groundRef = useRef<Mesh>(null);
  const isMobile = useIsMobile();
  const [isPlacing, setIsPlacing] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('Tombstones in SceneContent:', tombstones);
  }, [tombstones]);
  
  // Create raycaster and mouse outside of render to avoid rerenders
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useMemo(() => new Vector2(), []);
  
  // Debounced position check
  const checkAndNotifyPosition = useMemo(
    () =>
      debounce(async (x: number, z: number) => {
        try {
          const available = await isPositionAvailable(x, z);
          if (!available) {
            toast.error('This spot is taken! Please choose another location.');
            return false;
          }
          return true;
        } catch (error) {
          console.error('Error checking position:', error);
          toast.error('Could not validate position. Please try again.');
          return false;
        }
      }, 300),
    []
  );
  
  // Handle right-click to place tombstone
  const handlePlaceTombstone = useCallback(async (event: ThreeEvent<PointerEvent>) => {
    // Check if it's a right click
    if (event.button !== 2) return;
    
    // Prevent multiple concurrent placements
    if (isPlacing) return;
    
    try {
      setIsPlacing(true);
      
      // Calculate mouse position
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
    raycaster.setFromCamera(mouse, camera);
    
    if (groundRef.current) {
        const intersects = raycaster.intersectObject(groundRef.current, true);
      if (intersects.length > 0) {
        const point = intersects[0].point;
          const x = Math.round(point.x * 100) / 100;
          const z = Math.round(point.z * 100) / 100;
          
          // Check if position is available
          const isAvailable = await checkAndNotifyPosition(x, z);
          if (!isAvailable) return;
          
        onRightClick({ 
            x,
            y: 0, // Keep y at 0 for ground level
            z
          });
        }
      }
    } finally {
      setIsPlacing(false);
    }
  }, [camera, gl, mouse, onRightClick, raycaster, isPlacing, checkAndNotifyPosition]);
  
  // Prevent context menu on the canvas
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    
    gl.domElement.addEventListener('contextmenu', handleContextMenu);
    return () => {
      gl.domElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl]);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 15]} far={20000} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.8}
        panSpeed={1.0}
        zoomSpeed={1.0}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={100}
        autoRotate={false}
        mouseButtons={{
          LEFT: 0,      // Nothing
          MIDDLE: 0,    // Nothing
          RIGHT: 2      // Pan (will work with Ctrl key)
        }}
        touches={{
          ONE: 1,       // Rotate with one finger
          TWO: 2        // Zoom with two fingers
        }}
      />
      
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[50, 50, 25]}
        intensity={1.0}
        castShadow
      />
      <hemisphereLight 
        color='#ffffff'
        groundColor='#e6edf7'
        intensity={1.0} 
      />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={1.2}
        color="#b8c6db"
      />
      
      {/* Moon light for dark mode */}
      {isDarkMode && (
        <pointLight
          position={[50, 50, -50]}
          color="#b4c9ff"
          intensity={2}
          distance={1000}
          decay={2}
        />
      )}
      
      {/* Ground with grass field loading in Suspense boundary */}
      <Suspense fallback={null}>
        <GrassField 
          onPointerDown={handlePlaceTombstone}
          groundRef={groundRef}
        />
      </Suspense>
      
      {/* Render all tombstones using GLB model */}
      <Suspense fallback={null}>
        {tombstones.map((tombstone, index) => (
          <TombstoneGLB
            key={tombstone.id || index}
            x={tombstone.x}
            y={tombstone.y}
            z={tombstone.z}
            onClick={() => onTombstoneClick(tombstone)}
            tombstone={tombstone}
          />
        ))}
      </Suspense>
    </>
  );
};
