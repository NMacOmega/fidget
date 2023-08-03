import { d as get_store_value, c as create_ssr_component, s as subscribe, f as add_attribute, h as compute_rest_props, j as spread, k as escape_object, l as add_styles, v as validate_component, o as set_store_value, e as escape, p as null_to_empty, q as each } from "../../chunks/index2.js";
import { w as writable, d as derived, r as readable } from "../../chunks/index.js";
function readableWithInit(initialValue, storeKey = makeId(20)) {
  const { subscribe: subscribe2, set: setter } = writable(initialValue);
  return {
    subscribe: subscribe2,
    init: (n2) => updateReadOnlyStore(storeKey, n2, setter)
  };
}
const updateOnlyOnce = {
  stores: {},
  storeIsLocked: checkIfStoreIsLocked,
  lock: setReadableWithInitStoreToLocked
};
function checkIfStoreIsLocked(storeKey) {
  return updateOnlyOnce.stores[storeKey] && updateOnlyOnce.stores[storeKey].isLocked;
}
function setReadableWithInitStoreToLocked(storeKey) {
  return updateOnlyOnce.stores[storeKey] = { isLocked: true };
}
function updateReadOnlyStore(storeKey, value, setThisStore) {
  if (updateOnlyOnce?.storeIsLocked(storeKey)) {
    return console.warn("Store [", storeKey, "] is already initialized and cannot be updated");
  }
  updateOnlyOnce.lock(storeKey);
  return setThisStore(value);
}
function makeId(length2) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length2) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
const orbit$1 = writable({});
const index = writable(0);
const cameraPositions = writable([]);
const focalPositions = writable([]);
const length = derived(cameraPositions, ($c) => $c.length - 1 || 0);
const currentCameraPosition = derived([index, cameraPositions], ([$i, $c]) => $c[$i].position);
const currentFocalPosition = derived([index, focalPositions], ([$i, $f]) => $f[$i].position);
const currentFocalName = derived([index, focalPositions], ([$i, $f]) => $f[$i].name);
const camera$1 = function() {
  const cameraStore = writable({});
  const init = (cam, cams, focals) => {
    cameraStore.set(cam);
    cameraPositions.set(cams);
    focalPositions.set(focals);
  };
  const traverse = (dir) => {
    const next2 = dir === "next";
    const prev2 = !next2;
    let i = get_store_value(index);
    const max = get_store_value(length);
    if (next2)
      i = i >= max ? 0 : i + 1;
    if (prev2)
      i = i <= 0 ? max : i - 1;
    index.set(i);
    get_store_value(cameraStore)?.position?.copy(get_store_value(currentCameraPosition));
    const newFocalPos = get_store_value(currentFocalPosition);
    if (newFocalPos) {
      const orb = get_store_value(orbit$1);
      orb?.target?.copy(newFocalPos);
      zoom$1.setFromSlider(get_store_value(zoom$1));
      orb.update();
      highlightFidget(get_store_value(currentFocalName));
    }
  };
  const next = () => traverse("next");
  const prev = () => traverse("prev");
  return { subscribe: cameraStore.subscribe, init, next, prev };
}();
const zoom$1 = function() {
  const { subscribe: subscribe2, set } = writable(0);
  const limit = { max: 10, min: 5 };
  function enable() {
    get_store_value(orbit$1).zoomEnabled = true;
  }
  function disable() {
    get_store_value(orbit$1).zoomEnabled = false;
  }
  function setFromSlider(val) {
    if (val <= 0)
      return;
    set(val);
    val /= 100;
    const cam = get_store_value(camera$1);
    const focal = get_store_value(currentFocalPosition);
    const currentDistance = cam.position.distanceTo(focal);
    const desiredMovement = limit.max - limit.min * val;
    const travelDistance = desiredMovement / currentDistance;
    cam.position.lerpVectors(focal, cam.position, travelDistance);
  }
  function setFromOrbit() {
    let val = get_store_value(camera$1).position.distanceTo(get_store_value(currentFocalPosition));
    val = (val - limit.min) / limit.min * 100;
    const result = 100 - val;
    if (result > 0)
      set(result);
  }
  return { subscribe: subscribe2, limit, setFromSlider, setFromOrbit, enable, disable };
}();
const cameraStores = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  camera: camera$1,
  orbit: orbit$1,
  zoom: zoom$1
}, Symbol.toStringTag, { value: "Module" }));
function parseColor(value) {
  if (!value)
    return void 0;
  const hsv2 = parseHSV(value);
  if (hsv2) {
    const rgb22 = HSVtoRGB(hsv2.h, hsv2.s, hsv2.v);
    return {
      hsv: hsv2,
      hsl: HSVtoHSL(hsv2.h, hsv2.s, hsv2.v),
      rgb: rgb22,
      hex: RGBtoHEX(rgb22.r, rgb22.g, rgb22.b)
    };
  }
  const hsl2 = parseHSL(value);
  if (hsl2) {
    console.log("HSL: ", hsl2.h, hsl2.s, hsl2.l);
    const hsv22 = HSLtoHSV(hsl2.h, hsl2.s, hsl2.l);
    const rgb22 = HSVtoRGB(hsv22.h, hsv22.s, hsv22.v);
    return {
      hsv: hsv22,
      hsl: hsl2,
      rgb: rgb22,
      hex: RGBtoHEX(rgb22.r, rgb22.g, rgb22.b)
    };
  }
  const rgb2 = parseRGB(value);
  if (rgb2) {
    const hsv22 = RGBtoHSV(rgb2.r, rgb2.g, rgb2.b);
    return {
      hsv: hsv22,
      hsl: HSVtoHSL(hsv22.h, hsv22.s, hsv22.v),
      rgb: rgb2,
      hex: RGBtoHEX(rgb2.r, rgb2.g, rgb2.b)
    };
  }
  const hex2 = parseHEX(value);
  if (hex2) {
    const rgb22 = HEXtoRGB(hex2);
    const hsv22 = RGBtoHSV(rgb22.r, rgb22.g, rgb22.b);
    return {
      hsv: hsv22,
      hsl: HSVtoHSL(hsv22.h, hsv22.s, hsv22.v),
      rgb: rgb22,
      hex: hex2
    };
  }
}
function parseHSL(val) {
  const { h: hue, s: saturation, l: luminosity } = val;
  const [h, s, l] = parseMultiValue([
    [hue, 360, 0],
    [saturation, 1, 0, true],
    [luminosity, 1, 0, true]
  ]);
  if (typeof h === "number" && typeof s === "number" && typeof l === "number")
    return { h, s, l };
}
function parseHEX(val) {
  let hex2 = "";
  if (typeof val === "number")
    hex2 = val.toString(16);
  if (typeof val === "string")
    hex2 = val;
  hex2 = (hex2.match(/[\dA-Fa-f]/g) || []).join("");
  if (hex2.length === 3)
    hex2 = `${hex2}${hex2}`;
  if (hex2.length !== 6)
    return;
  hex2 = hex2.toUpperCase();
  return hex2;
}
function parseHSV(val) {
  const { h: hue, s: saturation, v: value } = val;
  const [h, s, v] = parseMultiValue([
    [hue, 360, 0],
    [saturation, 1, 0, true],
    [value, 1, 0, true]
  ]);
  if (typeof h === "number" && typeof s === "number" && typeof v === "number")
    return { h, s, v };
}
function parseRGB(val) {
  const { r: red, g: green, b: blue } = val;
  const [r, g, b] = parseMultiValue([
    [red, 255, 0],
    [green, 255, 0],
    [blue, 255, 0]
  ]);
  if (typeof r === "number" && typeof g === "number" && typeof b === "number")
    return { r, g, b };
}
function RGBtoHSV(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const xmax = Math.max(red, green, blue);
  const xmin = Math.min(red, green, blue);
  const chroma = xmax - xmin;
  const value = xmax;
  let hue = 0;
  let saturation = 0;
  if (chroma) {
    if (xmax === red) {
      hue = (green - blue) / chroma;
    }
    if (xmax === green) {
      hue = 2 + (blue - red) / chroma;
    }
    if (xmax === blue) {
      hue = 4 + (red - green) / chroma;
    }
    if (xmax) {
      saturation = chroma / xmax;
    }
  }
  hue = Math.floor(hue * 60);
  return {
    h: hue < 0 ? hue + 360 : hue,
    s: parseFloat(saturation.toFixed(3)),
    v: parseFloat(value.toFixed(3))
  };
}
function HSLtoHSV(h, s, l) {
  const value = l + s * Math.min(l, 1 - l);
  return {
    h,
    s: value === 0 ? 0 : 2 * (1 - l / value),
    v: value
  };
}
function HSVtoRGB(h, s, v) {
  const saturation = s;
  const value = v;
  const hueBy60 = h / 60;
  let chroma = saturation * value;
  let x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
  const m = value - chroma;
  chroma = chroma + m;
  x = x + m;
  const index2 = Math.floor(hueBy60) % 6;
  const red = [chroma, x, m, m, x, chroma][index2];
  const green = [x, chroma, chroma, x, m, m][index2];
  const blue = [m, m, x, chroma, chroma, x][index2];
  return {
    r: Math.round(red * 255),
    g: Math.round(green * 255),
    b: Math.round(blue * 255)
  };
}
function HSVtoHSL(h, s, v) {
  const lightness = Math.min(1, Math.max(0, v * (1 - s / 2)));
  const saturation = (v - lightness) / Math.min(lightness, 1 - lightness);
  return {
    h,
    s: parseFloat(saturation.toFixed(3)),
    l: parseFloat(lightness.toFixed(3))
  };
}
function HEXtoRGB(hex2) {
  const values = hex2.replaceAll("#", "").match(/\w\w/g);
  const [r, g, b] = values.map((k) => parseInt(k, 16));
  return { r, g, b };
}
function RGBtoHEX(r, g, b) {
  let R = r.toString(16);
  let G = g.toString(16);
  let B = b.toString(16);
  if (r < 16) {
    R = "0" + R;
  }
  if (g < 16) {
    G = "0" + G;
  }
  if (b < 16) {
    B = "0" + B;
  }
  return R + G + B;
}
function parseMultiValue(paramsArray) {
  const results = [];
  paramsArray.forEach(([val, max, min, isPercent = false]) => {
    if (typeof val !== "number")
      results.push(void 0);
    else {
      if (isPercent && val > 1)
        val /= 100;
      if (typeof max === "number" && val > max)
        val = max;
      if (typeof min === "number" && val < min)
        val = min;
      results.push(val);
    }
  });
  return results;
}
const sceneObjects$1 = readableWithInit({});
const sceneHighlights$1 = readableWithInit({});
function getObjectWithMaterial(UUID) {
  const currObject = get_store_value(sceneObjects$1)[UUID];
  const currMaterial = currObject?.material;
  return {
    object: currObject,
    material: currMaterial
  };
}
const selectedUUID$1 = function() {
  const { subscribe: subscribe2, set: setDirect } = writable("");
  function set(newUUID) {
    const { object, material } = getObjectWithMaterial(newUUID);
    material.transparent = true;
    const { metalness: m, roughness: r, opacity: o, color: c } = material;
    color.setDirect("#" + c.getHexString());
    opacityStore.setDirect(o);
    metalnessStore.setDirect(m);
    roughnessStore.setDirect(r);
    setDirect(newUUID);
  }
  return { subscribe: subscribe2, set };
}();
const createMaterialPropertyStore = (initValue, updateMaterialFunction) => {
  const { subscribe: subscribe2, set: setDirect } = writable(initValue);
  const set = (v) => {
    const { material } = getObjectWithMaterial(get_store_value(selectedUUID$1));
    if (!material)
      return;
    updateMaterialFunction(material, v);
    setDirect(v);
  };
  return { subscribe: subscribe2, set, setDirect };
};
const opacityStore = createMaterialPropertyStore(1, (material, v) => material.opacity = v);
const metalnessStore = createMaterialPropertyStore(1, (material, v) => material.metalness = v);
const roughnessStore = createMaterialPropertyStore(1, (material, v) => material.roughness = v);
const opacity$1 = { subscribe: opacityStore.subscribe, set: opacityStore.set };
const metalness$1 = { subscribe: metalnessStore.subscribe, set: metalnessStore.set };
const roughness$1 = { subscribe: roughnessStore.subscribe, set: roughnessStore.set };
const glossiness$1 = function() {
  const { subscribe: subscribe2 } = derived(roughness$1, ($r) => 1 - $r);
  const set = (v) => {
    const newRoughness = 1 - v;
    roughness$1.set(newRoughness);
  };
  return { subscribe: subscribe2, set };
}();
const color = function() {
  const { subscribe: subscribe2, set: _set } = writable({
    hsv: { h: 0, s: 0, v: 0 },
    hex: "",
    hsl: { h: 0, s: 0, l: 0 },
    rgb: { r: 0, g: 0, b: 0 }
  });
  const set = (value) => {
    const newColor = parseColor(value);
    if (!newColor)
      return;
    let { h, s, l } = newColor.hsl;
    if (!h || !s || !l)
      return;
    h /= 360;
    const { material } = getObjectWithMaterial(get_store_value(selectedUUID$1));
    if (!material)
      return;
    updateMaterialHSL(material, h, s, l);
    _set(newColor);
  };
  const setDirect = (value) => {
    const newColor = parseColor(value);
    console.log("Value ", value, " --> updating Color to: ", newColor);
    if (newColor)
      _set(newColor);
  };
  const updateMaterialHSL = (material, h, s, l) => {
    material.color.setHSL(h, s, l);
  };
  return { subscribe: subscribe2, set, setDirect };
}();
const hsv$1 = function() {
  const { subscribe: subscribe2 } = derived(color, ($color) => $color.hsv);
  return { subscribe: subscribe2, set: color.set };
}();
const rgb$1 = function() {
  const { subscribe: subscribe2 } = derived(color, ($color) => $color.rgb);
  return { subscribe: subscribe2, set: color.set };
}();
const hsl$1 = function() {
  const { subscribe: subscribe2 } = derived(color, ($color) => $color.hsl);
  return { subscribe: subscribe2, set: color.set };
}();
const hex$1 = function() {
  const { subscribe: subscribe2 } = derived(color, ($color) => $color.hex);
  return { subscribe: subscribe2, set: color.set };
}();
const materialStores = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  glossiness: glossiness$1,
  hex: hex$1,
  hsl: hsl$1,
  hsv: hsv$1,
  metalness: metalness$1,
  opacity: opacity$1,
  rgb: rgb$1,
  roughness: roughness$1,
  sceneHighlights: sceneHighlights$1,
  sceneObjects: sceneObjects$1,
  selectedUUID: selectedUUID$1
}, Symbol.toStringTag, { value: "Module" }));
const { camera, orbit, zoom } = cameraStores;
const {
  selectedUUID,
  sceneObjects,
  sceneHighlights,
  opacity,
  roughness,
  glossiness,
  metalness,
  hsl,
  hsv,
  rgb,
  hex
} = materialStores;
const currentFidgetName = writable("");
const scene = readableWithInit({});
const animations = readableWithInit({
  sphere: {
    spin: {}
  },
  discs: {
    spinDiscA: {},
    spinDiscB: {},
    spinDiscC: {},
    spinDiscD: {}
  }
});
const availableAnimations = derived(
  [currentFidgetName, animations],
  ([$name, $animations]) => Object.values($animations[$name] || {}) || []
);
const isAnimationsAvailable = derived(availableAnimations, ($anims) => $anims.length > 0);
readable(
  {
    joystick: {
      rotation: {
        min: 10,
        max: 10
      }
    }
  }
);
const highlightFidget = (focusPoint) => {
  const threeScene = get_store_value(scene);
  const uuid = get_store_value(sceneHighlights)[focusPoint];
  if (uuid)
    selectedUUID.set(uuid);
  const focusObjectInScene = threeScene.getObjectByProperty("name", focusPoint);
  if (!focusObjectInScene) {
    console.log("No Focus point found for fidget ", focusPoint);
    return;
  }
  const objects = get_store_value(sceneObjects);
  let fidgetName = "";
  Object.entries(objects).forEach(([_, obj]) => {
    const tag = obj.userData.focus || void 0;
    const fidgetGroup = obj.userData.group || void 0;
    if (tag === focusPoint && fidgetGroup) {
      obj.visible = true;
      fidgetName = fidgetGroup;
    } else
      obj.visible = false;
  });
  currentFidgetName.set(fidgetName);
};
const ThreeJsScene_svelte_svelte_type_style_lang = "";
const css$e = {
  code: ".canvas.svelte-1ebfjix{width:100% !important;max-height:100%;height:100% !important}",
  map: null
};
const ThreeJsScene = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedUUID, $$unsubscribe_selectedUUID;
  $$unsubscribe_selectedUUID = subscribe(selectedUUID, (value) => $selectedUUID = value);
  let threeCanvas;
  $$result.css.add(css$e);
  $$unsubscribe_selectedUUID();
  return `
<canvas id="threeCanvas" class="canvas svelte-1ebfjix"${add_attribute("this", threeCanvas, 0)}>
	<input type="hidden"${add_attribute("value", $selectedUUID, 0)}>
</canvas>`;
});
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<i${spread([escape_object($$restProps)], {})}></i>`;
});
const ZoomSlider_svelte_svelte_type_style_lang = "";
const css$d = {
  code: ".zoom.svelte-5f8g9a{--width:280px;--right:-50px;transform:rotateZ(270deg);direction:ltr;position:absolute;border-radius:5px;bottom:15%;width:var(--width);right:var(--right);max-width:180px;height:40px;background-color:var(--background-color)}.zoomSlider.svelte-5f8g9a{position:absolute;width:calc(100% + 16px);height:100%;left:-8px;top:-2px;margin:0;background-color:transparent;cursor:pointer;opacity:0;appearance:none;-webkit-appearance:none}.zoomSpan.svelte-5f8g9a{display:block;width:100%;height:100%;background:var(--track-background-color);border-radius:5px}.zoomMarker.svelte-5f8g9a{box-shadow:0 0 5px rgba(0, 0, 0, 0.2);position:absolute;width:24px;height:110%;left:var(--left);top:50%;margin-left:-8px;transform:translateY(-50%);border:var(--marker-border);border-radius:10px;background-color:var(--marker-color);box-shadow:0 0 1px #888;pointer-events:none}input[type='range'].svelte-5f8g9a::-moz-range-thumb{width:8px;height:8px;border:0;background-color:var(--marker-color)}input[type='range'].svelte-5f8g9a::-moz-range-track{width:100%;height:8px;border:0}",
  map: null
};
const ZoomSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $zoom, $$unsubscribe_zoom;
  $$unsubscribe_zoom = subscribe(zoom, (value) => $zoom = value);
  let { min = 0, max = 100, step = 1 } = $$props;
  let left = `0%`, markerColor = "#000", markerBorder = `2px solid #fff`, backgroundColor = "transparent", trackColor = "#eaeaea";
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  $$result.css.add(css$d);
  left = `${$zoom}%`;
  $$unsubscribe_zoom();
  return `<div class="zoom svelte-5f8g9a"${add_styles({
    "--left": left,
    "--marker-color": markerColor,
    "--marker-border": markerBorder,
    "--track-background-color": trackColor,
    "--background-color": backgroundColor
  })}><span class="zoomSpan svelte-5f8g9a" id="zoomSpan"></span>
	<input id="zoomSlider" name="zoom" class="zoomSlider svelte-5f8g9a" type="range"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)} aria-label="Zoom slider"${add_attribute("value", $zoom, 0)}>
	<div id="zoomMarker" class="zoomMarker svelte-5f8g9a"></div>
</div>`;
});
const AnimationStartButton_svelte_svelte_type_style_lang = "";
const css$c = {
  code: ".startAnimationButton.svelte-1lqj7w8{position:absolute;right:10%;bottom:10%;width:60px;height:60px;background-color:#292929;color:hsl(220, 20%, 50%);border:none;display:flex;align-items:center;justify-content:center;padding:15px;border-radius:16px}.playIcon{font-size:25px}",
  map: null
};
const AnimationStartButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_animations;
  let $enabled, $$unsubscribe_enabled;
  $$unsubscribe_animations = subscribe(availableAnimations, (value) => value);
  $$unsubscribe_enabled = subscribe(isAnimationsAvailable, (value) => $enabled = value);
  $$result.css.add(css$c);
  $$unsubscribe_animations();
  $$unsubscribe_enabled();
  return `
${$enabled || !$enabled ? `<button class="animationButton startAnimationButton svelte-1lqj7w8">${validate_component(Icon, "Icon").$$render($$result, { class: "fa-solid fa-play playIcon" }, {}, {})}</button>` : ``}`;
});
const ColorArea_svelte_svelte_type_style_lang = "";
const css$b = {
  code: ".colorArea.svelte-1yzuodg{position:relative;width:95%;margin:auto;height:100px;background-image:linear-gradient(rgba(0, 0, 0, 0), #000),\r\n			linear-gradient(90deg, #fff, 44%, var(--flatcolor))}.colorMarker.svelte-1yzuodg{position:absolute;border:1px solid #fff;border-radius:50%;cursor:pointer;left:var(--left, 0);top:var(--top, 0);width:12px;height:12px;background-color:var(--color)}",
  map: null
};
const ColorArea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_selectedUUID;
  let $hsv, $$unsubscribe_hsv;
  let $hex, $$unsubscribe_hex;
  $$unsubscribe_selectedUUID = subscribe(selectedUUID, (value) => value);
  $$unsubscribe_hsv = subscribe(hsv, (value) => $hsv = value);
  $$unsubscribe_hex = subscribe(hex, (value) => $hex = value);
  let element;
  let leftOffset = 0, topOffset = 0;
  const clamp = (num, max, min) => Math.min(Math.max(num, min), max);
  const updateOffset = (_optionalTrigger, s = $hsv.s, v = 1 - $hsv.v) => {
    s *= 100;
    v *= 100;
    leftOffset = clamp(s, 95.5, -6.5);
    topOffset = clamp(v, 95.5, -6.5);
  };
  $$result.css.add(css$b);
  {
    updateOffset();
  }
  $$unsubscribe_selectedUUID();
  $$unsubscribe_hsv();
  $$unsubscribe_hex();
  return `
<div class="colorArea svelte-1yzuodg"${add_styles({
    "--left": `${leftOffset}%`,
    "--top": `${topOffset}%`,
    "--color": $hex,
    "--flatcolor": `hsl(${$hsv.h || "0"}, 100%, 50%)`
  })}${add_attribute("this", element, 0)}><div class="colorMarker svelte-1yzuodg"></div>
</div>`;
});
const ColorAlpha_svelte_svelte_type_style_lang = "";
const css$a = {
  code: ".colorAlpha.svelte-zkdr6o{direction:ltr;margin:20px auto;border-radius:5px;position:relative;width:calc(100% - 30px);height:10px;background-image:repeating-linear-gradient(\r\n				45deg,\r\n				#aaa 25%,\r\n				transparent 25%,\r\n				transparent 75%,\r\n				#aaa 75%,\r\n				#aaa\r\n			),\r\n			repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa);background-position:0 0, 4px 4px;background-size:8px 8px}.colorAlphaSlider.svelte-zkdr6o{position:absolute;width:calc(100% + 16px);height:8px;left:-8px;top:-2px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.colorAlphaMarker.svelte-zkdr6o{box-shadow:0 0 5px rgba(0, 0, 0, 0.2);position:absolute;width:16px;height:16px;left:var(--left);top:50%;margin-left:-8px;transform:translateY(-50%);border:2px solid #fff;border-radius:50%;background-color:var(--opacity-color);box-shadow:0 0 1px #888;pointer-events:none}.colorAlphaSpan.svelte-zkdr6o{display:block;height:100%;width:100%;border-radius:inherit;background-image:linear-gradient(90deg, rgba(0, 0, 0, 0), var(--color))}input[type='range'].svelte-zkdr6o::-moz-range-thumb{width:8px;height:8px;border:0;background-color:var(--opacity-color)}input[type='range'].svelte-zkdr6o::-moz-range-track{width:100%;height:8px;border:0}",
  map: null
};
const ColorAlpha = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $opacity, $$unsubscribe_opacity;
  let $hsl, $$unsubscribe_hsl;
  $$unsubscribe_opacity = subscribe(opacity, (value2) => $opacity = value2);
  $$unsubscribe_hsl = subscribe(hsl, (value2) => $hsl = value2);
  let { min = 0, max = 1, step = 1e-4 } = $$props;
  let value = $opacity;
  let left, baseColor, opacityColor;
  const generateStyle = (hsl2, opacity2) => {
    let { h, s, l } = hsl2;
    s *= 100;
    l *= 100;
    left = `${opacity2 / max * 100}%`;
    baseColor = `hsl(${h},${s}%,${l}%)`;
    opacityColor = `hsla(${h}, ${s}%, ${l}%, ${opacity2})`;
  };
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  $$result.css.add(css$a);
  set_store_value(opacity, $opacity = value, $opacity);
  {
    generateStyle($hsl, $opacity);
  }
  $$unsubscribe_opacity();
  $$unsubscribe_hsl();
  return `<div class="colorAlpha svelte-zkdr6o"${add_styles({
    "--left": left,
    "--color": baseColor,
    "--opacity-color": opacityColor
  })}><input id="colorAlphaSlider" name="colorAlphaSlider" class="colorAlphaSlider svelte-zkdr6o" type="range"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)} aria-label="Alpha slider"${add_attribute("value", value, 0)}>
	<div id="colorAlpaMarker" class="colorAlphaMarker svelte-zkdr6o"></div>
	<span class="colorAlphaSpan svelte-zkdr6o" id="colorAlphaSpan"></span>
</div>`;
});
const ColorHue_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ".colorHue.svelte-z4dpj1{direction:ltr;margin:20px auto;border-radius:5px;position:relative;width:calc(100% - 30px);height:10px;background-image:linear-gradient(\r\n			to right,\r\n			red 0,\r\n			#ff0 16.66%,\r\n			#0f0 33.33%,\r\n			#0ff 50%,\r\n			#00f 66.66%,\r\n			#f0f 83.33%,\r\n			red 100%\r\n		)}.colorHueSlider.svelte-z4dpj1{position:absolute;width:calc(100% + 16px);height:8px;left:-8px;top:-4px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.colorHueMarker.svelte-z4dpj1{box-shadow:0 0 5px rgba(0, 0, 0, 0.2);position:absolute;width:16px;height:16px;left:var(--left);top:50%;margin-left:-8px;transform:translateY(-50%);border:2px solid #fff;border-radius:50%;background-color:var(--color);box-shadow:0 0 1px #888;pointer-events:none}input[type='range'].svelte-z4dpj1::-moz-range-thumb{width:8px;height:8px;border:0;background-color:var(--color)}input[type='range'].svelte-z4dpj1::-moz-range-track{width:100%;height:8px;border:0}",
  map: null
};
const ColorHue = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $hsv, $$unsubscribe_hsv;
  $$unsubscribe_hsv = subscribe(hsv, (value2) => $hsv = value2);
  let { min = 0, max = 360, step = 1e-3 } = $$props;
  let value = $hsv.h, left, flatColor;
  const generateStyle = (hsv2) => {
    left = `${hsv2.h / max * 100}%`;
    flatColor = `hsl(${hsv2.h}, 100%, 50%)`;
  };
  const updateValue = (newHue) => {
    set_store_value(hsv, $hsv = { ...$hsv, h: newHue }, $hsv);
    generateStyle($hsv);
  };
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  $$result.css.add(css$9);
  {
    generateStyle($hsv);
  }
  {
    updateValue(value);
  }
  $$unsubscribe_hsv();
  return `<div class="colorHue svelte-z4dpj1"${add_styles({ "--left": left, "--color": flatColor })}><input id="colorHueSlider" name="colorHueSlider" class="colorHueSlider svelte-z4dpj1" type="range"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)} aria-label="Hue slider"${add_attribute("value", value, 0)}>
	<div id="colorHueMarker" class="colorHueMarker svelte-z4dpj1"></div>
</div>`;
});
const ColorPulloutButton_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: ".openColorPickerButton.svelte-1r3o9le.svelte-1r3o9le{position:absolute;z-index:1;left:100%;top:-5%;display:flex;align-items:center;justify-content:center;border-radius:100%;transform:translate(30%, 250%);width:75px;height:75px;transition:all 1.1s}.active.svelte-1r3o9le.svelte-1r3o9le{transform:translate(-60%, -10%);width:50px;height:50px}.openColorPickerButton.svelte-1r3o9le span.svelte-1r3o9le{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);transition:var(--transition-timeout)}.colorSpan.svelte-1r3o9le.svelte-1r3o9le{width:100%;height:100%;border-radius:100%;border:1px solid var(--border-color, #000);background-color:var(--color)}.alphaSpan.svelte-1r3o9le.svelte-1r3o9le{width:100%;height:100%;border-radius:100%;background-color:var(--color);clip-path:var(--clip-path)}.iconSpan.svelte-1r3o9le.svelte-1r3o9le{width:30%;height:30%;background-color:white;display:flex;align-items:center;justify-content:center;border-radius:100%}.metalSpan.svelte-1r3o9le.svelte-1r3o9le,.metalBackground.svelte-1r3o9le.svelte-1r3o9le,.glossySpan.svelte-1r3o9le.svelte-1r3o9le,.glossyBackground.svelte-1r3o9le.svelte-1r3o9le{border-radius:100%;background-color:var(--color, #eaeaea);clip-path:var(--clip-path)}.metalSpan.svelte-1r3o9le.svelte-1r3o9le,.glossySpan.svelte-1r3o9le.svelte-1r3o9le{width:100%;height:100%}.metalBackground.svelte-1r3o9le.svelte-1r3o9le,.glossyBackground.svelte-1r3o9le.svelte-1r3o9le{width:115%;height:115%}",
  map: null
};
const ColorPulloutButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $glossiness, $$unsubscribe_glossiness;
  let $opacity, $$unsubscribe_opacity;
  let $metalness, $$unsubscribe_metalness;
  let $hsl, $$unsubscribe_hsl;
  let $$unsubscribe_selectedUUID;
  $$unsubscribe_glossiness = subscribe(glossiness, (value) => $glossiness = value);
  $$unsubscribe_opacity = subscribe(opacity, (value) => $opacity = value);
  $$unsubscribe_metalness = subscribe(metalness, (value) => $metalness = value);
  $$unsubscribe_hsl = subscribe(hsl, (value) => $hsl = value);
  $$unsubscribe_selectedUUID = subscribe(selectedUUID, (value) => value);
  let { isOpen = false } = $$props;
  let icon, transition = "all 0.2s";
  const colors = {
    material: "",
    alpha: "",
    metalness: "",
    metalnessBG: "",
    glossiness: "",
    glossinessBG: ""
  };
  const clipPaths = {
    alpha: "",
    metalness: "",
    metalnessBG: "",
    glossiness: "",
    glossinessBG: ""
  };
  const toggleTransitionOnMaterialChange = (UUID_trigger) => {
    transition = "all .2s";
    setTimeout(
      () => {
        transition = "";
      },
      200
    );
  };
  const generateStyle = (hsl2, metalness2, opacity2, glossiness2) => {
    const { h, s, l } = hsl2;
    const dullS = s * 100 / 2, dullL = l * 100 / 2;
    colors.material = `hsl(${h}deg ${s * 100}% ${l * 100}%)`;
    colors.alpha = `hsl(${h}deg ${dullS}% ${dullL}%)`;
    colors.metalness = `hsl(0deg 0% 60%)`;
    colors.metalnessBG = `hsl(0deg 0% 10%)`;
    colors.glossiness = `hsl(${h}deg 100% 70%)`;
    colors.glossinessBG = `hsl(${h}deg 100% 10%)`;
    const g = 100 - glossiness2 * 100;
    let m = 100 - metalness2 * 100;
    let o = 100 - opacity2 * 100;
    if (m > 97)
      m = 100;
    if (o > 90)
      o = 90;
    clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
    clipPaths.metalness = `polygon(0% 100%, 100% 100%, 100% ${m}%, 0% ${m}%)`;
    clipPaths.metalnessBG = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
    clipPaths.glossiness = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
    clipPaths.glossinessBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
  };
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  $$result.css.add(css$8);
  {
    toggleTransitionOnMaterialChange();
  }
  {
    generateStyle($hsl, $metalness, $opacity, $glossiness);
  }
  icon = isOpen ? "close" : "play";
  $$unsubscribe_glossiness();
  $$unsubscribe_opacity();
  $$unsubscribe_metalness();
  $$unsubscribe_hsl();
  $$unsubscribe_selectedUUID();
  return `<button class="${escape(null_to_empty(`openColorPickerButton ${isOpen ? "active" : ""}`), true) + " svelte-1r3o9le"}"${add_styles({ "--transition-timeout": transition })}><span class="glossyBackground svelte-1r3o9le"${add_styles({
    "--color": colors.glossinessBG,
    "--clip-path": clipPaths.glossinessBG
  })}><span class="glossySpan svelte-1r3o9le"${add_styles({
    "--color": colors.glossiness,
    "--clip-path": clipPaths.glossiness
  })}></span></span>
	<span class="metalBackground svelte-1r3o9le"${add_styles({
    "--color": colors.metalnessBG,
    "--clip-path": clipPaths.metalnessBG
  })}><span class="metalSpan svelte-1r3o9le"${add_styles({
    "--color": colors.metalness,
    "--clip-path": clipPaths.metalness
  })}></span></span>
	<span class="colorSpan svelte-1r3o9le"${add_styles({ "--color": colors.material })}></span>
	<span class="alphaSpan svelte-1r3o9le"${add_styles({
    "--color": colors.alpha,
    "--clip-path": clipPaths.alpha
  })}></span>
	<span class="iconSpan svelte-1r3o9le">${validate_component(Icon, "Icon").$$render($$result, { class: `fa-solid fa-${icon}` }, {}, {})}</span>
</button>`;
});
const MetalnessSlider_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: ".metalness.svelte-1c03jzg{direction:ltr;margin:20px auto;border-radius:5px;position:relative;width:calc(100% - 30px);height:30px}.metalnessSlider.svelte-1c03jzg{position:absolute;width:calc(100% + 16px);height:100%;left:-8px;top:-2px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.metalnessMarker.svelte-1c03jzg{position:absolute;width:16px;height:120%;left:var(--left);clip-path:polygon(var(--borderShape));bottom:0%;margin-left:-8px;background-color:var(--markerBorder);box-shadow:0 0 1px #888;pointer-events:none}.metalnessMarker.svelte-1c03jzg::after{content:'';display:block;width:100%;height:100%;margin:auto;clip-path:polygon(var(--markerShape));background-color:var(--markerColor);pointer-events:none}.metalnessSpan.svelte-1c03jzg{display:block;width:100%;height:100%;background:var(--hsl-background);clip-path:polygon(0% 100%, 0% 80%, 100% 0%, 100% 100%)}input[type='range'].svelte-1c03jzg::-moz-range-thumb{width:8px;height:100%;border:0}input[type='range'].svelte-1c03jzg::-moz-range-track{width:100%;height:100%;border:0}",
  map: null
};
const MetalnessSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $metalness, $$unsubscribe_metalness;
  $$unsubscribe_metalness = subscribe(metalness, (value2) => $metalness = value2);
  let { max = 1 } = $$props;
  let { min = 0 } = $$props;
  let { step = 0.01 } = $$props;
  let value = $metalness, element;
  let left, color2, borderShape, markerShape, markerColor, markerBorder, hslBackground;
  const clamp = (num, max2, min2) => Math.min(max2, Math.max(min2, num));
  const generateStyle = (metalness2) => {
    const leftPercent = metalness2 * 100 || 0;
    left = `${leftPercent}%`;
    const height = 0;
    const width = 0;
    const angle = Math.atan(height / width);
    let a = metalness2 - 0.1;
    let b = width * a * Math.tan(angle);
    let c = metalness2 + 0.2;
    let d = width * c * Math.tan(angle);
    a = clamp(100 - a * 100, 100, -1);
    b = clamp(110 - b / height * 100, 83, 1);
    c = clamp(110 - c * 100, 75, 10);
    d = clamp(100 - d / height * 100, 65, 0);
    borderShape = `0% 100%, 0% ${a}%, 100% ${d}%, 100% 100%`;
    markerShape = `5% 93%, 5% ${b}%, 93% ${c}%, 90% 93%`;
    const stop = metalness2 * 100;
    const shade = 100 - stop > 50 ? 100 : 0;
    markerColor = `hsl(0, 0%, ${stop}%)`;
    markerBorder = `hsl(1, 0%, ${shade}%)`;
    hslBackground = `linear-gradient(90deg, 
		hsl(1, 1%, 10%) 0%,  
		hsl(1, 1%, 50%) ${stop}%,  
		hsl(1, 1%, 90%) 100%,  
		hsl(1, 1%, 90%) 100%)`;
  };
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  $$result.css.add(css$7);
  set_store_value(metalness, $metalness = value, $metalness);
  {
    generateStyle($metalness);
  }
  $$unsubscribe_metalness();
  return `<div class="metalness svelte-1c03jzg"${add_styles({
    "--left": left,
    "--color": color2,
    "--markerShape": markerShape,
    "--borderShape": borderShape,
    "--markerColor": markerColor,
    "--markerBorder": markerBorder,
    "--hsl-background": hslBackground
  })}><span class="metalnessSpan svelte-1c03jzg" id="metalnessSpan"></span>
	<input id="metalnessSlider" name="metalnessSlider" class="metalnessSlider svelte-1c03jzg" type="range"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)} aria-label="metalic slider"${add_attribute("value", value, 0)}${add_attribute("this", element, 0)}>
	<div id="metalnessMarker" class="metalnessMarker svelte-1c03jzg"></div>
</div>`;
});
const RoughnessSlider_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".roughness.svelte-1pmfqk{direction:ltr;margin:20px auto;border-radius:5px;position:relative;width:calc(100% - 30px);height:30px;background-position:0 0, 4px 4px;background-size:8px 8px}.roughnessSlider.svelte-1pmfqk{position:absolute;width:calc(100% + 16px);height:100%;left:-8px;top:-2px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.roughnessMarker.svelte-1pmfqk{box-shadow:0 0 5px rgba(0, 0, 0, 0.2);position:absolute;width:16px;height:var(--height, 100%);left:var(--left);bottom:0%;margin-left:-8px;border:2px solid #fff;background-color:var(--color);box-shadow:0 0 1px #888;pointer-events:none}.roughnessSpan.svelte-1pmfqk{display:block;width:100%;height:100%;background:var(--hsl-color);clip-path:polygon(0% 100%, 0% 80%, 100% 0%, 100% 100%)}input[type='range'].svelte-1pmfqk::-moz-range-thumb{width:8px;height:100%;border:0}input[type='range'].svelte-1pmfqk::-moz-range-track{width:100%;height:100%;border:0}",
  map: null
};
const RoughnessSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $glossiness, $$unsubscribe_glossiness;
  let $hsl, $$unsubscribe_hsl;
  $$unsubscribe_glossiness = subscribe(glossiness, (value2) => $glossiness = value2);
  $$unsubscribe_hsl = subscribe(hsl, (value2) => $hsl = value2);
  let { max = 1, min = 0, step = 0.01 } = $$props;
  let value = $glossiness;
  let left, height = 100, color2, hslBackground;
  const generateStyle = (glossiness2, hsl2) => {
    const hue = hsl2.h;
    const leftPercent = glossiness2 * 100;
    const minDisplay = 20;
    const heightPercent = leftPercent < minDisplay ? minDisplay : leftPercent;
    left = `${leftPercent}%`;
    height = `${heightPercent}%`;
    color2 = `hsl(${hue}, 100%, 60%)`;
    hslBackground = `linear-gradient(90deg, 
		hsl(${hue}, 1%, 90%) 0%,  
		hsl(${hue}, 40%, 50%) ${leftPercent}%,  
		hsl(${hue}, 100%, 50%) 100%,  
		hsl(${hue}, 100%, 50%) 100%)`;
  };
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  $$result.css.add(css$6);
  set_store_value(glossiness, $glossiness = value <= 0 ? 1e-4 : value, $glossiness);
  {
    generateStyle($glossiness, $hsl);
  }
  $$unsubscribe_glossiness();
  $$unsubscribe_hsl();
  return `<div class="roughness svelte-1pmfqk"${add_styles({
    "--left": left,
    "--height": height,
    "--color": color2,
    "--hsl-color": hslBackground
  })}><span class="roughnessSpan svelte-1pmfqk" id="roughnessSpan"></span>
	<input id="roughnessSlider" name="roughnessSlider" class="roughnessSlider svelte-1pmfqk" type="range"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)} aria-label="roughness slider"${add_attribute("value", value, 0)}>
	<div id="roughnessMarker" class="roughnessMarker svelte-1pmfqk"></div>
</div>`;
});
const ColorOpenSecondaryButton_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".openSecondaryMenuButton.svelte-k6e91d{width:100%;border-radius:8px;transition:all 1.1s;transform:translateX(0)}.active.svelte-k6e91d{transform:translateX(120%)}",
  map: null
};
const ColorOpenSecondaryButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let icon;
  let { isOpen = false } = $$props;
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  $$result.css.add(css$5);
  icon = isOpen ? "close" : "play";
  return `<button class="${escape(null_to_empty(`openSecondaryMenuButton ${isOpen ? "active" : ""}`), true) + " svelte-k6e91d"}"><span class="buttonIcon">${validate_component(Icon, "Icon").$$render($$result, { class: `fa-solid fa-${icon}` }, {}, {})}</span>
</button>`;
});
const ColorInput_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".colorInput.svelte-1wyjyzi.svelte-1wyjyzi{grid-row:2;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%}.colorInputText.svelte-1wyjyzi.svelte-1wyjyzi{border-radius:20px;background-color:var(--color-bg-secondary);color:var(--color-primary);height:35px;width:70%;margin-bottom:5px;padding:0 10px;font-size:15px}.colorInputChoices.svelte-1wyjyzi.svelte-1wyjyzi{display:flex}.colorChoiceButton.svelte-1wyjyzi.svelte-1wyjyzi{background-color:var(--color-bg-secondary);color:var(--color-primary);border:1px solid var(--color-primary);width:100%;height:30px;padding:0 10px;background-color:var(--buttonColor, none);text-transform:uppercase}.colorChoiceButton-hex.svelte-1wyjyzi.svelte-1wyjyzi{text-transform:capitalize}.colorInputChoices.svelte-1wyjyzi button.svelte-1wyjyzi:first-child{border-radius:35% 0 0 35%}.colorInputChoices.svelte-1wyjyzi button.svelte-1wyjyzi:last-child{border-radius:0 35% 35% 0}",
  map: null
};
const activeButtonColor = "var(--color-bg-accent)";
const ColorInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $rgb, $$unsubscribe_rgb;
  let $hsv, $$unsubscribe_hsv;
  let $hex, $$unsubscribe_hex;
  let $hsl, $$unsubscribe_hsl;
  $$unsubscribe_rgb = subscribe(rgb, (value) => $rgb = value);
  $$unsubscribe_hsv = subscribe(hsv, (value) => $hsv = value);
  $$unsubscribe_hex = subscribe(hex, (value) => $hex = value);
  $$unsubscribe_hsl = subscribe(hsl, (value) => $hsl = value);
  let activeOption = "hsv";
  let optionText = "";
  const toPercent = (n) => Math.floor(n * 100);
  const trim = (n) => Math.floor(n);
  const colorOptions = {
    hsv: () => `hsv(${trim($hsv.h)}, ${toPercent($hsv.s)}%, ${toPercent($hsv.v)}%)`,
    hex: () => `#${$hex}`,
    rgb: () => `rgb(${trim($rgb.r)}, ${trim($rgb.g)}, ${trim($rgb.b)})`,
    hsl: () => `hsl(${trim($hsl.h)}, ${toPercent($hsl.s)}%, ${toPercent($hsl.l)}%)`
  };
  const updateOnMaterialChange = (_hsl, _hex, _hsv, _rgb) => {
    optionText = colorOptions[activeOption]();
  };
  $$result.css.add(css$4);
  {
    updateOnMaterialChange();
  }
  $$unsubscribe_rgb();
  $$unsubscribe_hsv();
  $$unsubscribe_hex();
  $$unsubscribe_hsl();
  return `<div class="colorInput svelte-1wyjyzi"><input type="text" class="colorInputText svelte-1wyjyzi"${add_attribute("value", optionText, 0)}>
	<div class="colorInputChoices svelte-1wyjyzi">${each(Object.keys(colorOptions), (option) => {
    return `<button class="${escape(null_to_empty(`colorChoiceButton colorChoiceButton-${option}`), true) + " svelte-1wyjyzi"}"${add_styles({
      "--buttonColor": activeOption === option ? activeButtonColor : null
    })}>${escape(option)}
			</button>`;
  })}</div></div>

`;
});
const ColorSwatchPreview_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "@keyframes svelte-1sqlvst-color{0%{background-color:transparent}50%{background-color:yellow}100%{background-color:transparent}}.swatch.svelte-1sqlvst{position:relative;width:40px;height:40px;padding:10px;animation:none}.swatch.highlighted.svelte-1sqlvst{animation:svelte-1sqlvst-color 0.75s 3}.swatchGlossinessBG.svelte-1sqlvst,.swatchGlossiness.svelte-1sqlvst,.swatchMetalnessBG.svelte-1sqlvst,.swatchMetalness.svelte-1sqlvst,.swatchOpacity.svelte-1sqlvst,.swatchColor.svelte-1sqlvst,.swatchDelete.svelte-1sqlvst{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);width:100%;height:100%;border-radius:100%;background-color:var(--background-color);clip-path:var(--clip-path)}.swatchOpacity.svelte-1sqlvst{width:90%;height:90%}.swatchColor.svelte-1sqlvst{width:90%;height:90%}.swatchDelete.svelte-1sqlvst{display:flex;flex-direction:column;justify-content:center}.swatchDeleteIcon{color:var(--deleteSpanColor);text-align:center;font-size:20px}",
  map: null
};
const ColorSwatchPreview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { swatch, isDeleteMode = false } = $$props;
  let highlightClass = "";
  const colors = {
    material: "",
    alpha: "",
    metal: "",
    metalBg: "",
    glossy: "",
    glossyBg: "",
    delete: ""
  };
  const clipPaths = {
    alpha: "",
    metal: "",
    metalBg: "",
    glossy: "",
    glossyBG: ""
  };
  const updateStyle = (swatch2) => {
    const { h, s, l, m: metalness2, g: glossiness2, o: opacity2 } = swatch2;
    const dullS = s / 2;
    const dullL = l / 2;
    const g = (1 - glossiness2) * 100;
    const m = (1 - metalness2) * 100;
    const o = Math.min((1 - opacity2) * 100, 90);
    colors.material = `hsl(${h}deg ${s}% ${l}%)`;
    colors.alpha = `hsl(${h}deg ${dullS}% ${dullL}%)`;
    colors.metal = `hsl(0deg 0% 60%)`;
    colors.metalBg = `hsl(0deg 0% 20%)`;
    colors.glossy = `hsl(${h}deg 100% 70%)`;
    colors.glossyBg = `hsl(${h}deg 100% 10%)`;
    clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
    clipPaths.metal = `polygon(50% ${m}%, 100% ${m}%, 100% 100%, 50% 100%)`;
    clipPaths.metalBg = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
    clipPaths.glossy = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
    clipPaths.glossyBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
  };
  const applyHighlight = () => {
    highlightClass = "";
    setInterval(() => highlightClass = "highlighted", 200);
  };
  const updateDeleteColor = (h, isDeleteMode2) => {
    if (isDeleteMode2)
      colors.delete = 300 >= h && h >= 10 ? "red" : "white";
  };
  if ($$props.swatch === void 0 && $$bindings.swatch && swatch !== void 0)
    $$bindings.swatch(swatch);
  if ($$props.isDeleteMode === void 0 && $$bindings.isDeleteMode && isDeleteMode !== void 0)
    $$bindings.isDeleteMode(isDeleteMode);
  if ($$props.applyHighlight === void 0 && $$bindings.applyHighlight && applyHighlight !== void 0)
    $$bindings.applyHighlight(applyHighlight);
  $$result.css.add(css$3);
  {
    updateStyle(swatch);
  }
  {
    updateDeleteColor(swatch.h, isDeleteMode);
  }
  return `<div class="${escape(null_to_empty(`swatch ${highlightClass}`), true) + " svelte-1sqlvst"}"><span class="swatchGlossinessBG svelte-1sqlvst"${add_styles({
    "--background-color": colors.glossyBg,
    "--clip-path": clipPaths.glossyBG
  })}></span>
	<span class="swatchMetalnessBG svelte-1sqlvst"${add_styles({
    "--background-color": colors.metalBg,
    "--clip-path": clipPaths.metalBg
  })}></span>
	<span class="swatchGlossiness svelte-1sqlvst"${add_styles({
    "--background-color": colors.glossy,
    "--clip-path": clipPaths.glossy
  })}></span>
	<span class="swatchMetalness svelte-1sqlvst"${add_styles({
    "--background-color": colors.metal,
    "--clip-path": clipPaths.metal
  })}></span>
	<span class="swatchColor svelte-1sqlvst"${add_styles({ "--background-color": colors.material })}></span>
	<span class="swatchOpacity svelte-1sqlvst"${add_styles({
    "--background-color": colors.alpha,
    "--clip-path": clipPaths.alpha
  })}></span>
	${isDeleteMode ? `<span class="swatchDelete svelte-1sqlvst"${add_styles({
    "--background-color": colors.alpha,
    "--deleteSpanColor": colors.delete
  })}>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      class: "fa-solid fa-close swatchDeleteIcon"
    },
    {},
    {}
  )}</span>` : ``}
</div>`;
});
const ColorSwatches_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".colorSwatchesSection.svelte-k8tqc1{grid-row:-3;display:flex;flex-direction:column;align-items:start;justify-content:center}.colorSwatches.svelte-k8tqc1{display:flex;flex-direction:column;align-items:center;justify-content:center}.colorSwatchSection.svelte-k8tqc1{width:90%;height:50%;display:flex;align-items:center;justify-content:start}.colorSwatchesBottom > .swatch:first-child{margin-left:15px}.colorSwatchButtons.svelte-k8tqc1{width:100%;display:flex;justify-content:space-around;margin-bottom:20px}.colorSwatchButton.svelte-k8tqc1{width:40%;height:40px;border-radius:10px;font-size:20px;background-color:var(--color-bg-accent);color:var(--color-bg-primary)}.colorSaveButtonDisabled.svelte-k8tqc1{background-color:grey}",
  map: null
};
const ColorSwatches = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_opacity;
  let $$unsubscribe_glossiness;
  let $$unsubscribe_metalness;
  let $$unsubscribe_hsl;
  $$unsubscribe_opacity = subscribe(opacity, (value) => value);
  $$unsubscribe_glossiness = subscribe(glossiness, (value) => value);
  $$unsubscribe_metalness = subscribe(metalness, (value) => value);
  $$unsubscribe_hsl = subscribe(hsl, (value) => value);
  let isDeleteMode = false;
  let defaultSwatches = [
    { h: 1, s: 50, l: 50, m: 0, g: 0, o: 0 },
    {
      h: 20,
      s: 50,
      l: 50,
      m: 0.55,
      g: 0.25,
      o: 0.5
    },
    { h: 40, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 60, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 80, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 100, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 120, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 140, s: 50, l: 50, m: 1, g: 1, o: 1 },
    { h: 160, s: 20, l: 40, m: 1, g: 1, o: 1 }
  ];
  let topSwatches = [], bottomSwatches = [], swatches = [...defaultSwatches];
  const elements = {};
  const isAtMax = () => swatches.length >= 9;
  let saveButtonClass = "";
  const updateSwatchOrder = (swatchSet) => {
    swatches = [...swatchSet];
    topSwatches.length = 0;
    bottomSwatches.length = 0;
    swatchSet.forEach((swatch, i) => {
      if (i % 2 === 0)
        topSwatches.push({ i, swatch });
      else
        bottomSwatches.push({ i, swatch });
    });
  };
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      updateSwatchOrder(swatches);
    }
    saveButtonClass = `colorSwatchButton colorSwatchSave ${isAtMax() || isDeleteMode ? "colorSaveButtonDisabled" : ""}`;
    $$rendered = `<div class="colorSwatchesSection svelte-k8tqc1"><div class="colorSwatchButtons svelte-k8tqc1"><button class="${escape(null_to_empty(saveButtonClass), true) + " svelte-k8tqc1"}">${validate_component(Icon, "Icon").$$render($$result, { class: "fa-solid fa-save" }, {}, {})}</button>
		<button class="colorSwatchButton colorSwatchTrash svelte-k8tqc1">${`${validate_component(Icon, "Icon").$$render($$result, { class: "fa-solid fa-trash" }, {}, {})}`}</button></div>
	<div class="colorSwatches svelte-k8tqc1"><div class="colorSwatchSection colorSwatchesTop svelte-k8tqc1">${each(topSwatches, ({ i, swatch }) => {
      return `${validate_component(ColorSwatchPreview, "ColorSwatchPreview").$$render(
        $$result,
        { swatch, isDeleteMode, this: elements[i] },
        {
          this: ($$value) => {
            elements[i] = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })}</div>
		<div class="colorSwatchSection colorSwatchesBottom svelte-k8tqc1">${each(bottomSwatches, ({ i, swatch }) => {
      return `${validate_component(ColorSwatchPreview, "ColorSwatchPreview").$$render(
        $$result,
        { swatch, isDeleteMode, this: elements[i] },
        {
          this: ($$value) => {
            elements[i] = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })}</div></div>
</div>`;
  } while (!$$settled);
  $$unsubscribe_opacity();
  $$unsubscribe_glossiness();
  $$unsubscribe_metalness();
  $$unsubscribe_hsl();
  return $$rendered;
});
const ColorPicker_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".colorPicker.svelte-kptsbq{width:250px;height:320px;background-color:var(--color-bg-primary);position:absolute;bottom:2%;left:0%;padding-bottom:10px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:end;transform:translateX(-100%);transition:transform 1.1s}.colorPicker.open.svelte-kptsbq{transform:translateX(10%)}.colorPickerBackground.svelte-kptsbq{width:100%;background-color:var(--color-bg-primary);height:100%;position:absolute;border-radius:16px}.colorPickerContent.svelte-kptsbq{width:200px;background-color:var(--color-bg-primary)}.colorPickerSubMenu.svelte-kptsbq{position:absolute;left:0;width:200%;height:100%;overflow:hidden;pointer-events:none}.colorPickerSub.svelte-kptsbq{position:absolute;bottom:0;width:50%;height:calc(100% - 40px);background-color:var(--color-bg-primary);border-radius:0 16px 16px 0;display:flex;align-items:center;justify-content:center;transform:translateX(0);transition:transform 1.1s;pointer-events:all}.colorPickerSub.open.svelte-kptsbq{transform:translateX(100%)}.colorPickerSubContent.svelte-kptsbq{width:100%;height:100%;display:grid;grid-template-rows:10px auto 10px auto 30px}",
  map: null
};
const ColorPicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isMenuOpen = false, isSecondaryMenuOpen = false;
  $$result.css.add(css$1);
  return `<div class="${escape(null_to_empty(`colorPicker ${""}`), true) + " svelte-kptsbq"}">${validate_component(ColorPulloutButton, "ColorPulloutButton").$$render($$result, { isOpen: isMenuOpen }, {}, {})}
	<div class="colorPickerSubMenu svelte-kptsbq"><div class="${escape(null_to_empty(`colorPickerSub ${""}`), true) + " svelte-kptsbq"}"><div class="colorPickerSubContent svelte-kptsbq">${validate_component(ColorInput, "ColorInput").$$render($$result, {}, {}, {})}
				${validate_component(ColorSwatches, "ColorSwatches").$$render($$result, {}, {}, {})}</div></div></div>
	<span class="colorPickerBackground svelte-kptsbq"></span>
	<div class="colorPickerContent svelte-kptsbq">${validate_component(ColorArea, "ColorArea").$$render($$result, {}, {}, {})}
		${validate_component(ColorHue, "ColorHue").$$render($$result, {}, {}, {})}
		${validate_component(ColorAlpha, "ColorAlpha").$$render($$result, {}, {}, {})}
		${validate_component(MetalnessSlider, "MetalnessSlider").$$render($$result, {}, {}, {})}
		${validate_component(RoughnessSlider, "RoughnessSlider").$$render($$result, {}, {}, {})}
		${validate_component(ColorOpenSecondaryButton, "ColorOpenSecondaryButton").$$render($$result, { isOpen: isSecondaryMenuOpen }, {}, {})}</div>
</div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "body{display:grid;grid-template-rows:repeat(5, auto);grid-template-areas:'header'\n			'intro'\n			'demo'\n			'outro'\n			'footer'}.firstSection.svelte-1auj6yf{grid-area:intro}.secondSection.svelte-1auj6yf{grid-area:demo}.thirdSection.svelte-1auj6yf{grid-area:outro}.firstSection.svelte-1auj6yf,.thirdSection.svelte-1auj6yf{padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center}.title.svelte-1auj6yf{font-size:2rem}.intro.svelte-1auj6yf{font-size:1.2rem}.secondSection.svelte-1auj6yf{position:relative;overflow:hidden;background-color:hsla(220, 100%, 2%, 0.2);border-radius:16px}.cta.svelte-1auj6yf{font-size:2rem}.cameraButton.svelte-1auj6yf{position:absolute;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:10rem}.cameraButton.next.svelte-1auj6yf{right:0}.cameraButton.prev.svelte-1auj6yf{left:0}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<section class="firstSection svelte-1auj6yf"><h3 class="title svelte-1auj6yf">Fidget Play Page</h3>
	<p class="intro svelte-1auj6yf">I made these fidget models in
		<a href="https://www.blender.org/">Blender</a> and added interactivity to them with
		<a href="https://threejs.org/">threeJS</a>.
	</p></section>

<section class="secondSection svelte-1auj6yf"><div class="demo">${validate_component(ThreeJsScene, "ThreeJsScene").$$render($$result, {}, {}, {})}
		<button class="cameraButton prev svelte-1auj6yf">${validate_component(Icon, "Icon").$$render($$result, { class: "fa-solid fa-angle-left" }, {}, {})}</button>
		<button class="cameraButton next svelte-1auj6yf">${validate_component(Icon, "Icon").$$render($$result, { class: "fa-solid fa-angle-right" }, {}, {})}</button>
		${validate_component(ColorPicker, "ColorPicker").$$render($$result, {}, {}, {})}
		${validate_component(AnimationStartButton, "AnimationStartButton").$$render($$result, {}, {}, {})}
		${validate_component(ZoomSlider, "ZoomSlider").$$render($$result, {}, {}, {})}</div></section>

<section class="thirdSection svelte-1auj6yf"><h3 class="cta svelte-1auj6yf">Hey, Here is a check to see if you really need that dist directory</h3>
</section>`;
});
export {
  Page as default
};
