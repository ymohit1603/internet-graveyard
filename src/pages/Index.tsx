import { useState, useEffect } from 'react';
import { SceneLoader } from '../components/SceneLoader';
import { TombstoneForm, TombstoneFormData } from '../components/TombstoneForm';
import { TombstoneDetails } from '../components/TombstoneDetails';
import { TombstoneProps } from '../components/Tombstone';
import { toast } from 'sonner';
import { getTombstones } from '@/lib/supabase';

const Index = () => {
  const [tombstones, setTombstones] = useState<TombstoneProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formPosition, setFormPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [selectedTombstone, setSelectedTombstone] = useState<TombstoneProps | null>(null);
  
  useEffect(() => {
    const fetchTombstones = async () => {
      try {
        const data = await getTombstones();
        setTombstones(data);
      } catch (error) {
        console.error('Error fetching tombstones:', error);
        toast.error('Failed to load tombstones', {
          description: 'Please refresh the page to try again'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTombstones();
  }, []);

  const refreshTombstones = async () => {
    try {
      const data = await getTombstones();
      setTombstones(data);
    } catch (error) {
      console.error('Error refreshing tombstones:', error);
      toast.error('Failed to refresh tombstones', {
        description: 'Some tombstones might not be visible'
      });
    }
  };
  
  // Prevent default context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleRightClick = (position: { x: number; y: number; z: number }) => {
    setFormPosition(position);
  };
  
  const handleFormClose = () => {
    setFormPosition(null);
  };
  
  const handleTombstoneClick = (tombstone: TombstoneProps) => {
    setSelectedTombstone(tombstone);
  };
  
  const handleDetailsClose = () => {
    setSelectedTombstone(null);
  };
  
  const handleFormSubmit = async (data: TombstoneFormData & { x: number; y: number; z: number }) => {
    // After the tombstone is created in TombstoneForm component,
    // refresh the list to get the latest data
    await refreshTombstones();
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden" onContextMenu={handleContextMenu}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="space-y-4 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto"></div>
            <p className="text-gray-600">Loading the graveyard...</p>
          </div>
        </div>
      ) : (
        <>
      <SceneLoader
        tombstones={tombstones}
        onRightClick={handleRightClick}
        onTombstoneClick={handleTombstoneClick}
      />
      
      <div className="ui-container">
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-end items-center">
          <div className="text-sm text-black">
            <p>Right-click anywhere to plant a grave</p>
          </div>
        </header>
        
        {formPosition && (
          <TombstoneForm
            position={formPosition}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
        
        {selectedTombstone && (
          <TombstoneDetails
            tombstone={selectedTombstone}
            onClose={handleDetailsClose}
          />
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default Index;
