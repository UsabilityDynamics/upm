/**
 * Build PHP
 *
 * @param builder
 */
module.exports = function build( builder ) {
  var self = this;
  var extname = require( 'path' ).extname;
  var basename = require( 'path' ).basename;
  var resolve = require( 'path' ).resolve;
  var join_path = require( 'path' ).join;
  var Batch = require( 'batch' );
  var fs = require( 'fs' );
  var read = fs.readFileSync;
  var mkdir = require( 'mkdirp' );
  var component = builder.config;

  builder.hook( 'before libs', function( pkg, next ) {
    var batch   = new Batch;

    // Check if package has libs.
    if( !pkg.config.libs ) {
      return next();
    }

    // Find matching files by extension.
    var files = pkg.config.libs.filter( function( file ) {
      return extname( file ) == '.php';
    });

    // Create Directory.
    mkdir( resolve( component.build.libs.out ), function( error ) {

      if( error ) {
        builder.emit( 'error', 'PHP Lib Build failed when trying to create directory: [%s]'. error.message );
      }

    });

    // Iterate through files.
    files.forEach( function( filename ) {
      // console.log( "Compiling PHP File: " + filename );

      batch.push( function( done ) {

        // Remove PHP file from script build.
        pkg.removeFile( 'libs', filename );

        // Write file.
        fs.writeFile( resolve( join_path( component.build.libs.out, basename( filename ) ) ), read( pkg.path( filename ), 'utf-8' ), function( error ) {
          if( error ) {}
          done( error );
        });

      });

    });

    // Batch done.
    batch.end( function done() {
      // builder.emit( 'message', 'PHP Build complete.' );
      next();
    });

  });

  // Build Handler.
  builder.build( function complete( error, obj ) {
    builder.emit( 'verbose', 'Libraries for [%s] built.', builder.config.name );
  });

}