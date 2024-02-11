module.exports = function () {
    return {
        layout: 'layouts/base',
        tags: ['pages'],
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