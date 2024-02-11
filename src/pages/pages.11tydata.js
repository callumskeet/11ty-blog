module.exports = function () {
    return {
        layout: 'layouts/bookshop',
        tags: ['pages'],
        content_blocks: [],
        eleventyComputed: {
            permalink: function ({ page }) {
                return (
                    this.url(page.filePathStem)
                        .replace('/index', '/')
                        .replace('/pages/', '/') + '/'
                );
            },
        },
    };
};
