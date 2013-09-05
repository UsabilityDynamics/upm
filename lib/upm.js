/**
 *
 */
require( 'abstract' ).createModel( module.exports = function UPM() {

  // Prototype properties.
  UPM.defineProperties( UPM.prototype, {
    Provision: {
      value: require( './provision' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Project: {
      value: require( './project' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Builder: {
      value: require( './builder' ),
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
    Repository: {
      value: require( './repository' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    utility: {
      value: require( './utility' ),
      enumerable: false,
      configurable: true
    },
    debug: {
      value: require( 'debug' )( 'upm' ),
      enumerable: true,
      configurable: true
    }
  });

  // Constructor properties.
  UPM.defineProperties( UPM, {
    Provision: {
      get: UPM.prototype.Provision,
      enumerable: true
    },
    Project: {
      get: UPM.prototype.Project,
      enumerable: true
    },
    Package: {
      value: function( options ) { return new UPM.prototype.Package( options ) },
      enumerable: true
    },
    Builder: {
      get: UPM.prototype.Builder,
      enumerable: true
    },
    Repository: {
      get: UPM.prototype.Repository,
      enumerable: true
    },
    utility: {
      get: function() { return UPM.prototype.utility; },
      enumerable: false
    },
    debug: {
      get: UPM.prototype.debug,
      enumerable: false
    }
  });

  /**
   *
   */
  UPM.defineConstructor( function start( settings ) {

    // Add EventEmitter to instance.
    require( 'object-emitter' ).mixin( this );

    // Configure instance settings.
    this.set({
      'cwd': process.cwd(),
      'package': require( '../package' )
    });

  });

});

