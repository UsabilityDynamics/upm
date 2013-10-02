/**
 *
 */
require( 'abstract' ).createModel( module.exports = function upm() {

  var join = require( 'path' ).join;
  var resolve = require( 'path' ).resolve;

  // Prototype properties.
  upm.defineProperties( upm.prototype, {
    Compiler: {
      value: require( './compiler/compiler' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Provision: {
      value: require( './provision/provision' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Project: {
      value: require( './project/project' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Builder: {
      value: require( './builder/builder' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Package: {
      value: require( './package/package' ),
      configurable: true,
      enumerable: true,
      writable: true
    },
    Repository: {
      value: require( './repository/repository' ),
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
  } );

  // Constructor properties.
  upm.defineProperties( upm, {
    Provision: {
      get: upm.prototype.Provision,
      enumerable: true
    },
    Project: {
      get: upm.prototype.Project,
      enumerable: true
    },
    Package: {
      value: function( options ) {
        return new upm.prototype.Package( options )
      },
      enumerable: true
    },
    Builder: {
      get: upm.prototype.Builder,
      enumerable: true
    },
    Repository: {
      get: upm.prototype.Repository,
      enumerable: true
    },
    utility: {
      get: function() {
        return upm.prototype.utility;
      },
      enumerable: false
    },
    debug: {
      get: upm.prototype.debug,
      enumerable: false
    }
  } );

  // Define upm instance constructor
  upm.defineConstructor( function start( settings ) {

    // Add EventEmitter to instance.
    require( 'object-emitter' ).mixin( this );

    // Compute Properties.
    this.set({
      name: require( '../package' ).name,
      bin: require( '../package' ).bin,
      version: require( '../package' ).version,
      paths: {
        cwd: process.cwd(),
        root: resolve( process.cwd(), join( module.filename, '../../' ) ),
        webkit: resolve( process.cwd(), join( module.filename, '../../bin/webkit.app' ) ),
        cli: resolve( process.cwd(), join( module.filename, '../../bin/upm.js' ) ),
        lib: resolve( process.cwd(), join( module.filename, '../../lib' ) ),
        ux: resolve( process.cwd(), join( module.filename, '../../ux' ) )
      }
    });

  });

});

