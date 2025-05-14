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
    promo_url: 'https://about.meta.com/metaverse/',
    buried_at: '2023-10-15T00:00:00Z'
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
    buried_at: '2023-11-20T00:00:00Z'
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
    buried_at: '2023-09-05T00:00:00Z'
  },
  {
    id: '4',
    x: 3,
    y: 0,
    z: -4,
    twitter_handle: '@google_fan',
    username: 'Google Enthusiast',
    avatar_url: 'https://picsum.photos/id/1015/200',
    title: 'Google Stadia',
    description: 'Cloud gaming platform that promised the future but couldn\'t escape input lag. Game over.',
    promo_url: 'https://stadia.google.com',
    buried_at: '2023-01-18T00:00:00Z'
  },
  {
    id: '5',
    x: -2.5,
    y: 0,
    z: -6,
    twitter_handle: '@clubhouse_mod',
    username: 'Clubhouse Moderator',
    avatar_url: 'https://picsum.photos/id/1027/200',
    title: 'Clubhouse App',
    description: 'From $4B valuation to ghost town. Turns out people don\'t want to talk forever.',
    promo_url: 'https://www.clubhouse.com',
    buried_at: '2023-06-22T00:00:00Z'
  },
  {
    id: '6',
    x: 1.5,
    y: 0,
    z: -7,
    twitter_handle: '@quibi_fan',
    username: 'Quick Bites',
    avatar_url: 'https://picsum.photos/id/1035/200',
    title: 'Quibi',
    description: '$1.75B spent. 6 months lived. Nobody wanted to watch 10-min shows on their phones while commuting.',
    promo_url: 'https://en.wikipedia.org/wiki/Quibi',
    buried_at: '2020-12-01T00:00:00Z'
  },
  {
    id: '7',
    x: -3,
    y: 0,
    z: -2.5,
    twitter_handle: '@amazon_drone',
    username: 'Prime Air',
    avatar_url: 'https://picsum.photos/id/1047/200',
    title: 'Amazon Prime Air',
    description: 'Delivery drones that promised 30-min delivery. 10 years later, still waiting for takeoff.',
    promo_url: 'https://www.amazon.com/primeair',
    buried_at: '2023-08-30T00:00:00Z'
  },
  {
    id: '8',
    x: 4,
    y: 0,
    z: -6,
    twitter_handle: '@theranos_believer',
    username: 'Blood Believer',
    avatar_url: 'https://picsum.photos/id/1050/200',
    title: 'Theranos',
    description: 'Revolutionary blood testing from a single drop. Turned out to be a single drop of lies.',
    promo_url: 'https://en.wikipedia.org/wiki/Theranos',
    buried_at: '2022-09-15T00:00:00Z'
  }
];

const Index = () => {
  const [tombstones, setTombstones] = useState<TombstoneProps[]>(MOCK_TOMBSTONES);
  const [formPosition, setFormPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [selectedTombstone, setSelectedTombstone] = useState<TombstoneProps | null>(null);
  
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
  
  const handleFormSubmit = (data: TombstoneFormData & { x: number; y: number; z: number }) => {
    // In a real implementation, this would make an API call to
    // process payment and store the tombstone data in the database
    
    const newTombstone: TombstoneProps = {
      id: `temp-${Date.now()}`, // Would be replaced with actual ID from database
      ...data,
      buried_at: new Date().toISOString()
    };
    
    setTombstones([...tombstones, newTombstone]);
    toast.success("Grave planted successfully!", { 
      description: "Your tombstone has been created and is now visible in the graveyard."
    });
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden" onContextMenu={handleContextMenu}>
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
    </div>
  );
};

export default Index;
