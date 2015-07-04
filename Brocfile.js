var esTranspiler = require('broccoli-babel-transpiler');
var pickFiles = require('broccoli-static-compiler');
var merge = require('broccoli-merge-trees');
var browserify = require('broccoli-browserify');
var compileSass = require('broccoli-sass');
var concat = require('broccoli-concat');
var fastBrowserify = require('broccoli-fast-browserify');
var autoprefixer = require('broccoli-autoprefixer');
var cleanCSS = require('broccoli-clean-css');


var path = {
	source_base: './src/app',
	source_js: './src/app/js',
	source_style: './src/app/style',
	spec: './spec',
	vendor_js: './src/vendor/js',
	vendor_style: './src/vendor/style',
	dev_base: '/',
	dev_spec: '/spec'
};


var scripts = esTranspiler(path.source_js, {
	filterExtensions: ['js', 'es6', 'jsx']
});
scripts = getfastBrowserify(scripts, 'bundle.js', 'basic/index.js', false);


var spec = merge([path.source_js, path.spec]);
spec = esTranspiler(spec, {
	filterExtensions: ['js', 'es6', 'jsx']
});
spec = getfastBrowserify(spec, 'spec/spec.js', 'basic.spec.js', false);

var html = pickFiles(path.source_base, {
	srcDir: '/',
	files: ['index.html'],
	destDir: path.dev_base
});

var appStyles = compileSass([path.source_style], 'app.scss', 'app.css');
appStyles = autoprefixer(appStyles, {});
appStyles = cleanCSS(appStyles);

var vendorStyle = concat(path.vendor_style, {
	inputFiles: [
		'*.css'
	],
	outputFile: '/vendor.css',
	separator: '\n' // (optional, defaults to \n)
});

function getfastBrowserify(files, bundleFileName, entryFile, debug) {
	var bundleFile = {};
	bundleFile[bundleFileName] = {
		entryPoints: [entryFile]
	};

	return fastBrowserify(files, {
		bundles: bundleFile,
		browserify: {
			debug: debug
		}

	});
}

module.exports = merge([html, scripts, spec, appStyles, vendorStyle]);
