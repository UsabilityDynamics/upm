/**
 * Helper Utility for UPM
 *
 * @for upm
 * @submodule utility
 * @author potanin@UD
 */
function Utility() {
  return Object.keys( arguments ) ?
    require( 'lodash' ).pick.apply( null, [ Utility, Array.prototype.slice.call( arguments ) ] ) : Utility;
}

Object.defineProperties( module.exports = Utility, {
  resolve: {
    value: function resolve( target ) {
      var fs = require( 'fs' );
      var resolve = require( 'path' ).resolve;
      var exists = fs.existsSync;
      var path = undefined;

      try {

        if( !target ) {
          throw new Error;
        }

        path = resolve( target );

        if( !exists( path ) ) {
          throw new Error;
        }

        return path;

      } catch( error ) {
        return false;
      }

    },
    enumerable: true
  },
  normalize: {
    value: function normalize( deps ) {

      if( !deps || !Object.keys( deps ) ) {
        return {}
      }
      return Object.keys( deps ).map( function( name ) {
        return name + '@' + deps[name];
      });

    },
    enumerable: true
  },
});