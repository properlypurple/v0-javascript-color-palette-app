/**
 * Extract colors from an image using canvas
 * @param {HTMLImageElement} img - The image to extract colors from
 * @returns {Array} Array of hex color strings
 */
export function extractColorsFromImage(img) {
  // Create a canvas to extract pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = img.width;
  const height = img.height;
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  
  // Sample colors from different parts of the image
  const sampleColors = [];
  const samplePoints = [
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },  // center
    { x: Math.floor(width / 4), y: Math.floor(height / 4) },  // top-left
    { x: Math.floor(3 * width / 4), y: Math.floor(height / 4) },  // top-right
    { x: Math.floor(width / 4), y: Math.floor(3 * height / 4) },  // bottom-left
    { x: Math.floor(3 * width / 4), y: Math.floor(3 * height / 4) }  // bottom-right
  ];
  
  for (const point of samplePoints) {
    const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
    const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    sampleColors.push(hex);
  }
  
  return sampleColors;
}

/**
 * Generate different color palettes from extracted colors
 * @param {Array} extractedColors - Array of hex color strings
 * @returns {Array} Array of palette objects
 */
export function generatePalettes(extractedColors) {
  const dominantColor = extractedColors[0]; // Center color as dominant
  const palettes = [];
  
  // Extracted colors palette
  palettes.push({
    name: "Extracted Colors",
    description: "Colors sampled from different parts of your image",
    colors: extractedColors
  });
  
  // Complementary palette
  const complementary = getComplementaryPalette(dominantColor);
  palettes.push({
    name: "Complementary",
    description: "Colors opposite each other on the color wheel",
    colors: complementary
  });
  
  // Monochromatic palette
  const monochromatic = getMonochromaticPalette(dominantColor);
  palettes.push({
    name: "Monochromatic",
    description: "Different shades and tints of the base color",
    colors: monochromatic
  });
  
  // Generate a simple analogous palette
  const analogous = getAnalogousPalette(dominantColor);
  palettes.push({
    name: "Analogous",
    description: "Colors adjacent to each other on the color wheel",
    colors: analogous
  });
  
  // Triadic palette
  const triadic = getTriadicPalette(dominantColor);
  palettes.push({
    name: "Triadic",
    description: "Three colors evenly spaced on the color wheel",
    colors: triadic
  });
  
  return palettes;
}

/**
 * Convert RGB values to hex color string
 * @param {Number} r - Red value (0-255)
 * @param {Number} g - Green value (0-255)
 * @param {Number} b - Blue value (0-255)
 * @returns {String} Hex color string
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert hex color string to RGB object
 * @param {String} hex - Hex color string
 * @returns {Object} RGB object with r, g, b properties
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert hex color to HSL object
 * @param {String} hex - Hex color string
 * @returns {Object} HSL object with h, s, l properties
 */
export function hexToHSL(hex) {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h = h * 60;
  }
  
  return { h, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL values to hex color string
 * @param {Number} h - Hue (0-360)
 * @param {Number} s - Saturation (0-100)
 * @param {Number} l - Lightness (0-100)
 * @returns {String} Hex color string
 */
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  
  if (0 <= h && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

/**
 * Blend two colors together
 * @param {String} color1 - First hex color
 * @param {String} color2 - Second hex color
 * @param {Number} ratio - Blend ratio (0-1)
 * @returns {String} Resulting hex color
 */
export function blendColors(color1, color2, ratio) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return rgbToHex(r, g, b);
}

/**
 * Generate a complementary color palette
 * @param {String} hexColor - Base hex color
 * @returns {Array} Array of hex colors
 */
export function getComplementaryPalette(hexColor) {
  const rgb = hexToRgb(hexColor);
  const complementary = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  };
  
  const complementaryHex = rgbToHex(complementary.r, complementary.g, complementary.b);
  
  // Create a palette with the original color, complementary, and some intermediate shades
  return [
    hexColor,
    blendColors(hexColor, complementaryHex, 0.25),
    blendColors(hexColor, complementaryHex, 0.5),
    blendColors(hexColor, complementaryHex, 0.75),
    complementaryHex
  ];
}

/**
 * Generate a monochromatic color palette
 * @param {String} hexColor - Base hex color
 * @returns {Array} Array of hex colors
 */
export function getMonochromaticPalette(hexColor) {
  const hsl = hexToHSL(hexColor);
  const colors = [];
  
  // Create 5 colors with varying lightness
  for (let i = 0; i < 5; i++) {
    const newLightness = 20 + (i * 15);
    colors.push(hslToHex(hsl.h, hsl.s, newLightness));
  }
  
  return colors;
}

/**
 * Generate an analogous color palette
 * @param {String} hexColor - Base hex color
 * @returns {Array} Array of hex colors
 */
export function getAnalogousPalette(hexColor) {
  const hsl = hexToHSL(hexColor);
  const colors = [];
  
  // Get 5 colors: 2 before, the original, and 2 after
  for (let i = -2; i <= 2; i++) {
    let newHue = (hsl.h + i * 30) % 360;
    if (newHue < 0) newHue += 360;
    
    colors.push(hslToHex(newHue, hsl.s, hsl.l));
  }
  
  return colors;
}

/**
 * Generate a triadic color palette
 * @param  hsl.s, hsl.l));
  }
  
  return colors;
}

/**
 * Generate a triadic color palette
 * @param {String} hexColor - Base hex color
 * @returns {Array} Array of hex colors
 */
export function getTriadicPalette(hexColor) {
  const hsl = hexToHSL(hexColor);
  const colors = [];
  
  // Get the original color and 2 colors 120° apart on the color wheel
  for (let i = 0; i < 3; i++) {
    let newHue = (hsl.h + i * 120) % 360;
    colors.push(hslToHex(newHue, hsl.s, hsl.l));
  }
  
  // Add some intermediate shades
  colors.push(blendColors(colors[0], colors[1], 0.5));
  colors.push(blendColors(colors[1], colors[2], 0.5));
  
  return colors;
}