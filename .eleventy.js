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

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
    // --- css
    // eleventyConfig.addFilter('hash', function (filename) {
    //     const data = fs.readFileSync('_site/' + filename, {
    //         encoding: 'utf-8',
    //     });
    //     return getHash(data);
    // });

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
