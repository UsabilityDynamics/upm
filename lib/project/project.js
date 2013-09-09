/**
 * Instantiate a Project
 *
 * @param options
 * @returns {*}
 * @constructor
 */
function Project( options ) {

  var upm       = require( '../upm' );
  var extend    = require( 'extend' );
  var path      = require( 'path' );
  var fs        = require( 'fs' );

  require( 'object-emitter' ).mixin( this );
  require( 'object-settings' ).mixin( this );

  // Update builder.configig with defaults.
  options = extend({
    type: 'library',
    directory: process.cwd()
  }, options );

  // Commit to options meta.
  this.set( 'options', options );

  // Load project settings.
  this.load( options );

  return this;

}

/**
 * Instance Properties.
 *
 */
Object.defineProperties( Project.prototype, {
  create: {
    /**
     * Create new project with scaffolding.
     *
     * @method create
     * @for Project
     */
    value: function create( options ) {
      Project.debug( 'Creating project [%s].', this.directory );

      var dirname     = require( 'path' ).dirname;
      var join        = require( 'path' ).join;
      var read        = require( 'fs' ).read;
      var fs          = require( 'fs' );
      var path        = require( 'path' );
      var prompt      = require( 'prompt' );
      var mustache    = require( 'mustache' );
      var wrench      = require( 'wrench' );

      // project.emit( 'message', 'Project [%d] created.', this.name );
      // project.emit( 'created', null );

      // @chainable
      return this;

      // this.set( 'template.path', join( dirname( module.filename ), 'templates', this.get( 'options.type' ) ) );

      var json = this.get( 'template.path' ) || 'wordpress-plugin.json';

      if ( !read( json ) ) {
        throw Error( "wordpress-plugin.json not found" );
      }

      var config = JSON.parse( read( json, 'utf8' ).toString().replace( /\n/g, '' ) );

      prompt.start();

      prompt.get( config, function ( err, result ) {

        var tpls = config.tpl || {};

        Object.keys( tpls ).forEach( function ( tpl ) {

          var dist = mustache.render( tpls[tpl], result );
          var distDir = dirname( dist );

          if ( fs.statSync( tpl ).isFile() ) {
            wrench.mkdirSyncRecursive( distDir );
            fs.writeFileSync( dist, mustache.render( fs.read( tpl, 'utf-8' ), result ) );
          } else {
            wrench.mkdirSyncRecursive( distDir );
            wrench.copyDirSyncRecursive( tpl, dist );
            wrench.readdirSyncRecursive( dist ).forEach( function ( file ) {
              file = path.join( dist, file );
              fs.writeFileSync( file, mustache.render( fs.read( file, 'utf-8' ), result ), 'utf-8' );
            });
          }

        });

      });

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  update: {
    /**
     * Update Project
     *
     * @todo Add a queue so callback can be triggered when all dependencies are done.
     *
     * @chainable
     * @method update
     * @for Project
     */
    value: function update( options ) {
      var project   = this;
      var upm       = require( '../upm' );
      var extend    = require( 'extend' );
      var async     = require( 'async' );
      var util      = require( 'util' );
      var path      = require( 'path' );
      var fs        = require( 'fs' );

      // @todo Use component.json settings when available.
      options = extend({
        force: false,
        dest: 'vendor'
      }, options );

      // Ensure that we have dependencies.
      if( !this.dependencies || this.dependencies.length === 0 ) {
        return project.emit( 'error', new Error( util.format( 'Project [%s] has no dependencies.', this.directory ) ) );
      }

      // Starting update.
      project.emit( 'message', 'Starting update [%d] dependencies on [%s] project.', this.dependencies.length, this.directory );

      // Run through each dependency.
      async.each( this.dependencies, function iterator( dep, next ) {

        dep = {
          name: dep.split( '@' )[0],
          version: dep.split( '@' )[1] || 'master'
        };

        project.emit( 'message', 'Updating dependencies for [%s] project.', dep.name );

        var package = new upm.Package({
          name: dep.name,
          version: dep.version,
          dest: options.dest,
          force: options.force,
          remotes: [
            'https://raw.github.com',
            'https://repository.usabilitydynamics.com'
          ],
          concurrency: 10
        });

        package.install();

        if( 'function' !== typeof package.on ) {
          console.log( 'failed on', dep );
          console.log( require( 'util' ).inspect( package, { showHidden: true, colors: true, depth: 2 } ) )
          next( null );
        }

        package.on( 'file', function( file, url ) {
          project.emit( 'verbose', 'Installed a [%s] file for [%s].', file, dep.name );
        });

        package.on( 'dep', function( component ) {
          project.emit( 'verbose', 'Fetching dependency [%s] for [%s].', component.name, dep.name );
        });

        package.on( 'installing', function( data ) {
          project.emit( 'message', 'Installing [%s].', dep.name );
        });

        package.on( 'error', function( error ){
          project.emit( 'error', 'Error while installing dependency [%s] for project [%s]: %s', dep.name, project.name, error.message  );
          next( null );
        });

        package.on( 'exists', function( data ) {
          project.emit( 'message', 'Dependency [%s] already exists.', dep.name );
          next( null );
        });

        package.on( 'end', function( data ) {
          project.emit( 'message', 'Installed dependency [%s] for project [%s].', dep.name, project.name );
          next( null );
        });

      }, function updated( error ) {

        process.nextTick( function() {
          project.emit( 'message', 'Project\'s [%d] dependencies have been udpated.', project.dependencies.length );
          project.emit( 'updated', error );
        });

      });

      // @chainable
      return this;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  install: {
    /**
     * Install Single Dependecy.
     *
     * @param name
     * @returns {*}
     */
    value: function install( name ) {

      return this;

    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  load: {
    /**
     * Load project.
     *
     * @private
     * @chainable
     * @method load
     * @for Project
     */
    value: function load( options ) {
      Project.debug( 'Loading [%s] project.', options.directory );

      var extend      = require( 'extend' );
      var basename    = require( 'path' ).basename;
      var dirname     = require( 'path' ).dirname;

      // Locate component.json; fallback to packave.json
      var _component  = Project.utility.resolve( 'component.json' ) || {};
      var _package    = Project.utility.resolve( 'package.json' ) || {};

      if( !_component && !_package ) {
        return {}
      }

      // Get object with defaults.
      var config = extend({
        repository: {},
        dependencies: {},
        development: {},
        remotes: [],
        paths: [],
        local: []
      }, require( _component ) )

      // Add computed properties.
      Object.defineProperties( this, {
        name: {
          value: config.name,
          enumerable: true,
          configurable: true,
          writable: true
        },
        version: {
          value: config.version,
          enumerable: true,
          configurable: true,
          writable: true
        },
        repository: {
          value: config.repository,
          enumerable: true,
          configurable: true,
          writable: true
        },
        username: {
          value: basename( dirname( config.repository.url ) ) || 'UsabilityDynamics',
          enumerable: true,
          configurable: true,
          writable: true
        },
        directory: {
          value: dirname( Project.utility.resolve( 'component.json' ) )
        },
        dependencies: {
          value: [],
          enumerable: false,
          configurable: true,
          writable: true
        }
      })

      // Normalize package references and add to aggregated array.
      this.dependencies = this.dependencies.concat( Project.utility.normalize( config.dependencies ) );
      this.dependencies = this.dependencies.concat( Project.utility.normalize( config.development ) );

      // Check local packages.
      config.local.forEach( function( pkg ) {
        try {
          component.dependenciesOf( pkg, config.paths ).map( Project.utility.normalize ).forEach( function(deps){
            this.dependencies = this.dependencies.concat( deps );
          });
        } catch (err) { console.error( err.message ); }
      });

      // @chainable
      return this;

    },
    enumerable: false
  },
  is_repository: {
    value: undefined,
    enumerable: true
  },
  have_dependencies: {
    get: function() {
      return Object.keys( this.dependencies ).length ? true : false;
    },
    enumerable: true
  },
  is_valid: {
    get: function() {
      return this.name && this.version ? true : false;
    },
    enumerable: true
  }
});

/**
 * Constructor Properties.
 *
 */
Object.defineProperties( module.exports = Project, {
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    configurable: true
  },
  debug: {
    value: require( 'debug' )( 'upm:project' ),
    enumerable: true,
    configurable: true
  }
})