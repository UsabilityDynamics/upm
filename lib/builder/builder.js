/**
 * Compiles components and outputs built files into target directories.
 *
 *
 *    builder.addLookup( 'lib' );
 *    builder.addFile('scripts', 'view.js', 'compiled view js');
 *    builder.prefixUrls( options.prefix );
 *    builder.copyAssetsTo( options.out );
 *
 */
function Builder( options ) {

  if( !(this instanceof Builder ) ) {
    return new Builder( options );
  }

  var resolve = require( 'path' ).resolve;
  var extend = require( 'extend' );
  var path = require( 'path' );
  var schema = require( '../../static/schemas/component.json' )

  // Override Component Configuration
  options = extend( {
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
    buildLibs: {
      value: Builder.prototype.buildLibs,
      enumerable: true
    },
    buildSchemas: {
      value: Builder.prototype.buildSchemas,
      enumerable: true
    },
    buildAsset: {
      value: Builder.prototype.buildAsset,
      enumerable: true
    },
    build: {
      value: Builder.prototype.build,
      enumerable: true
    },
  } );

  // Create builder instance.
  var builder = new this.__super( options.directory );

  // Mixing better EventEmitter.
  require( 'object-emitter' ).mixin( builder );

  // Add Type Support
  extend( builder, {
    lookupPaths: builder.lookupPaths || [],
    assetsDest: builder.assetsDest || resolve( './temp' ),
    ignored: {
      scripts: [],
      styles: [],
      files: [],
      images: [],
      fonts: [],
      templates: [],
      libs: [],
      schemas: []
    }
  });

  console.log( require( 'util' ).inspect( builder, { showHidden: false, colors: true, depth: 2 } ) )

    // Set config defaults.
  extend( builder.config, {
    config: {
      "out": "./components",
      namespace: builder.config.config && builder.config.config['namespace'] ? builder.config.config['namespace'] : Builder.utility.get_namespace( builder.config ),
      basename: "build"
    },
    build: {
      libs: {
        out: "./build/vendor",
        settings: {
          "autoload": true
        }
      },
      schemas: {
        out: "./build/schemas",
        settings: {}
      },
      scripts: {
        out: "./build/scripts",
        settings: {
          "minify": true
        }
      },
      styles: {
        out: "./build/styles",
        settings: {
          "minify": true
        }
      },
      templates: {
        out: "./build/templates",
        settings: {}
      }
    }
  } );

  process.nextTick( function() {
    builder.emit( 'message', 'Starting to compile [%s] project.', builder.config.name );

    builder.build( function( error, obj ) {

      // Special Handlers
      // builder.use( require( './handlers/libs' ) );
      // builder.use( require( './handlers/scripts' ) );
      // builder.use( require( './handlers/schemas' ) );
      // builder.use( require( './handlers/fonts' ) );
      // builder.use( require( './handlers/styles' ) );

      if( error ) {
        return builder.emit( 'error', 'Fatail error during [%s] build: [%s].', builder.config.name, error.message );
      } else {
        builder.emit( 'message', 'Build of [%s] complete.', builder.config.name );
      }

    } );

  });

  return builder;

}

/**
 * Instance Properties.
 *
 */
Object.defineProperties( Builder.prototype, {
  buildAsset: {
    /**
     * Build asset `type` and invoke `fn(err, paths)`.
     *
     * @param {String} type
     * @param {Function} fn
     * @api private
     */
    value: function buildAsset( type, fn ) {
      var Batch = require( 'batch' );
      var self = this;
      var conf = this.config;
      var batch = new Batch;

      function normalize( name ) {
        return name.replace( '/', '-' );
      }

      // self.emit( 'message', 'Prepare asset [%s] for building.', type );

      // Build dependencies.
      if( self.hasDependencies() ) {

        Object.keys( self.dependencies() ).forEach( function( dep ) {
          dep = normalize( dep );

          // ignored
          if( self.ignoring( dep, type ) ) {
            return self.emit( 'ignoring %s', dep );
          }

          // ignore it so we dont have dups
          self.ignore( dep, type );

          // lookup dep
          batch.push( function( done ) {
            self.lookup( dep, function( err, dir ) {
              if( err ) {
                return done( err );
              }
              var builder = new Builder( dir, self );
              self.emit( 'dependency', builder );
              builder.buildAsset( type, done );
            } );
          } );
        } );
      }

      // copy assets
      if( conf[type] ) {

        conf[type].forEach( function( file ) {
          var path = self.path( file );
          var name = normalize( self.basename );
          var dest = join( self.assetsDest, name, file );
          batch.push( function( done ) {
            self.copyTo( path, dest, done );
          } );
        } );
      }

      batch.end( function( err, res ) {

        if( err ) {
          return fn( err );
        }
        fn( null, res );
      } );

    },
    enumerable: true
  },
  json: {
    /**
     * Return the configuration JSON.
     *
     * @return {Object}
     * @api public
     */
    value: function json() {
      var fs = require( 'fs' );
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
  buildLibs: {
    /**
     * buildLibs.
     *
     * @return {Object}
     * @api public
     */
    value: function buildLibs( fn ) {
      // Must use buildType and not buildAsset, don't know why really
      this.buildType( 'libs', fn );
    },
    enumerable: true
  },
  buildSchemas: {
    /**
     * buildSchemas.
     *
     * @return {Object}
     * @api public
     */
    value: function buildSchemas( fn ) {
      this.buildType( 'schemas', fn );
    },
    enumerable: true
  },
  build: {
    /**
     * Build and invoke `fn(err, res)`, where `res`
     * is an object containing:
     *
     *  - `css`
     *  - `js`
     *  - `images`
     *  - `fonts`
     *  - `files`
     *
     * NOTE: Batch maintains result ordering (res.shift()s here)
     *
     * @param {Function} fn
     * @api public
     */
    value: function build( fn ) {
      // this.emit( 'message', 'Building.' );

      function empty( s ) {
        return '' != s;
      }

      var builder = this;
      var requirejs = require( 'component-require' );
      var Batch = require( 'batch' );
      var batch = new Batch;

      batch.push( this.buildScripts.bind( this ) );
      batch.push( this.buildTemplates.bind( this ) );
      batch.push( this.buildAliases.bind( this ) );
      //batch.push( this.buildLibs.bind( this ) );
      batch.push( this.buildStyles.bind( this ) );
      batch.push( this.buildImages.bind( this ) );
      batch.push( this.buildFonts.bind( this ) );
      batch.push( this.buildFiles.bind( this ) );

      batch.end( function( err, res ) {

        return console.log( "\n------------\n", builder .config.name, res );

        if( err ) {
          return fn( err );
        }

        var scripts = res.shift();
        var require = res.shift();
        var templates = res.shift();
        var custom = builder._js;

        fn( null, {
          js: [
            scripts,
            require,
            templates,
            custom
          ].filter( empty ).join( '\n' ),
          //libs: res.shift(),
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
} );

/**
 * Constructor Properties.
 *
 */
Object.defineProperties( module.exports = Builder, {
  upm: {
    value: require( '../upm' ),
    enumerable: false,
    configurable: true
  },
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    configurable: true
  }
} );


