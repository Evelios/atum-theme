const chroma = require('chroma-js');
const array = require('new-array');
const fs = require('fs');

createColorScheme();

function createColorScheme() {
  const base_hue = 25; // red
  const primary_chroma = 60;
  const secondary_chroma = 5;

  const colors = [].concat(
    createBackgroundDarkTones(base_hue, secondary_chroma),
    createContentTones(base_hue, secondary_chroma),
    createBackgroundLightTones(base_hue, secondary_chroma),
    createVibrantAccentColors(base_hue, primary_chroma),
    createMuteAccentColors(base_hue, primary_chroma)
  );

  saveToXresources(colors);
}

function createVibrantAccentColors(base_hue, accent_chroma) {
  const vibrant_lightness = 65;

  return getAccentHues(base_hue).map(hue =>
    chroma.lch(vibrant_lightness, accent_chroma, hue)
  );
}

function createMuteAccentColors(base_hue, accent_chroma) {
  const mute_lightness = 75;

  return getAccentHues(base_hue).map(hue =>
    chroma.lch(mute_lightness, accent_chroma, hue)
  );
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

function getAccentHues(base_hue) {
  return [].concat(
    base_hue,
    hueComplament(base_hue),
    huesTetrad(base_hue),
    huesAnalagous(base_hue, 60),
    huesSplitComp(base_hue, 60)
  );
}

function hueComplament(hue) {
  return (hue + 180) % 360;
}

function huesAnalagous(hue, angle) {
  return [
    (hue       + angle) % 360,
    (hue + 360 - angle) % 360,
  ];
}

function huesSplitComp(hue, angle) {
  return [
    (hue + 180 + angle) % 360,
    (hue + 180 - angle) % 360,
  ];
}

function huesTetrad(hue) {
  return [].concat(
    huesAnalagous(hue, 90)
  );
}

function huesTriad(hue) {
  return huesAnalagous(hue, 120); 
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
  const xresources_content = colors.reduce((content, color) => {
    return content + `*color : ${color}\n`;
  }, '');

  fs.writeFile('.Xresources-Temp', xresources_content);
}

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}