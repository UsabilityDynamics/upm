/**
 * Generates / Compiles components.
 *
 */
function Builder( options ) {

  if( !(this instanceof Builder ) ) {
    return new Builder( options );
  }

  var upm = require( '../upm' );
  var extend = require( 'extend' );
  var path = require( 'path' );
  var fs = require( 'fs' );
  var exists = fs.existsSync || path.existsSync;
  var mkdir = require( 'mkdirp' )

  // Update composer.json with defaults.
  options = extend({
    directory: process.cwd(),
    name: 'build',
    out: 'build',
    require: false,
    prefix: null
  }, options );

  // Override Builder prototype.
  Object.defineProperties( this.__super.prototype, {
    json: {
      value: Builder.prototype.json,
      enumerable: true
    },
    build: {
      value: Builder.prototype.build,
      enumerable: true
    },
  });

  // Create builder instance.
  var builder = new this.__super( options.directory );

  require( 'object-emitter' ).mixin( builder );
  require( 'object-settings' ).mixin( builder );

  // Add custom properties.
  extend( builder.config, {
    namespace: Builder.utility.get_namespace( builder.config )
  });

  process.nextTick( function() {
    builder.emit( 'message', 'Starting builder.' );

    builder.use( require( './handlers/php' ) );
    builder.use( require( './handlers/less' ) );
    builder.use( require( './handlers/js' ) );

    builder.build( function( err, obj ) {
      builder.emit( 'message', 'Build complete.' );
    });

  });

  return builder;

}

Object.defineProperties( Builder.prototype, {
  json: {
    /**
     * Return the configuration JSON.
     *
     * @return {Object}
     * @api public
     */
    value: function json() {
      var fs  = require( 'fs' );
      var read = fs.readFileSync;
      var path = this.path( 'component.json' ) || this.path( 'package.json' ) || this.path( 'composer.json' );
      var str = read( path, 'utf8' );

      try {
        var obj = JSON.parse( str );
      } catch( err ) {
        err.message += ' in ' + path;
        throw err;
      }

      if( obj.main ) {
        obj.main = obj.main.replace( /^\.\//, '' );
      }

      return obj;

    },
    enumerable: true
  },
  build: {
    value: function build( fn ) {
      this.emit( 'message', 'Building.' );

      var self = this;
      var Batch = require( 'batch' );
      var batch = new Batch;

      batch.push( this.buildScripts.bind( this ) );
      batch.push( this.buildTemplates.bind( this ) );
      batch.push( this.buildAliases.bind( this ) );
      batch.push( this.buildStyles.bind( this ) );
      batch.push( this.buildImages.bind( this ) );
      batch.push( this.buildFonts.bind( this ) );
      batch.push( this.buildFiles.bind( this ) );
      batch.end( function( err, res ) {

        if( err ) {
          return fn( err );
        }

        var scripts = res.shift();
        var require = res.shift();
        var templates = res.shift();
        var custom = self._js;
        var js = [scripts, require, templates, custom].filter( empty ).join( '\n' )

        fn( null, {
          js: js,
          css: res.shift(),
          images: res.shift(),
          fonts: res.shift(),
          files: res.shift(),
          require: requirejs
        } );
      } );

    },
    enumerable: true
  },
  __super: {
    value: require( 'component-builder' ),
    enumerable: false
  }
});

Object.defineProperties( module.exports = Builder, {
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
});

// builder.addLookup( 'lib' );
// builder.addFile('scripts', 'view.js', 'compiled view js');
// builder.prefixUrls( options.prefix );
// builder.copyAssetsTo( options.out );

