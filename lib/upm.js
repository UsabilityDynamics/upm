/**
 *
 */
require( 'abstract' ).createModel( module.exports = function UPM () {

  var readline  = require( 'readline' );

  // Instance Properties.
  UPM.defineProperties( UPM, {
    Activity: {
      value: require( './provision' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Package: {
      value: require( './package' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Scaffold: {
      value: require( './scaffold' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Repository: {
      value: require( './repository' ),
      configurable: true,
      enumerable: true,
      writable: true
    }
  });

  // Prototype
  UPM.defineProperties( UPM.prototype, {
    debug: {
      value: require( 'debug' )( 'upm' ),
      enumerable: true,
      configurable: true
    },
    completer: {
      value: function completer ( line ) {

        var completions = '.help .error .exit .quit .q'.split( ' ' )
        var hits = completions.filter( function ( c ) {
          return c.indexOf( line ) == 0
        } )

        // show all completions if none found
        return [hits.length ? hits : completions, line]

      },
      enumerable: true,
      configurable: true
    },
    menu: {
      value: function(args){

      },
      enumerable: true,
      configurable: true
    },
    parse: {
      value: function( args ) {

        if( 'string' === typeof args ) {
          args = args.split( ' ' );
        }

        return parser( args );

      },
      enumerable: true,
      configurable: true
    }
  });

  /**
   *
   */
  UPM.defineConstructor( function start ( settings ) {

    var self    = require( 'object-emitter' ).mixin( this );

  });

});

