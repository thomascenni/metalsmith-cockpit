var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var remote = require('metalsmith-remote-json-to-files');
var tags = require('metalsmith-tags');
var categories = require('metalsmith-tags');

var COKPIT_POSTS_URL = process.env.COKPIT_POSTS_URL;
if (COKPIT_POSTS_URL == null || COKPIT_POSTS_URL.length === 0) {
    COKPIT_POSTS_URL = 'https://raw.githubusercontent.com/thomascenni/metalsmith-cockpit-fake-data/master/data.json';
    console.log("COKPIT_POSTS_URL is not set, using fake data " + COKPIT_POSTS_URL);
}

function getPosts(json) {
    var entries = json.entries;
    const formatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return entries.reduce((prev, item) => {
        var slug = item.title_slug;
        const filename = `posts/${ slug }.md`
        return Object.assign(prev, {
            [filename]: {
                layout: 'post.njk',
                collection: 'posts',
                title: item.title,
                slug: slug,
                tags: item.tags,
                category: item.category,
                date: new Date(item.date),
                dateString: new Date(item.date).toLocaleDateString('en', formatOptions),
                contents: item.content
            }
        })
    }, {})
}

Metalsmith(__dirname)
    .source('src')
    .destination('build')
    .clean(true)
    .use(remote({
        url: COKPIT_POSTS_URL,
        transformOpts: getPosts
    }))
    .use(collections({
        posts: {
            pattern: 'posts/**/*.md',
            sortBy: 'date',
            reverse: true,
            refer: false
        }
    }))
    .use(markdown())
    .use(tags({
        // yaml key for tag list in you pages
        handle: 'tags',
        // path for result pages
        path: 'tag/:tag.html',
        // layout to use for tag listing
        layout: 'tag.njk',
        // Normalize special characters like ØçßÜ to their ASCII equivalents ocssü
        // makes use of the value assigned to the 'slug' property below
        normalize: true,
        // provide posts sorted by 'date' (optional)
        sortBy: 'date',
        // sort direction (optional)
        reverse: true,
        // skip updating metalsmith's metadata object.
        // useful for improving performance on large blogs
        // (optional)
        skipMetadata: false,
        // Use a non-default key in the metadata. Useful if you you want to
        // have two sets of tags in different sets with metalsmith-branch.
        metadataKey: "tags",
        // Any options you want to pass to the [slug](https://github.com/dodo/node-slug) package.
        // Can also supply a custom slug function.
        // slug: function(tag) { return tag.toLowerCase() }
        slug: {
            mode: 'rfc3986'
        }
    }))
    .use(categories({
        handle: 'category',
        path: 'category/:tag.html',
        layout: 'category.njk',
        normalize: true,
        sortBy: 'date',
        reverse: true,
        skipMetadata: false,
        metadataKey: "categories",
        slug: {
            mode: 'rfc3986'
        }
    }))
    .use(layouts({
        "default": "page.njk"
    }))
    .use(permalinks({}))
    .build(function (err) {
        if (err) throw err;
    });
