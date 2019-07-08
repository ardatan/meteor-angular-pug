const minify = Npm.require('html-minifier').minify;
const pug = Npm.require('pug');

Plugin.registerCompiler({
  extensions: ['ng.jade', 'ng.pug'],
  archMatching: 'web'
}, function() {
    return {
        processFilesForTarget(inputFiles) {
            for (const inputFile of inputFiles) {
              if (inputFile.supportsLazyCompilation) {
                inputFile.addJavaScript({
                  path: inputFile.getPathInPackage(),
                  hash: inputFile.getSourceHash(),
                }, () => this.processOneFileForTarget(inputFile));
              } else {
                const toBeAdded = this.processOneFileForTarget(inputFile);
                if (toBeAdded) {
                  inputFile.addJavaScript(toBeAdded);
                }
              }
            }
        },
        processOneFileForTarget(inputFile) {
          let contents = inputFile.getContentsAsString();
          const pugOpts = { pretty:true, compileDebug:false };
          pugOpts.filename = inputFile.getBasename();
          contents = pug.compile(contents, pugOpts)();

          let newPath = inputFile.getPathInPackage();
          newPath = newPath.replace(/\\/g, "/");
          newPath = newPath.replace(".ng.jade", ".html");
          newPath = newPath.replace(".ng.pug", ".html");

          const data = 'angular.module(\'ng\').run([\'$templateCache\', function($templateCache) {' +
              '$templateCache.put(\'' + newPath + '\', \'' +
              minify(contents.replace(/'/g, "\\'"), {
                  collapseWhitespace : true,
                  conservativeCollapse : true,
                  removeComments : true,
                  minifyJS : true,
                  minifyCSS: true,
                  processScripts : ['text/ng-template']
              }) + '\');' +
              '}]);'.replace(/\n/g, '\\n');

          return {
            path : newPath,
            hash: inputFile.getSourceHash(),
            sourcePath : inputFile.getPathInPackage(),
            data
          };
        }
    }
});
