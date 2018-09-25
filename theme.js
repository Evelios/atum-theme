const chroma = require('chroma-js');
const array = require('new-array');
const fs = require('fs');

createColorScheme();

function createColorScheme() {
  const num_primary_colors = 6;

  // ---- Color Parameters ----
  const base_hue = 30; // red
  const primary_chroma = 80;
  const secondary_chroma = 5;
  const vibrant_lightness = 75;
  const mute_lightness = 85;

  const dark_tones = createBackgroundDarkTones(base_hue, secondary_chroma);
  const content_tones = createContentTones(base_hue, secondary_chroma);
  const light_tones = createBackgroundLightTones(base_hue, secondary_chroma);

  // ---- Create Colors ----
  let colors = [];

  // Create the black vibrant color
  const black_vibrant = chroma.lch(vibrant_lightness, secondary_chroma, base_hue);
  colors.push(black_vibrant);
  
  // Create the Vibrant Primary Colors
  const vibrant_accents = createVibrantAccentColors(base_hue, primary_chroma);
  colors = colors.concat(vibrant_accents);
  
  // Create the vibrant white
  colors.push(chroma('white'));

  // Create the black mute color
  const black_mute = chroma.lch(mute_lightness, secondary_chroma, base_hue);
  colors.push(black_mute);

  // Create the Light Primary Colors
  const mute_accents = createMuteAccentColors(base_hue, primary_chroma);
  colors = colors.concat(mute_accents);

  // Create the mute white
  colors.push(chroma('white'));

  // Create the foreground and background
  // const foreground = chroma.lch(foreground_lightness, secondary_chroma, foreground_hue);
  // const background = chroma.lch(background_lightness, secondary_chroma, base_hue);
  const foreground = content_tones[2];
  const background = dark_tones[0];

  colors.push(foreground);
  colors.push(background);
  
  // To keep things consistent the order of the colors need to be rearranged
  swap(colors, 2, 3);
  swap(colors, 10, 11);
  swap(colors, 5, 6);
  swap(colors, 13, 14);
  swap(colors, 4, 6);
  swap(colors, 12, 14);

  saveToXresources(colors);
}

function createVibrantAccentColors(base_hue, accent_chroma) {
  const num_primary_colors = 6;
  const vibrant_lightness = 75;

  return array(num_primary_colors).map((_, i) => {
    const hue = (base_hue + (i / num_primary_colors) * 360) % 360;
    return chroma.lch(vibrant_lightness, accent_chroma, hue);
  });
}

function createMuteAccentColors(base_hue, accent_chroma) {
  const num_primary_colors = 6;
  const mute_lightness = 85;

  return array(num_primary_colors).map((_, i) => {
    const hue = (base_hue + (i / num_primary_colors) * 360) % 360;
    return chroma.lch(mute_lightness, accent_chroma, hue);
  });
}

function createBackgroundDarkTones(base_hue, bg_chroma) {
  const base03_lightness = 15;
  const base02_lightness = 20;

  const base03 = chroma.lch(base03_lightness, bg_chroma, base_hue);
  const base02 = chroma.lch(base02_lightness, bg_chroma, base_hue);

  return [base03, base02];
}

function createContentTones(base_hue, content_chroma) {
  const lightness_values = [45, 50, 60, 65];

  return lightness_values.map(lightness => 
    chroma.lch(lightness, content_chroma, base_hue)
  );
}

function createBackgroundLightTones(base_hue, bg_chroma) {
  const base2_lightness = 92;
  const base3_lightness = 97;

  const base2 = chroma.lch(base2_lightness, bg_chroma, base_hue);
  const base3 = chroma.lch(base3_lightness, bg_chroma, base_hue);

  return [base2, base3];
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
     'blue', 'magenta', 'cyan', 'white'];
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

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function hueComplament(hue) {
  return (hue + 180) % 360;
}