const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const { EleventyRenderPlugin } = require('@11ty/eleventy');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(bundler, {
        transforms: [
            async function (content) {
                if (this.type === 'css') {
                    const output = await postcss([
                        tailwindcss(),
                        autoprefixer(),
                    ]).process(content);
                    return output.css;
                }
                return content;
            },
        ],
    });

    // --- bookshop
    eleventyConfig.addPlugin(
        bookshop({
            bookshopLocations: ['src/_includes/components'],
        }),
    );

    return {
        dir: {
            input: 'src',
        },
    };
};
