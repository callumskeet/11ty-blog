const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const postcssImport = require('postcss-import');
const postcssImportGlob = require('postcss-import-ext-glob');
const fs = require('node:fs');
const crypto = require('node:crypto');
const fg = require('fast-glob');
const path = require('node:path');

/** @returns {Promise<import('postcss').Result>} output */
async function processCss(content, options = {}) {
    const output = await postcss([
        postcssImportGlob(),
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
    ]).process(content, options);
    return output;
}

function getHash(input) {
    const secret = 'SALT';
    const md5Hasher = crypto.createHmac('md5', secret);
    return md5Hasher.update(input).digest('hex');
}

Object.assign(Promise, {
    allFlat(array) {
        return Promise.all(array).then((res) => res.flatMap((x) => x));
    },
});

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    // --- css
    eleventyConfig.addAsyncFilter('postcss', async function (css) {
        const output = await postcss([tailwindcss(), autoprefixer()]).process(
            css,
        );
        return output.css;
    });

    eleventyConfig.addLiquidTag('renderall', function (liquidEngine) {
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
    eleventyConfig.addPlugin(bundler);
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
