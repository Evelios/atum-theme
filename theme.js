const chroma = require('chroma-js');
const array = require('new-array');
const fs = require('fs');

createColorScheme();

function createColorScheme() {

  // ---- Color Parameters ----
  const base_hue = 36; // red
  const foreground_hue = hueComplament(base_hue);
  const primary_chroma = 70;
  const secondary_chroma = 10;
  const background_lightness = 30;
  const vibrant_lightness = 60;
  const mute_lightness = 80;
  const foreground_lightness = 85;
  const num_primary_colors = 6;

  // ---- Create Colors ----
  let colors = [];

  // Create the black vibrant color
  const black_vibrant = chroma.lch(vibrant_lightness, secondary_chroma, base_hue);
  colors.push(black_vibrant);
  
  // Create the Vibrant Primary Colors
  for (let i = 0; i < num_primary_colors; i++) {
    const hue = (base_hue + (i / num_primary_colors) * 360) % 360;
    const vibrant_color = chroma.lch(vibrant_lightness, primary_chroma, hue);
    colors.push(vibrant_color);
  }
  
  // Create the vibrant white
  colors.push(chroma('white'));

  // Create the black mute color
  const black_mute = chroma.lch(mute_lightness, secondary_chroma, base_hue);
  colors.push(black_mute);


  // Create the Light Primary Colors
  for (let i = 0; i < num_primary_colors; i++) {
    const hue = (base_hue + (i / num_primary_colors) * 360) % 360;
    const mute_color = chroma.lch(mute_lightness, primary_chroma, hue);
    colors.push(mute_color);
  }

  // Create the mute white
  colors.push(chroma('white'));

  // Create the foreground and background
  const foreground = chroma.lch(foreground_lightness, secondary_chroma, foreground_hue);
  const background = chroma.lch(background_lightness, secondary_chroma, base_hue);

  colors.push(foreground);
  colors.push(background);
  

  saveToXresources(colors);
}

/**
 * Save the color scheme to a .Xresources file
 * 
 * @param {String[]} colors The list of colors to save to the file
 *   in hexidecimal format
 * Format:
 *  colors 0-15,
 *  foreground,
 *  background
 */
function saveToXresources(colors) {
  const color_names = ['black', 'red', 'green', 'yellow',
     'blue', 'magent', 'cyan', 'white'];
  let xresources_contents = '';

  // Base Color Values
  xresources_contents += `! special\n`;
  xresources_contents += `*.foreground: ${colors[16]}\n`;
  xresources_contents += `*.background: ${colors[17]}\n`;
  xresources_contents += `*.cursorColor: ${colors[16]}\n`;
  xresources_contents += `\n`;

  // Save the color values
  for (let i = 0; i < 8; i++) {
    xresources_contents += `! ${color_names[i]}\n`;
    xresources_contents += `*.color${i}: ${colors[i]}\n`;
    xresources_contents += `*.color${i + 8}: ${colors[i + 8]}\n`;
    xresources_contents += `\n`;
  }

  fs.writeFile('.Xresources', xresources_contents);
}

function hueComplament(hue) {
  return (hue + 180) % 360;
}