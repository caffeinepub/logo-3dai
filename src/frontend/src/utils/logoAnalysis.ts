/**
 * Logo analysis utility that extracts characteristics from uploaded logo images
 */

export interface LogoAnalysis {
  width: number;
  height: number;
  aspectRatio: number;
  dominantColors: string[];
  complexity: number; // 0-1 scale
  brightness: number; // 0-1 scale
  colorfulness: number; // 0-1 scale
}

/**
 * Analyzes a logo image and returns its characteristics
 */
export async function analyzeLogoImage(imageUrl: string): Promise<LogoAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Analyze colors
      const colorMap = new Map<string, number>();
      let totalBrightness = 0;
      let totalSaturation = 0;
      let edgeCount = 0;
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Calculate brightness
        const brightness = (r + g + b) / (3 * 255);
        totalBrightness += brightness;
        
        // Calculate saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        totalSaturation += saturation;
        
        // Quantize color for dominant color detection
        const quantizedColor = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
        colorMap.set(quantizedColor, (colorMap.get(quantizedColor) || 0) + 1);
        
        // Simple edge detection (check if next pixel is significantly different)
        if (i + 4 < pixels.length) {
          const nextR = pixels[i + 4];
          const nextG = pixels[i + 5];
          const nextB = pixels[i + 6];
          const diff = Math.abs(r - nextR) + Math.abs(g - nextG) + Math.abs(b - nextB);
          if (diff > 100) edgeCount++;
        }
      }
      
      const opaquePixels = pixels.length / 4;
      const avgBrightness = totalBrightness / opaquePixels;
      const avgSaturation = totalSaturation / opaquePixels;
      
      // Get top 3 dominant colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        });
      
      // Calculate complexity based on edge density
      const complexity = Math.min(1, edgeCount / (opaquePixels * 0.3));
      
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        dominantColors: sortedColors,
        complexity,
        brightness: avgBrightness,
        colorfulness: avgSaturation,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}
