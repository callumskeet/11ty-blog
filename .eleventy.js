const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const fg = require('fast-glob');
const { LayoutTag, evalToken, assert, Context } = require('liquidjs');

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
    eleventyConfig.addLiquidTag('layoutcontent', function (engine) {
        return class LayoutContentTag extends LayoutTag {
            constructor(token, remainTokens, liquid) {
                const templates = [];
                let closed = false;
                while (remainTokens.length) {
                    const token = remainTokens.shift();
                    if (token.name === 'endlayoutcontent') {
                        closed = true;
                        break;
                    }
                    const tpl = engine.parser.parseToken(token, remainTokens);
                    templates.push(tpl);
                }
                if (!closed) {
                    throw new Error(`tag ${tagToken.getText()} not closed`);
                }
                super(token, [], liquid);
                this.templates = templates;
            }
        };
    });

    // --- plugins
    eleventyConfig.addPlugin(bundler, {
        hoistDuplicateBundlesFor: ['css', 'js'],
        transforms: [
            async function (content) {
                if (this.type === 'css') {
                    content = content.replaceAll(/<\/?style>/gi, '');
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
