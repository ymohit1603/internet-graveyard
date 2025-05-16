import { env } from '@/env';

interface TwitterProfile {
  username: string;
  name: string;
  avatar_url: string;
  description: string;
}

// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://d098-2402-3a80-4787-49a1-1530-8a1a-b28b-f703.ngrok-free.app/api';

export async function getTwitterProfile(username: string): Promise<TwitterProfile> {
  console.log(username,"username");
  const url = `${API_URL}/social/profile/${username}`;
  console.log('[getTwitterProfile] Fetching from:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log(response,"response.json");
    console.log(response.body,"data");

    console.log('[getTwitterProfile] Raw response:', response);

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      const text = await response.text();
      console.error('[getTwitterProfile] ❌ HTTP error:', response.status, text);
      throw new Error(`HTTP error ${response.status}`);
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[getTwitterProfile] ❌ Invalid content-type:', contentType);
      console.error('[getTwitterProfile] ❌ Response was:', text);
      throw new Error('Expected JSON response, but got HTML or plain text');
    }

    const data = await response.json();
    console.log('[getTwitterProfile] ✅ JSON data:', data);

    return data as TwitterProfile;
  } catch (error) {
    console.error('[getTwitterProfile] ❌ Exception occurred:', error);
    throw error;
  }
}
