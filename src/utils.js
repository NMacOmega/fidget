function setMaterialProperty(type, material, value) {
  if (type === "color") {
    const hexColor = convertColorToHex(value);
    if (!hexColor) return undefined;
    if ("color" in material) material.color.set(hexColor);
    return hexColor;
  }

  if (type === "metalness") {
    if (value && "metalness" in material) material.metalness = value / 100;
    return;
  }

  if (type === "roughness") {
    if (value && "roughness" in material) material.roughness = value / 100;
    return;
  }
}

function convertColorToHex(string) {
  if (string.indexOf("#") > -1) return string;

  let value = string
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("%", "")
    .replaceAll("rgb", "")
    .replaceAll("hsl", "");

  let rgb;

  if (string.indexOf("rgb") > -1) {
    rgb = value.split(",");
  }

  if (string.indexOf("hsl") > -1) {
    let [h, s, l] = value.split(",");
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    rgb = [r, g, b];
  }

  if (!rgb || !rgb[2]) return undefined;

  var hex = rgb.map(function (x) {
    x = parseInt(x).toString(16);
    return x.length == 1 ? "0" + x : x;
  });
  return "#" + hex.join("");
}
