/**
 * AI Logo Generation Service
 * Handles API calls to OpenAI DALL-E and Google Gemini for logo generation
 */

interface OpenAIImageResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

interface GeminiImageResponse {
  generatedImages: Array<{
    image: {
      imageBytes: string; // base64 encoded
    };
  }>;
}

/**
 * Generate a logo using OpenAI's DALL-E 3 API
 */
export async function generateLogoWithOpenAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  const enhancedPrompt = `Create a professional, clean logo design: ${prompt}. The logo should be simple, memorable, and suitable for business use. High quality, centered on white background, vector-style illustration.`;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenAIImageResponse = await response.json();
    
    if (!data.data || data.data.length === 0 || !data.data[0].url) {
      throw new Error('No image URL returned from OpenAI API');
    }

    return data.data[0].url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate logo with OpenAI');
  }
}

/**
 * Generate a logo using Google Gemini's Imagen API
 */
export async function generateLogoWithGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google AI API key not configured. Please add VITE_GOOGLE_AI_API_KEY to your environment variables.');
  }

  const enhancedPrompt = `Professional business logo design: ${prompt}. Clean, modern, minimalist style. Centered composition on white background. High quality vector illustration suitable for branding.`;

  try {
    // Using Imagen 3 via Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: enhancedPrompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_some',
            personGeneration: 'allow_adult',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `Google Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data: GeminiImageResponse = await response.json();
    
    if (!data.generatedImages || data.generatedImages.length === 0) {
      throw new Error('No image returned from Google Gemini API');
    }

    // Convert base64 to blob URL
    const base64Image = data.generatedImages[0].image.imageBytes;
    const imageBlob = base64ToBlob(base64Image, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);

    return imageUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate logo with Google Gemini');
  }
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Generate a logo using the specified AI provider
 */
export async function generateLogo(
  prompt: string,
  provider: 'openai' | 'google'
): Promise<string> {
  if (provider === 'openai') {
    return generateLogoWithOpenAI(prompt);
  } else {
    return generateLogoWithGemini(prompt);
  }
}
