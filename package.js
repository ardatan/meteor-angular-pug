Package.describe({
  name: "ardatan:angular-pug",
  summary: "Jade templating for Meteor-Angular",
  version: "0.0.4",
  git: "https://github.com/ardatan/meteor-angular-pug.git"
});

Package.registerBuildPlugin({
  name: "compilePugAngular",
  sources: [
    'plugin.js'
  ],
  npmDependencies : {
    'html-minifier': '0.7.2',
    'pug': '2.0.4'
  }
});

Package.onUse(function (api) {
  api.use("isobuild:compiler-plugin@1.0.0");
});