/**
 * Package Loader
 *
 */
function Package( options ) {

  if( !options ) {
    return;
  }

  var _package = new Package.__super( options.name, options.version, options );

  require( 'object-emitter' ).mixin( _package );
  require( 'object-settings' ).mixin( _package );

  // _package.on( 'error', function() { console.log( 'Error importing %s', _package.name ); })
  // _package.on( 'file', function( file, url ) { console.log( 'Have %s file.', _package.name ); })
  // _package.on( 'dep', function( pkg ) { console.log( 'Have %s dep.', _package.name ); })
  // _package.mkdir( 'lib', function( err ) { console.log( 'Created /lib directory.' ); });
  // _package.writeFile( 'autoload.php', 'asdf', function() { console.log( 'Created autoload.php file.' ); });

  _package.on( 'end', function() {
    Package.debug( 'Finished importing %s package.', _package.name );
  });

  return _package;

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



