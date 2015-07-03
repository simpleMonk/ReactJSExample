var bs = require('browser-sync');
var chalk = require('chalk');
var http = require('http');


function Reload(dir, options) {
  var bsInstance = bs.create();
  var PROXY_SERVER = 'http://localhost:4200/';

  bsInstance.init({
    proxy:PROXY_SERVER,
    browser: "google chrome"
  });

  return {
    read: function() {
      console.log(chalk.styles.red.open + 'Reloading....' + chalk.styles.red.close);
      bsInstance.reload();
      return dir;
    },
    cleanup: function() {
      bsInstance.exit();
    }
  };
}

module.exports = Reload;
