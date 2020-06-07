# metalsmith-cockpit

## Introduction

The idea behind this example is to generate a static blog site with [Metalsmith](https://metalsmith.io/) using posts data defined in [Cockpit](https://getcockpit.com/).

The plugin [metalsmith-remote-json-to-files](https://github.com/okonet/metalsmith-remote-json-to-files) is used to fetch JSON data from Cockpit, transform and inject as files into metalsmith pipeline.

Cockpit is a great open source tool that allows non technical people to write content in a WYSIWYG way.

## Instructions:

```
npm install
npm run start
```

This will install all the dependencies and will generate in the build directory the static HTML files.

The command looks for an environment variable called **COKPIT_POSTS_URL**; if this variable is not found or is empty, some default fake data will be used.

Once you have your [Cockpit](https://getcockpit.com/) installation running, define a [Collection](https://getcockpit.com/documentation/modules/collections) for the posts (for example, Post); the Fields I used are pretty standard for a post:



- Title

- Date
- Language

- Category

- Image

- Excerpt

- Content

- Tags

- Published



Now you can define the environment variable COKPIT_POSTS_URL to point to your installation.

For example, if your domain is *example.com* and your collection is named *Post*, the variable can be defined as:



COKPIT_POSTS_URL=https://example.com/api/collections/get/Post



Probably your data will be private, so you'll define an API Token (TOKEN) with Cockpit installation; also, you'll want to publish only posts that have the published flag as true:



COKPIT_POSTS_URL=https://example.com/api/collections/get/Post?token=TOKEN&filter%5Bpublished%5D=true



You can then deploy your static website to [Netlify](https://www.netlify.com/).
