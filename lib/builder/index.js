/**
 * Generates / Compiles components.
 *
 */
function Builder( options ) {

  var upm       = require( '../upm' );
  var extend    = require( 'extend' );
  var path      = require( 'path' );
  var fs        = require( 'fs' );
  var mkdir     = require( 'mkdirp' );
  var exists    = fs.existsSync || path.existsSync;

  // Update builder.configig with defaults.
  options = extend({
    directory: process.cwd(),
    name: 'build',
    out: 'build',
    require: false,
    prefix: null
  }, options );

  // Create builder instance.
  var builder = new Builder.__super( options.directory );

  // builder.addLookup( 'lib' );
  // builder.addFile('scripts', 'view.js', 'compiled view js');

  builder.use( require( 'component-markdown' ) );
  builder.use( require( 'component-uglifyjs' ) );
  builder.use( require( 'component-less' ) );

  if( options.prefix ) {
    builder.prefixUrls( options.prefix );
  }

  builder.copyAssetsTo( options.out );

  var standalone = true;
  var jsPath = path.join( options.out, options.name + '.js' );
  var cssPath = path.join( options.out, options.name + '.css' );

  builder.hook('before scripts', function( builder ) {
    Builder.debug( 'before scripts' );
  });

  /**
   *
   * obj includes
   *  js
   *  css
   *  images
   *  fonts
   *  files
   *
   */
  builder.build( function( err, obj ) {

    //console.log( require( 'util' ).inspect( obj.files, { showHidden: false, colors: true, depth: 3 } ) )

    if( !obj ) {
      console.log( require( 'util' ).inspect( obj, { showHidden: true, colors: true, depth: 2 } ) )
      return;
    }

    var js    = obj.js.trim();
    var css   = obj.css.trim();

    if (obj.js.trim()) {
      var name = 'string' == typeof standalone ? standalone : builder.config.name;

      if (standalone) js += ';(function(){\n';

      if (options.require) js += obj.require;
      js += obj.js;

      if (standalone) {
        var umd = [
          'if (typeof exports == "object") {',
          '  module.exports = require("' + builder.config.name + '");',
          '} else if (typeof define == "function" && define.amd) {',
          '  define(function(){ return require("' + builder.config.name + '"); });',
          '} else {',
          '  this["' + name + '"] = require("' + builder.config.name + '");',
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

  });


  return builder;

}

Object.defineProperties( module.exports = Builder, {
  __super: {
    value: require( 'component-builder' ),
    enumerable: false
  },
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    configurable: true
  },
  debug: {
    value: require( 'debug' )( 'upm:builder' ),
    enumerable: true,
    configurable: true
  }
})



