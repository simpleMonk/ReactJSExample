"use strict";

var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
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


var config = require('./tasks/config.js');
var clean = require('./tasks/clean.js').clean;
var watcher = require('./tasks/watcher.js');
require('./tasks/webserver.js');

gulp.task('clean-dev', function(cb) {
	clean(config.development, cb);
});

gulp.task('copy-all-files', function(cb) {
	runSequence('copy-js-files', 'copy-style', 'copy-html', 'copy-spec-files', cb);
});

gulp.task('copy-js-files', ['lint-js-files'], function() {
	var srcFiles = config.vendorjs;
	srcFiles.push(config.src + "/app/js/basic/index.jsx");

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
		.pipe(connect.reload())
		.on('end', function() {
			gutil.log('successfully copied js files');
		});
});

gulp.task('copy-spec-files', ['lint-spec-files', 'copy-fixtures'], function() {

	var specFiles = [];
	specFiles.push("./spec/**/*.js");
	specFiles.push("./spec/**/*.jsx");

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
			.pipe(connect.reload())
			.on('end', function() {
				gutil.log('successfully copied spec files');
			});
	};

	browserifyFiles(specFiles, browserifySpecCallback);
});

gulp.task('lint-js-files', function() {
	gulp.src(config.src + "/app/js/**/*.{js,jsx}")
		.pipe(babel())
		.on('error', function(err) {
			gutil.log(err.message);
			this.emit('end');
		})
		.pipe(eslint())
		.pipe(eslint.format());

});

gulp.task('lint-spec-files', function() {
	var lintSpecFiles = [];
	lintSpecFiles.push(config.src + "/app/**/*.{js,jsx}");
	lintSpecFiles.push("!./spec/config/**");
	lintSpecFiles.push(config.spec + "/**/*.{js,jsx}");

	gulp.src(lintSpecFiles)
		.pipe(babel())
		.on('error', function(err) {
			gutil.log(err.message);
			this.emit('end');
		})
		.pipe(eslint())
		.pipe(eslint.format());

});

gulp.task('copy-style', function() {
	var styleFiles = [];
	styleFiles.push(config.vendor + "/**/*.scss");
	styleFiles.push(config.vendor + "/**/*.css");
	styleFiles.push(config.src + "/**/*.scss");
	styleFiles.push(config.src + "/**/*.css");

	gulp.src(styleFiles)
		.pipe(sass())
		.pipe(concatcss('app.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.development))
		.pipe(connect.reload())
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
		.pipe(connect.reload())
		.on('end', function() {
			gutil.log('successfully copied index.html');
		})
		.on('error', function(err) {
			gutil.log(err);
		});
});

gulp.task('copy-fixtures', function() {
	gulp.src(config.spec + "/**/*.html")
		.pipe(gulp.dest(config.development + "/spec"))
		.pipe(connect.reload())
		.on('end', function() {
			gutil.log('successfully copied fixtures');
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
	runSequence('prepare-dev', 'watch', 'run-dev-server', cb);
});

function browserifyFiles(srcGlob, browserifyCallback) {
	multiGlob.glob(srcGlob, function(err, files) {
		browserifyCallback(files);
	});
};
