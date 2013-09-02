/**
 * Mocha Test for composer
 *
 * mocha test/composer.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 9/2/13
 * @type {Object}
 */
module.exports = {

  /**
   * Prepare Environment
   *
   */
  'udx can start composer': function() {

    var spawn = require('child_process').spawn;

    var composer = require('child_process').spawn( 'php', [ '/Users/potanin/Products/udx/bin/composer.phar', 'update' ], { stdio: 'inherit' });

    child.stderr.setEncoding('utf8');

    child.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
        console.log('Failed to start child process.');
      }
    });

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });


  }

};