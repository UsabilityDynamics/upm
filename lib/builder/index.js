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

  // Update builder.configig with defaults.
  options = extend( {
    directory: process.cwd(),
    name: 'build',
    out: 'build',
    require: false,
    prefix: null
  }, options );

  // Create builder instance.
  var builder = new this.__super( options.directory );

  require( 'object-emitter' ).mixin( builder );
  require( 'object-settings' ).mixin( builder );

  // builder.addLookup( 'lib' );
  // builder.addFile('scripts', 'view.js', 'compiled view js');

  if( options.prefix ) {
    builder.prefixUrls( options.prefix );
  }

  builder.copyAssetsTo( options.out );

  // builder.use( require( 'component-markdown' ) );
  // builder.use( require( 'component-uglifyjs' ) );
  // builder.use( require( 'component-less' ) );
  builder.use( this.composePHP );
  //builder.use( this.compose );

  //builder.hook( 'before scripts', function( builder ) { Builder.debug( 'before scripts' ); });
  //builder.hook( 'before styles', function( builder ) { Builder.debug( 'before styles' ); });
  //builder.hook( 'before templates', function( builder ) { Builder.debug( 'before templates' ); });

  builder.build( function( err, obj ) {

    if( !obj ) {
      console.log( require( 'util' ).inspect( obj, { showHidden: true, colors: true, depth: 2 } ) )
      return;
    }

  });

  return builder;

}

Object.defineProperties( Builder.prototype, {
  __super: {
    value: require( 'component-builder' ),
    enumerable: false
  },
  composePHP: {
    /**
     *
     * @param builder
     */
    value: function composePHP( builder ) {

      var self        = this;
      var extname     = require( 'path' ).extname;
      var basename    = require( 'path' ).basename;
      var resolve     = require( 'path' ).resolve;
      var join_path   = require( 'path' ).join;
      var Batch       = require( 'batch' );
      var fs          = require( 'fs' );
      var read        = fs.readFileSync;
      var mkdir       = require( 'mkdirp' );

      builder.hook( 'before scripts', function( pkg, next ) {
        var scripts = pkg.config.scripts;
        var batch = new Batch;

        if( !scripts ) {
          return next();
        }

        var phpFiles = scripts.filter( function( file ) {
          return extname( file ) == '.php';
        });

        mkdir( resolve( join_path( pkg.assetsDest, 'lib' ) ), function( error ) {
          if( error ) {
            Builder.debug( error );
          }
        });

        phpFiles.forEach( function( filename ) {
          Builder.debug( "Compiling PHP File: " + filename );

          batch.push( function( done ) {

            // Remove PHP file from script build.
            pkg.removeFile( 'scripts', filename );

            // Load info about the file
            var contents = read( pkg.path( filename ), 'utf-8' );

            fs.writeFile( resolve( join_path( pkg.assetsDest, 'lib', basename( filename ) ) ), contents );

            return done();

          });

        });

        batch.end( next );

      });

    },
    enumerable: true
  },
  build: {
    value: function build() {
      var self = this;
      var Batch = require( 'batch' );
      var batch = new Batch;

      Builder.debug( 'building %s', this.dir );

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
        });
      });

    },
    enumerable: true
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



