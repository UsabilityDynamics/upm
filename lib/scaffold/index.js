/**
 *
 */
function Scaffold( options ) {

  var dirname = require( 'path' ).dirname;
  var join = require( 'path' ).join;
  var readFileSync = require( 'fs' ).readFileSync;
  var fs = require( 'fs' );
  var path = require( 'path' );
  var prompt = require( 'prompt' );
  var mustache = require( 'mustache' );
  var wrench = require( 'wrench' );

  this.set( 'path', join( dirname( module.filename ), 'models', this.get( 'type' ) ) );

  var json = this.get( 'path' ) || 'wordpress-plugin.json';

  if ( !readFileSync( json ) ) {
    throw Error( "wordpress-plugin.json not found" );
  }

  var config = JSON.parse( readFileSync( json, 'utf8' ).toString().replace( /\n/g, '' ) );

  prompt.start();

  prompt.get( config, function ( err, result ) {

    var tpls = config.tpl || {};

    Object.keys( tpls ).forEach( function ( tpl ) {

      var dist = mustache.render( tpls[tpl], result );
      var distDir = dirname( dist );

      if ( fs.statSync( tpl ).isFile() ) {
        wrench.mkdirSyncRecursive( distDir );
        fs.writeFileSync( dist, mustache.render( fs.readFileSync( tpl, 'utf-8' ), result ) );
      } else {
        wrench.mkdirSyncRecursive( distDir );
        wrench.copyDirSyncRecursive( tpl, dist );
        wrench.readdirSyncRecursive( dist ).forEach( function ( file ) {
          file = path.join( dist, file );
          fs.writeFileSync( file, mustache.render( fs.readFileSync( file, 'utf-8' ), result ), 'utf-8' );
        } );
      }

    } );

  } );

}

/**
 *
 */
Object.defineProperties( module.exports = Scaffold, {
  method: {
    value: function method () {

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})



