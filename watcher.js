var chokidar = require('chokidar');
var exec = require('child_process').exec;
var glob = require("glob");

var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
	useEslintrc: true
});

// One-liner for current directory, ignores .dotfiles
var filePath = ['./src/app/js/', './spec/', './e2e/'];
var listOfFiles = filePath.map(function(path) {
	return path + "**/*.js";
});


var watcher = chokidar.watch(filePath, {
	ignored: /[\/\\]\./,
	persistent: true,
	ignoreInitial: false
});

watcher
	.on('change', executeEsLint);

function executeEsLint() {
	glob("{src,spec,e2e}/**/*.js", {}, function(er, files) {
		var report = cli.executeOnFiles(files);
		var formatter = cli.getFormatter();
		console.log(formatter(report.results));
	});
}

executeEsLint();
