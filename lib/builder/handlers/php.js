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

  builder.hook( 'before scripts', function( pkg, next ) {
    var scripts = pkg.config.scripts;
    var batch   = new Batch;
    var output  = resolve( join_path( 'build', 'lib' ) );

    if( !scripts ) {
      return next();
    }

    var phpFiles = scripts.filter( function( file ) {
      return extname( file ) == '.php';
    });

    mkdir( output, function( error ) {

      if( error ) {
        console.log( error );
      }

    });

    phpFiles.forEach( function( filename ) {
      console.log( "Compiling PHP File: " + filename );

      batch.push( function( done ) {

        // Remove PHP file from script build.
        pkg.removeFile( 'scripts', filename );

        // Load info about the file
        var contents = read( pkg.path( filename ), 'utf-8' );

        fs.writeFile( resolve( join_path( pkg.assetsDest, 'lib', basename( filename ) ) ), contents );

        return done();

      });

    } );

    batch.end( function done() {
      builder.emit( 'message', 'PHP Build complete.' );
      next();
    });

  });

}