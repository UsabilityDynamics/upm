/**
 * Instantiate a Project
 *
 *
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

  // Update builder.configig with defaults.
  options = extend({
    directory: this.get( 'cwd' ),
  }, options );

  // Load project settings.
  this.load()


  return this;

}

Object.defineProperties( Project.prototype, {
  load: {
    /**
     * Load project.
     *
     * @method load
     */
    value: function load() {
      // Locate component.json; fallback to packave.json
      var _component  = Project.utility.resolve( 'component.json' ) || {};
      var _package    = UPM.utility.resolve( 'package.json' ) || {};

      // Get object with defaults.
      var config = extend({
        dependencies: {},
        development: {},
        remotes: [],
        paths: [],
        local: []
      }, require( path ) )

      // Add computed properties.
      Object.defineProperties( config, {
        __packages: {
          value: [],
          enumerable: false,
          configurable: true,
          writable: true
        }
      })

      // Normalize package references and add to aggregated array.
      config.__packages = config.__packages.concat( UPM.utility.normalize( config.dependencies ) );
      config.__packages = config.__packages.concat( UPM.utility.normalize( config.development ) );

      // Check locak packages.
      config.local.forEach( function( pkg ) {
        try {
          component.dependenciesOf( pkg, config.paths ).map( UPM.utility.normalize ).forEach( function(deps){
            config.__packages = config.__packages.concat( deps );
          });
        } catch (err) { console.error( err.message ); }
      });

      return config;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
});

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