// https://github.com/regexhq/hex-color-regex/blob/master/index.js
function hexColorRegex() {
  return /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi;
}

export function isHexColor(color) {
  return hexColorRegex().test(color);
}
