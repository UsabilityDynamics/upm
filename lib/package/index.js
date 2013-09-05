/**
 *
 */
function Package() {
  var validation   = require( 'object-validation' );

  // remotes: https://repository.usabilitydynamics.com

  this.load = this.load || Package.prototype.load.bind( this );

  var pkg = new Package( 'Usabilitydynamics/wp-libs', 'master', {
    force: false,
    dev: false,
    remotes: [ "https://raw.github.com" ],
    concurrency: 10
  });

  pkg.install();

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



