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
      const errorText = await response.text();
      console.error(`Twitter API error: ${response.status} - ${errorText}`);
      return null;
    }

    const json = await response.json();

    const user = json.data;

    if (!user) {
      console.warn('No user data returned from Twitter API');
      return null;
    }

    return {
      username: user.username,
      name: user.name,
      profileImageUrl: user.profile_image_url?.replace('_normal', '') || '', // fallback if undefined
    };
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    return null;
  }
}
