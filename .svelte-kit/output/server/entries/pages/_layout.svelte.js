import { c as create_ssr_component } from "../../chunks/index2.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "header.svelte-1l9vxs5 .svelte-1l9vxs5{grid-area:header;color:var(--color-secondary)}header.svelte-1l9vxs5>ul.svelte-1l9vxs5:first-child{display:flex;align-items:center;justify-content:start}.headerItem.svelte-1l9vxs5.svelte-1l9vxs5{padding-left:40px}.social.svelte-1l9vxs5.svelte-1l9vxs5{margin-right:10px;margin-left:auto}.social.svelte-1l9vxs5 ul.svelte-1l9vxs5{display:flex;justify-content:start;align-items:center}.socialItem.svelte-1l9vxs5.svelte-1l9vxs5{padding:10px}footer.svelte-1l9vxs5.svelte-1l9vxs5{grid-area:footer}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<header class="header svelte-1l9vxs5"><ul class="headerList svelte-1l9vxs5"><a href="#" class="headerLink svelte-1l9vxs5"><li class="headerItem svelte-1l9vxs5">Home</li></a>
		<a href="#" class="headerLink svelte-1l9vxs5"><li class="headerItem svelte-1l9vxs5">Shop</li></a>
		<a href="#" class="headerLink svelte-1l9vxs5"><li class="headerItem svelte-1l9vxs5">Contact Us</li></a>
		<li class="social svelte-1l9vxs5"><ul class="socialList svelte-1l9vxs5"><li class="socialItem svelte-1l9vxs5"><a href="#" class="socialLink svelte-1l9vxs5"><i class="fab fa-facebook-f svelte-1l9vxs5"></i></a></li>
				<li class="socialItem svelte-1l9vxs5"><a href="#" class="socialLink svelte-1l9vxs5"><i class="fab fa-twitter svelte-1l9vxs5"></i></a></li>
				<li class="socialItem svelte-1l9vxs5"><a href="#" class="socialLink svelte-1l9vxs5"><i class="fab fa-instagram svelte-1l9vxs5"></i></a></li>
				<li class="socialItem svelte-1l9vxs5"><a href="#" class="socialLink svelte-1l9vxs5"><i class="fab fa-youtube svelte-1l9vxs5"></i></a></li>
				<li class="socialItem svelte-1l9vxs5"><a href="#" class="socialLink svelte-1l9vxs5"><i class="fab fa-patreon svelte-1l9vxs5"></i></a></li></ul></li></ul></header>
${slots.default ? slots.default({}) : ``}
<footer class="svelte-1l9vxs5"><div>Font made from
		<a href="http://www.onlinewebfonts.com">Online Web Fonts</a> is licensed by CC BY 3.0
	</div>
</footer>`;
});
export {
  Layout as default
};
