/**
 *
 */
function Package( options ) {
  var validation   = require( 'object-validation' );

  if( !options ) {
    return;
  }

  return new Package.__super( options.name, options.version, options );

  this.load = this.load || Package.prototype.load.bind( this );

  return this;

}

Object.defineProperties( Package.prototype, {
  load: {
    value: function load() {
      // console.log( 'hello', this.get( 'package' ) );

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})

Object.defineProperties( module.exports = Package, {
  __super: {
    value: require( 'component/lib/Package' ),
    enumerable: false
  },
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    configurable: true
  },
  debug: {
    value: require( 'debug' )( 'upm:package' ),
    enumerable: true,
    configurable: true
  }
})



