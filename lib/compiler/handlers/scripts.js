/**
 * Compile JavaScript
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

  builder.build( function complete( error, obj ) {

    if( error ) {
      builder.emit( 'error', 'Script Build failed when trying to create directory: [%s]'. error.message );
    }

    // Create Directory.
    mkdir( resolve( component.build.scripts.out ), function( error ) {

      if( error ) {
        builder.emit( 'error', 'Script Build failed when trying to create directory: [%s]'. error.message );
      }

      var js = [
        //obj.require,
        obj.js,
        //'( function() {'
      ];

      var umd = [
        'if (typeof exports == "object") {',
        '  module.exports = require("' + builder.config.name + '");',
        '} else if (typeof define == "function" && define.amd) {',
        '  define(function(){ return require("' + builder.config.name + '"); });',
        '} else {',
        '  this["' + builder.config.name + '"] = require("' + builder.config.name + '");',
        '}'
      ];

      //js.push( umd.join( '\n' ) );

      //js.push( '})();' );

      // Write compiled file to output directory.
      fs.writeFile( resolve( component.build.scripts.out, component.config.basename + '.js' ), js.join( "\n\n" ), function( error ) {

        if( error ) {
          builder.emit( 'error', 'Scripts [%s] built with error: [%s].', builder.config.name, error.message );
        } else {
          builder.emit( 'verbose', 'Scripts [%s] built.', builder.config.name );
        }

        // console.log( obj );

      } );

    });

  });

}
