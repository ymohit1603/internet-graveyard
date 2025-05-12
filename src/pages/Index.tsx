
import { useState } from 'react';
import { SceneLoader } from '../components/SceneLoader';
import { TombstoneForm, TombstoneFormData } from '../components/TombstoneForm';
import { TombstoneDetails } from '../components/TombstoneDetails';
import { TombstoneProps } from '../components/Tombstone';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const MOCK_TOMBSTONES: TombstoneProps[] = [
  {
    id: '1',
    x: 2,
    y: 0,
    z: -2,
    twitter_handle: '@metaverse_fan',
    username: 'Metaverse Fan',
    avatar_url: 'https://picsum.photos/id/1012/200',
    title: 'Facebook Metaverse',
    description: 'Billions invested, avatars with no legs. We never asked for this digital ghost town.',
    promo_url: 'https://example.com',
    buried_at: '2023-10-15T00:00:00Z',
    approved: true
  },
  {
    id: '2',
    x: -1.5,
    y: 0,
    z: -3,
    twitter_handle: '@web3_dev',
    username: 'Web3 Developer',
    avatar_url: 'https://picsum.photos/id/1025/200',
    title: 'NFT Marketplace #248',
    description: 'Another NFT marketplace that nobody needed. Died trying to find product-market fit.',
    buried_at: '2023-11-20T00:00:00Z',
    approved: true
  },
  {
    id: '3',
    x: 0.5,
    y: 0,
    z: -5,
    twitter_handle: '@crypto_maxi',
    username: 'Crypto Maximalist',
    avatar_url: 'https://picsum.photos/id/1066/200',
    title: 'DogeMegaFlokiMars Coin',
    description: 'To the moon? More like straight to the ground. Another memecoin bites the dust.',
    promo_url: 'https://twitter.com',
    buried_at: '2023-09-05T00:00:00Z',
    approved: true
  }
];

const Index = () => {
  const [tombstones, setTombstones] = useState<TombstoneProps[]>(MOCK_TOMBSTONES);
  const [formPosition, setFormPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [selectedTombstone, setSelectedTombstone] = useState<TombstoneProps | null>(null);
  
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
  
  const handleFormSubmit = (data: TombstoneFormData & { x: number; y: number; z: number }) => {
    // In a real implementation, this would make an API call to
    // process payment and store the tombstone data in the database
    
    const newTombstone: TombstoneProps = {
      id: `temp-${Date.now()}`, // Would be replaced with actual ID from database
      ...data,
      buried_at: new Date().toISOString(),
      approved: false // Would be initially false until approved
    };
    
    setTombstones([...tombstones, newTombstone]);
    toast.success("Grave planted successfully!", { 
      description: "Your tombstone will appear after review"
    });
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SceneLoader
        tombstones={tombstones}
        onRightClick={handleRightClick}
        onTombstoneClick={handleTombstoneClick}
      />
      
      <div className="ui-container">
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-white">
            Internet Graveyard <span className="text-purple-400">3D</span>
          </h1>
          
          <div className="text-sm text-gray-400">
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
    </div>
  );
};

export default Index;
