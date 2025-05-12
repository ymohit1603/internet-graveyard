
import { Suspense } from 'react';
import { Scene } from './Scene';
import { TombstoneProps } from './Tombstone';

type SceneLoaderProps = {
  tombstones: TombstoneProps[];
  onRightClick: (position: { x: number; y: number; z: number }) => void;
  onTombstoneClick: (tombstone: TombstoneProps) => void;
};

// This component provides a fallback loading state while Scene loads
export const SceneLoader = (props: SceneLoaderProps) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Scene {...props} />
    </Suspense>
  );
};

const LoadingScreen = () => (
  <div className="canvas-container flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="mb-4 text-purple-400 text-xl">Loading Graveyard...</div>
      <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-purple-500 animate-pulse rounded-full"></div>
      </div>
    </div>
  </div>
);
