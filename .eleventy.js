const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const fg = require('fast-glob');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    eleventyConfig.addLiquidTag('renderGlob', function (liquidEngine) {
        return {
            parse: function (tagToken, _remainingTokens) {
                this.glob = tagToken.args;
            },
            render: async function (scope, _hash) {
                const roots = liquidEngine.options.root;
                const glob = await this.liquid.evalValue(this.glob, scope);
                const paths = await Promise.all(
                    roots.map((root) => fg(glob, { cwd: root })),
                );
                const flattened = paths.flatMap((x) => x);
                return Promise.all(
                    flattened.map((x) => liquidEngine.renderFile(x, scope)),
                );
            },
        };
    });

    // --- plugins
    eleventyConfig.addPlugin(bundler, {
        transforms: [
            async function (content) {
                if (this.type === 'css') {
                    const output = await postcss([
                        tailwindcss(),
                        autoprefixer(),
                    ]).process(content, { from: undefined });
                    return output.css;
                }
                return content;
            },
        ],
    });
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
