/**
 * Compile LESS
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

  var recess = require( 'recess' );

  builder.hook( 'before scripts', function( pkg, next ) {
    var styles = pkg.config.styles;
    var batch   = new Batch;
    var output  = resolve( join_path( 'build', 'styles' ) );

    if( !styles ) {
      return next();
    }

    var less_styles = styles.filter( function( file ) {
      return extname( file ) == '.less';
    });

    // @todo Cycle through less_styles items and ensure they resolve.

    recess( less_styles, {
      compile: true,
      compress: true,
      noIDs: true,
      noJSPrefix: true,
      noOverqualifying: true,
      noUnderscores: true,
      noUniversalSelectors: true,
      prefixWhitespace: true,
      strictPropertyOrder: true,
      stripColors: true,
      zeroUnits: true,
    }, function( error, object ) {
      next();
    });

    batch.end( function done() {
      builder.emit( 'message', 'LESS Build complete.' );
      next();
    });

  });

}
