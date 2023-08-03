import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.c64aca0c.js","_app/immutable/chunks/index.475f10b9.js","_app/immutable/chunks/index.1154dc05.js"];
export const stylesheets = ["_app/immutable/assets/2.29dec248.css"];
export const fonts = [];
