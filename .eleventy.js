const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    // --- css
    eleventyConfig.addTemplateFormats('css');
    eleventyConfig.addExtension('css', {
        outputFileExtension: 'css',
        compile: (content, path) => {
            return async () => {
                const output = await postcss([
                    tailwindcss(),
                    autoprefixer(),
                ]).process(content, { from: path });
                return output.css;
            };
        },
    });
    return {
        dir: {
            input: 'src',
        },
    };
};
