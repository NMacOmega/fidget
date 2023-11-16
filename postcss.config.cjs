const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssMixins = require('postcss-mixins');

const config = {
	plugins: [
		postcssCustomMedia,
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		postcssMixins,
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;
