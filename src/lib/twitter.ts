import { env } from '@/env';

interface TwitterProfile {
  username: string;
  name: string;
  avatar_url: string;
  description: string;
}

const API_URL = 'http://localhost:3000/api';

export async function getTwitterProfile(username: string): Promise<TwitterProfile> {
  try {
    const response = await fetch(`${API_URL}/twitter/profile/${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const data = await response.json();
    console.log('Twitter profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    throw error;
  }
}
