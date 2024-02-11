const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const fg = require('fast-glob');

async function processCss(content, options = {}) {
    const output = await postcss([tailwindcss(), autoprefixer()]).process(
        content,
        options,
    );
    return output.css;
}

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    // --- css
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(bundler, {
        transforms: [
            async function (content) {
                if (this.type === 'css') {
                    return processCss(content, { from: this.page.inputPath });
                }
                return content;
            },
        ],
    });

    // --- bookshop
    eleventyConfig.addPlugin(
        bookshop({
            bookshopLocations: ['src/_includes'],
        }),
    );

    return {
        dir: {
            input: 'src',
        },
    };
};
