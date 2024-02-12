const path = require('node:path');

module.exports = function () {
    return {
        layout: 'layouts/bookshop',
        tags: ['pages'],
        content_blocks: [],
        eleventyComputed: {
            permalink: function ({ page }) {
                let p = path.relative('./src/pages', this.url(page.inputPath));
                let parsed = path.parse(p);
                parsed.root = '/';
                if (parsed.name === 'index') parsed.name = '';
                return path.join(
                    parsed.root,
                    parsed.dir,
                    parsed.name,
                    path.sep,
                );
            },
        },
    };
};
