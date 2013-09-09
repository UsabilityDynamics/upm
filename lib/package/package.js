/**
 * Package Loader
 *
 *
 * options.dest Relative destination path for component storage.
 */
function Package( options ) {

  if( !(this instanceof Package ) ) {
    return new Package( options );
  }

  var self = this;
  var upm = require( '../upm' );
  var extend = require( 'extend' );
  var path = require( 'path' );
  var fs = require( 'fs' );
  var exists = fs.existsSync || path.existsSync;

  // Update composer.json with defaults.
  options = extend({
    name: 'new-component',
    version: '0.0.1',
    dest: 'vendor',

    concurrency: 10,
    auth: null,
    proxy: null,

    remotes: [
      'https://raw.github.com',
      'https://repository.usabilitydynamics.com'
    ]

  }, options || {} );

  Object.defineProperties( Package.__super.prototype, {
    install: {
      value: Package.prototype.install,
      enumerable: true
    },
    reallyInstall: {
      value: Package.prototype.reallyInstall,
      enumerable: true
    },
    error: {
      value: Package.prototype.error,
      enumerable: true
    },
    getJSON: {
      value: Package.prototype.getJSON,
      enumerable: true
    },
  });

  var _package = new Package.__super( options.name, options.version, options );

  require( 'object-emitter' ).mixin( _package );
  require( 'object-settings' ).mixin( _package );

  return _package;

}

Object.defineProperties( Package.prototype, {
  install: {
    value: function install() {
      var self = this;
      var name = this.name;

      if( !~name.indexOf( '/' ) ) {
        this.emit( 'error', new Error( 'Invalid component name "' + name + '"' ) );
        return this;
      }

      this.getLocalJSON( function( err, json ) {
        // console.log( 'this.getLocalJSON', err || json );

        if( err && err.code == 'ENOENT' ) {
          self.reallyInstall();
        } else if( err ) {
          self.emit( 'error', err );
        } else if( !self.force ) {
          self.emit( 'exists', self );
        } else {
          self.reallyInstall();
        }

      });

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  error: {
    value: function error( res, url ) {
      var http = require( 'http' );
      var https = require( 'https' );

      var name = http.STATUS_CODES[res.statusCode];
      var err = new Error( 'failed to fetch ' + url + ', got ' + res.statusCode + ' "' + name + '"' );
      err.status = res.statusCode;
      return err;
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  getJSON: {
    value: function( fn ) {
      var path = require( 'path' );
      var dirname = path.dirname;
      var basename = path.basename;
      var extname = path.extname;
      var resolve = path.resolve;
      var mkdir = require( 'mkdirp' ).mkdirp;
      var netrc = require( 'netrc' );
      var Batch = require( 'batch' );
      var url = require( 'url' );
      var parse = url.parse;
      var fs = require( 'fs' );
      var rimraf = require( 'rimraf' );
      var http = require( 'http' );
      var https = require( 'https' );
      var request = require( 'superagent' );

      var self = this;
      var url = this.url( 'component.json' );

      var req = request.get( url );

      req.set( 'Accept-Encoding', 'gzip' );

      // Add proxy
      if( self.proxy ) {
        req.proxy( self.proxy );
      }

      // authorize call
      var netrc = self.netrc[parse( url ).hostname];

      if( netrc ) {
        req.auth( netrc.login, netrc.password );
      }

      req.end( function( res ) {

        if( res.error ) {
          return fn( self.error( res, url ) );
        }

        try {
          var json = JSON.parse( res.text );
        } catch( err ) {
          err.message += ' in ' + url;
          return fn( err );
        }

        fn( null, json );

      });

      req.on( 'error', function( err ) {
        if( 'getaddrinfo' == err.syscall ) {
          err.message = 'dns lookup failed';
        }
        fn( err );
      });

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  dirname: {
    /**
     * Enforce Lowercase
     *
     * @returns {string}
     */
    value: function dirname() {
      var resolve = path.resolve;
      return resolve( this.dest, this.name.split('/').join('-') ).toLowerCase();
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  reallyInstall: {
    /**
     * Really install the component.
     *
     * @api public
     */
    value: function reallyInstall() {
      var path = require( 'path' );
      var dirname = path.dirname;
      var basename = path.basename;
      var extname = path.extname;
      var resolve = path.resolve;
      var mkdir = require( 'mkdirp' ).mkdirp;
      var netrc = require( 'netrc' );
      var Batch = require( 'batch' );
      var url = require( 'url' );
      var parse = url.parse;
      var fs = require( 'fs' );
      var rimraf = require( 'rimraf' );
      var http = require( 'http' );
      var https = require( 'https' );

      // Single Package
      var self = this;
      var i = 0;
      var batch;
      var last;

      next();

      function next() {
        self.remote = self.remotes[i++];

        if( !self.remote ) {
          return self.emit( 'error', new Error( 'can\'t find remote for "' + self.name + '"' ) );
        }

        last = i == self.remotes.length;

        self.remote = url.parse( self.remote );
        self.remote.href = self.remote.href.slice( 0, -1 );

        self.once( 'error', next );

        // kick off installation
        batch = new Batch;
        self.getJSON( function( err, json ) {

          if( err ) {
            err.fatal = 404 != err.status || last;
            return self.destroy( function( error ) {
              if( error ) {
                self.emit( 'error', error );
              }
              self.emit( 'error', err );
            });
          }

          var files = [];

          if( json.scripts ) {
            files = files.concat( json.scripts );
          }

          if( json.styles ) {
            files = files.concat( json.styles );
          }

          if( json.templates ) {
            files = files.concat( json.templates );
          }

          if( json.views ) {
            files = files.concat( json.views );
          }

          if( json.schemas ) {
            files = files.concat( json.schemas );
          }

          if( json.files ) {
            files = files.concat( json.files );
          }

          if( json.images ) {
            files = files.concat( json.images );
          }

          if( json.libs ) {
            files = files.concat( json.libs );
          }

          if( json.fonts ) {
            files = files.concat( json.fonts );
          }

          // @todo Verify URL parsing works.
          if( json.repository && !json.repo ) {
            json.repo = parse( json.repository.url ).pathname;
          }

          // Get Dependencies.
          if( json.dependencies ) {
            batch.push( function( done ) { self.getDependencies( json.dependencies, done ); });
          }

          // Update compoent.json it seems.
          batch.push( function( done ) {
            self.mkdir( self.dirname(), function( err ) {
              json = JSON.stringify( json, null, 2 );
              self.writeFile( 'component.json', json, done );
            });
          });

          // Do something with files?
          batch.push( function( done ) {
            self.mkdir( self.dirname(), function( err ) {
              self.getFiles( files, done );
            });
          });

          // Bail.
          batch.end( function( err ) {
            if( err ) {
              err.fatal = last;
              self.destroy( function( error ) {
                if( error ) {
                  self.emit( 'error', error );
                }
                self.emit( 'error', err );
                self.emit( 'end' );
              });
            } else {
              self.emit( 'end' );
            }
          });

        });
      }

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});

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
  logger: {
    value: require( 'winston' ),
    writable: true,
    enumerable: true,
    configurable: true
  },
  debug: {
    value: require( 'debug' )( 'upm:package' ),
    enumerable: true,
    configurable: true
  }
} )



