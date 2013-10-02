/**
 * Helper Utility for UPM
 *
 * @for upm
 * @module UPM
 * @author potanin@UD
 */
function Utility() {
  return Object.keys( arguments ) ? require( 'lodash' ).pick.apply( null, [ Utility, Array.prototype.slice.call( arguments ) ] ) : Utility;
}

Object.defineProperties( module.exports = Utility, {
  is_writable: {
    /**
     * Test if Target is Writable
     *
     * @param target
     * @returns {*}
     */
    value: function is_writable( target ) {

      var path = require( 'path' );
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
  get_namespace: {
    /**
     * Get Namespace/Vendor name from repository
     *
     * @param repository
     */
    value: function get_namespace( config ) {
      var url = require( 'url' );
      var parse = url.parse;
      var pathname = undefined;
      var parts = [];

      if( config.repository.url ) {
        var pathname = config.repository ? parse( config.repository.url.toLowerCase() ).pathname : config.repo.toLowerCase();
        var parts = pathname.split( '/' );
      }

      if( parts.length === 3 ) {

        return {
          vendor: parts[1],
          package: parts[2],
          namespace: config.config['namespace'] || parts[1]
        };

      }

      if( parts.length === 2 ) {

        return {
          vendor: parts[0],
          package: parts[1],
          namespace: config.config['namespace'] || parts[0]
        };

      }

    },
    enumerable: true
  },
  console: {
    value: {

      /**
       * Output fatal error message and exit.
       *
       * @param {String} msg
       * @api private
       */
      fatal: function() {
        console.error();
        Utility.console.error.apply( null, arguments );
        console.error();
        process.exit( 1 );
      },

      /**
       * Log the given `type` with `msg`.
       *
       * @param {String} type
       * @param {String} msg
       * @api public
       */
      log: function( type, msg, color ) {
        color = color || '36';
        var w = 10;
        var len = Math.max( 0, w - type.length );
        var pad = Array( len + 1 ).join( ' ' );
        console.log( '  \033[' + color + 'm%s\033[m : \033[90m%s\033[m', pad + type, msg );
      },

      /**
       * Log warning message with `type` and `msg`.
       *
       * @param {String} type
       * @param {String} msg
       * @api public
       */
      warn: function( type, msg ) {
        Utility.console.log( type, msg, '33' );
      },

      /**
       * Output error message.
       *
       * @param {String} msg
       * @api private
       */
      error: function( msg ) {
        var w = 10;
        var type = 'error';
        var len = Math.max( 0, w - type.length );
        var pad = Array( len + 1 ).join( ' ' );
        console.error( '  \033[31m%s\033[m : \033[90m%s\033[m', pad + type, msg );
      }

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  merge: {
    /**
     * Merge object b with object a.
     *
     * @example
     *     var a = { foo: 'bar' }
     *       , b = { bar: 'baz' };
     *
     *     utils.merge(a, b);
     *     // => { foo: 'bar', bar: 'baz' }
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     *
     * @source connect
     */
    value: function merge( a, b ) {

      if( a && b ) {

        for( var key in b ) {
          a[key] = b[key];
        }

      }

      return a;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  resolve: {
    /**
     *
     * @param target {String|Array}
     * @returns {*}
     */
    value: function resolve( target ) {

      var args = Array.prototype.slice.call( arguments );
      var fs = require( 'fs' );
      var resolve = require( 'path' ).resolve;
      var exists = fs.existsSync;
      var path = undefined;

      if( args.length > 1 ) {
        target = args.join( require( 'path' ).sep );
      }

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
      } );

    },
    enumerable: true
  },
} );