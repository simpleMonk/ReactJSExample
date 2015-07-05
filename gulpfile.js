"use strict";

var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var concatcss = require('gulp-concat-css');
var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var minifyCSS = require('gulp-minify-css');
var babel = require("gulp-babel");
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var multiGlob = require('multi-glob');
var watcher = require('./tasks/watcher.js');
var browserSync = require('browser-sync').create();
var rimraf = require('rimraf');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');


var config = {
	"src": "./src",
	"development": "./development",
	"dist": "./dist",
	"vendor": "./vendor",
	"vendorjs": [],
	"spec": "./spec"

};

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

gulp.task('clean-dev', function(cb) {
	clean(config.development, cb);
});

gulp.task('copy-all-files', function(cb) {
	runSequence('copy-js-files', 'copy-style', 'copy-html', 'copy-spec-files', cb);
});

gulp.task('copy-js-files', ['lint-js-files'], function() {
	var srcFiles = config.src + "/app/js/index.js";
	browserify({
		entries: srcFiles,
		extensions: ['.jsx', '.js'],
		debug: true
	})
		.transform(babelify)
		.bundle()
		.on('error', function(err) {
			gutil.log(err.message);
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied js files');
		});
});

gulp.task('copy-spec-files', ['lint-spec-files'], function() {
	var specFiles = ["./spec/**/*.js"];

	function browserifySpecCallback(files) {
		browserify({
			entries: files,
			extensions: ['.jsx', '.js'],
			debug: true
		})
			.transform(babelify)
			.bundle()
			.on('error', function(err) {
				gutil.log(err.message);
				this.emit('end');
			})
			.pipe(source('spec.js'))
			.pipe(gulp.dest(config.development + "/spec"))
			.pipe(browserSync.stream())
			.on('end', function() {
				gutil.log('successfully copied spec files');
			});
	}

	browserifyFiles(specFiles, browserifySpecCallback);
});

gulp.task('lint-js-files', function() {
	lintTask(path.join(config.src, "/app/js/**/*.{js,jsx}"))
});

gulp.task('lint-spec-files', function() {
	var lintSpecFiles = [];
	lintSpecFiles.push("!./spec/config/**");
	lintSpecFiles.push(path.join(config.src, "/app/js/**/*.{js,jsx}"));
	lintTask(lintSpecFiles);
});

gulp.task('copy-style', function() {
	var newStyles = [config.vendor, config.src].map(function(cssPath) {
		return path.join(cssPath, '/**/*.{css,scss}');
	});
	gulp.src(newStyles)
		.pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(concatcss('app.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied css files');
		})
		.on('error', function(err) {
			gutil.log(err);
		});
});

gulp.task('copy-html', function() {
	gulp.src(config.src + "/app/index.html")
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied index.html');
		})
		.on('error', function(err) {
			gutil.log(err);
		});
});

gulp.task('prepare-dev', ['clean-dev'], function(cb) {
	runSequence('copy-all-files', cb);
});

gulp.task('watch', function() {
	watcher([config.src, config.spec], function() {
		gulp.start('prepare-dev');
	});
});

gulp.task('default', function(cb) {
	browserSync.init({
		server: config.development
	});
	runSequence('prepare-dev', 'watch', cb);
});

function browserifyFiles(srcGlob, browserifyCallback) {
	multiGlob.glob(srcGlob, function(err, files) {
		browserifyCallback(files);
	});
}

function clean(globFolder, cb) {
	rimraf(globFolder, cb);
}

function lintTask(files) {
	gulp.src(files)
		.pipe(babel())
		.on('error', function(err) {
			gutil.log(err.message);
			this.emit('end');
		})
		.pipe(eslint())
		.pipe(eslint.format());
}