(function() {
  var fs = require( 'fs' );
  var path = require( 'path' );
  var cssPath = path.join( process.cwd(), 'ux/style.css' );

//Devtools for developers
  window.addEventListener( 'keydown', function( e ) {
    if( e.keyIdentifier === 'F12' ) {
      require( 'nw.gui' ).Window.get().showDevTools();
    }
  } );

  fs.watchFile( cssPath, {interval: 500}, function() {

    //document.querySelector( '#preprosStylesheet' ).href = "assets/css/style.css?" + Math.random();
  } )

  // console.log( cssPath );

  var http = require( 'http' );

  //Try to create server
  var server = http.createServer(function( req, res ) {

  } ).listen( 8000, '127.0.0.1', function() {

    } );

  //Error means another instance is running
  //So request the server to show previous instance
  server.on( 'error', function() {
    http.get( 'http://127.0.0.1:8000', function() {
      require( 'nw.gui' ).Window.get().close( true );
    } );
  } );

  // console.log( server );

})()
