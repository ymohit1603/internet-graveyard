import { env } from '@/env';



// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://twitter-api-worker.mohityadav0330.workers.dev';

export async function getTwitterProfile(username: string){
  console.log(API_URL,"API_URL");
  console.log(username,"username");
  const url = `${API_URL}/api/social/profile/${username}`;
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

    return data ;
  } catch (error) {
    console.error('[getTwitterProfile] ❌ Exception occurred:', error);
    throw error;
  }
}
