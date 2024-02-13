const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const bookshop = require('@bookshop/eleventy-bookshop');
const bundler = require('@11ty/eleventy-plugin-bundle');
const fg = require('fast-glob');
const { LayoutTag, evalToken, assert, Context } = require('liquidjs');

const BlockMode = {
    OUTPUT: 0,
    STORE: 1,
};

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
    eleventyConfig.addLiquidTag('rendercontent', function (engine) {
        return class RenderContentTag extends LayoutTag {
            constructor(token, remainTokens, liquid) {
                const templates = [];
                let closed = false;
                while (remainTokens.length) {
                    let token = remainTokens.shift();
                    if (token.name === 'endrendercontent') {
                        closed = true;
                        break;
                    }
                    let tpl = engine.parser.parseToken(token, remainTokens);
                    templates.push(tpl);
                }
                if (!closed) {
                    throw new Error(`tag ${tagToken.getText()} not closed`);
                }
                super(token, remainTokens, liquid);
                this.templates = templates;
            }
            /**
             *
             * @param {import('liquidjs').Context} ctx
             * @param {import('liquidjs').Emitter} emitter
             */
            *render(ctx, emitter) {
                const { liquid, args, file } = this;
                const { renderer } = liquid;
                const filepath = yield this.renderFilePath(
                    this.file,
                    ctx,
                    liquid,
                );
                assert(filepath, () => `illegal file path "${filepath}"`);
                const templates = yield liquid._parseLayoutFile(
                    filepath,
                    ctx.sync,
                    this['currentFile'],
                );

                ctx.setRegister('blockMode', BlockMode.STORE);
                const html = yield renderer.renderTemplates(
                    this.templates,
                    ctx,
                );
                const blocks = ctx.getRegister('blocks');
                blocks[''] = (parent, emitter) => emitter.write(html);
                ctx.setRegister('blockMode', BlockMode.OUTPUT);

                ctx.push(yield args.render(ctx));
                yield renderer.renderTemplates(templates, ctx, emitter);
                ctx.pop();
            }

            *renderFilePath(file, ctx, liquid) {
                if (typeof file === 'string') return file;
                if (Array.isArray(file)) {
                    return liquid.renderer.renderTemplates(file, ctx);
                }
                return yield evalToken(file, ctx);
            }
        };
    });

    // --- plugins
    eleventyConfig.addPlugin(bundler, {
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
