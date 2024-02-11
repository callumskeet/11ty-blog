const ENTRY_FILE_NAME = 'main.css';

const path = require('node:path');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const postcssImport = require('postcss-import');
const postcssImportGlob = require('postcss-import-ext-glob');
const fs = require('node:fs');
const crypto = require('node:crypto');

const oldBundles = new Set();

module.exports = class {
    async data() {
        const inputPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`);
        const content = fs.readFileSync(inputPath, { encoding: 'utf-8' });
        const output = await this.process(content, {
            from: inputPath,
            to: null,
        });
        const hash = this.getHash(output.css);
        const permalink = `/css/bundle.${hash}.css`;
        this.cleanup(permalink);
        return {
            permalink,
            tags: ['css'],
            inputPath,
            content,
            hash,
            css: output.css,
        };
    }

    cleanup(newPath) {
        if (oldBundles.size) {
            for (const path of oldBundles) {
                if (path === newPath) continue;
                try {
                    fs.rmSync(`_site/${path}`);
                } catch {}
            }
        }
        oldBundles.add(newPath);
    }

    getHash(input) {
        const md5Hasher = crypto.createHmac('md5', '');
        return md5Hasher.update(input).digest('hex').slice(0, 8);
    }

    async process(content, options) {
        const output = await postcss([
            postcssImportGlob(),
            postcssImport(),
            tailwindcss(),
            autoprefixer(),
        ]).process(content, options);
        return output;
    }

    async render({ css }) {
        return css;
    }
};
