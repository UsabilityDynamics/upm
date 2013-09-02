#!/usr/bin/env node

/**
 * Binary Constructor
 *
 * @constructor
 */
function Interface () {

  // Private Properties.
  var udx = require( '../' ).start();
  var auto = require( 'auto' );
  var extend = require( 'extend' );
  var realpath = require( 'fs' ).realpathSync;
  var exists = require( 'fs' ).existsSync;
  var dirname = require( 'path' ).dirname;
  var basename = require( 'path' ).basename;
  var Builder = require( 'component-builder' );
  var resolve = require.resolve;
  var program = require( 'commander' );
  var component = require( 'component' );
  var Package = require('component/lib/Package');
  var utils = component.utils;
  var path = require( 'path' );
  var fs = require( 'fs' );
  var join = path.join;
  var read = fs.readFileSync;
  var readdir = fs.readdirSync;
  var mkdir = require( 'mkdirp' ).sync;
  //var readme = require('../readme.md');
  var log = component.utils.log;

  udx.on( 'prompt::scaffolding', function scaffolding () {

    udx.set( 'cwd', process.cwd );
    udx.set( 'type', type );

    // Initialize Scaffolding Constructor.
    udx.Scaffold.call( udx );

  } )

  var pkg = new Package( 'UsabilityDynamics/wp-libs', 'master', {
    force: false,
    dev: false,
    remotes: [ "https://raw.github.com" ],
    concurrency: 10
  });

  pkg.install();

  try {
    //var path = resolve( process.cwd() + '/component.json' );
  } catch( error ) {
    //fs.writeFileSync(process.cwd() + '/component.json', JSON.stringify( pkg, null, 2));
  }

  program.name = 'thing';
  program.out = 'your-mother';

  setTimeout( function() {

    var jsPath = path.join(program.out, program.name + '.js');
    var cssPath = path.join(program.out, program.name + '.css');

    console.log( 'building', jsPath );

    var builder = new Builder(process.cwd());

    var start = new Date;

    builder.build(function(err, obj){

      if (err) utils.fatal(err.message);
      var js = '';
      var css = obj.css.trim();

      console.log( require( 'util' ).inspect( err || obj, { showHidden: true, colors: true, depth: 2 } ) )

      if (obj.js.trim()) {
        var name = 'string' == typeof standalone
          ? standalone
          : conf.name;

        if (standalone) js += ';(function(){\n';
        if (program.require) js += obj.require;
        js += obj.js;

        if (standalone) {
          var umd = [
            'if (typeof exports == "object") {',
            '  module.exports = require("' + conf.name + '");',
            '} else if (typeof define == "function" && define.amd) {',
            '  define(function(){ return require("' + conf.name + '"); });',
            '} else {',
            '  this["' + name + '"] = require("' + conf.name + '");',
            '}'
          ];

          js += umd.join('\n');
          js += '})();';
        }
      }

      // css
      if (css) fs.writeFile(cssPath, css);

      // js
      if (js) fs.writeFile(jsPath, js);

      var duration = new Date - start;

      log('write', jsPath);
      log('write', cssPath);

      if (js) log('js', (js.length / 1024 | 0) + 'kb');
      if (css) log('css', (css.length / 1024 | 0) + 'kb');

      log('duration', duration + 'ms');

      console.log();

    });

  }, 4000 )

}

// Instantiate.
module.exports = new Interface;

