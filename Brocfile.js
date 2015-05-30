var esTranspiler = require('broccoli-babel-transpiler');
var pickFiles = require('broccoli-static-compiler');
var merge = require('broccoli-merge-trees');
var browserify = require('broccoli-browserify');
var compileSass = require('broccoli-sass');
var concat = require('broccoli-concat');
var fastBrowserify = require('broccoli-fast-browserify');
var eslint = require('broccoli-lint-eslint');
var broccoliTestem = require('broccoli-testem-plugin')

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

var entryFile = 'basic/index.js';
scripts = fastBrowserify(scripts, {

	bundles: {
		'bundle.js': {
			entryPoints: [entryFile]
		}
	},
	browserify: {
		debug: true
	}

});


var spec = merge([path.source_js, path.spec])
spec = esTranspiler(spec, {
	filterExtensions: ['js', 'es6', 'jsx']
});

var runTests = broccoliTestem(path.spec, {
	src_files: [path.source_js] // Files paths are relative to input tree
	// Here any testem options
});

spec = fastBrowserify(spec, {
	bundles: {
		'spec/spec.js': {
			entryPoints: ['basic.spec.js']
		}
	},
	browserify: {
		debug: true
	}

});

var html = pickFiles(path.source_base, {
	srcDir: '/',
	files: ['index.html'],
	destDir: path.dev_base
});

var appStyles = compileSass([path.source_style], 'app.scss', 'app.css');

var vendorStyle = concat(path.vendor_style, {
	inputFiles: [
		'*.css'
	],
	outputFile: '/vendor.css',
	separator: '\n' // (optional, defaults to \n)
});


module.exports = merge([html,scripts, spec, appStyles, vendorStyle,runTests]);
