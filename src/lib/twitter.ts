import { env } from '@/env';

export interface TwitterProfile {
  username: string;
  name: string;
  profileImageUrl: string;
}

export async function getTwitterProfile(username: string): Promise<TwitterProfile | null> {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const data = await response.json();
    
    if (!data.data) {
      return null;
    }

    return {
      username: data.data.username,
      name: data.data.name,
      profileImageUrl: data.data.profile_image_url.replace('_normal', ''), // Get full-size image
    };
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    return null;
  }
} 