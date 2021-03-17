const fs = require('fs');
const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginSEO = require("eleventy-plugin-seo");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginSEO, require("./site/_data/seo.json"));

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPassthroughCopy({ 'site/_static/css': 'static/css' });
  eleventyConfig.addPassthroughCopy({ 'site/_static/images': 'static/images' });
  eleventyConfig.addPassthroughCopy({ 'site/_static/js': 'static/js' });

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('docs/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  // Filters
  eleventyConfig.addFilter('artSpotlightFilter', function(collection) {
      return collection.find(item => item.data.spotlight === true)
  });

  eleventyConfig.addFilter('getAmount', function(collection, amount) {
    if (amount === undefined || amount === null) {
      return collection;
    }
    return collection.slice(0, amount);
  });

  return {
    dir: {
      input: "site",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: "/11tyio-boilerplate",
    templateFormats: ["html", "liquid", "md", "njk"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
}