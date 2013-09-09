#!/usr/bin/env node

/**
 * Usability Dynamics Package Manager CLI
 *
 *    upm-create
 *    upm-install
 *    upm-update
 *    upm-commit
 *    upm-provision
 *
 * @example
 *
 *    // Create new component.
 *    upm create -n lib-example -r UsabilityDynamics/ud-lib-example
 *
 *    // Update core package from repository, fetch dependencies and build.
 *    upm update
 *
 *    // Fetch dependencies and build.
 *    upm install
 *
 *    // Install a specific omponent, e.g. emitter
 *    upm install -c component/emitter
 *
 *    // Commit to GitHub with message.
 *    upm commit -m "General updates."
 *
 *    // Build computed components.
 *    upm build
 *
 *    // Deploy to production environment.
 *    upm provision -e production
 *
 *    // Show debug messages.
 *    DEBUG=upm* upm install
 *
 * @todo Determine filename by getting basename of argv[1]
 * @constructor
 */
function cli() {

  // Private Properties.
  var self      = this;
  var upm       = require( '../' ).start();
  var commander = require( 'commander' ).Command;
  var extend    = require( 'extend' );
  var basename  = require( 'path' ).basename;
  var program   = new commander( 'upm' );

  if( process.argv.length === 2 && basename( process.argv[1] ) != 'upm' ) {
    // process.argv[1] = process.argv[1].replace( '-', ' ' );
  }

  program
    .usage( '[command] [options]' )
    .version( upm.get( 'package' ).version )

  program
    .command( 'create' )
    .description( 'Create new project.' )
    .option( '-n, --name <name>', 'Component name.', 'new-project' )
    .option( '-d, --destination <dest>', 'Component output directory.', 'vendor' )
    .option( '-r, --repository <repository>', 'Path to GitHub repository.', 'UsabilityDynamics/new-project' )
    .option( '-t, --type <type>', 'Type of project.', 'library' )
    .option( '-v, --version <version>', 'Component version.', '0.0.1' )
    .action( function create( config ) {
      logger.info( 'Creating a [%s] project called [%s].', config.type, config.name );

      // Load component.json
      var project = new upm.Project({
        name: config.name,
        type: config.type,
        version: config.version,
        repository: {
          type: 'git',
          url: [ 'https://github.com', config.repository ].join( '/' )
        }
      });

      // Relay messages to console.
      project.on( 'message', self.log );
      project.on( 'error', self.error );

      if( !project.is_valid ) {
        return logger.error( 'Could not create project.' );
      }

      project.create();

      project.once( 'created', function created( error, data ) {

      });

    });

  program
    .command( 'install' )
    .usage( '[name] [options]' )
    .description( 'Install or update component dependencies and compile.' )
    .option( '-d, --destination <dest>', 'Component output directory.', 'vendor' )
    .option( '-o, --out <dir>', 'Output directory for compiled results.', 'build' )
    .option( '-n, --name <file>', 'base name for build files defaulting to build', 'build' )
    .option( '-b, --branch <branch>', 'branch name', 'master' )
    .action( function install( config ) {
      self.log( 'Installing component dependancies from the [%s] branch.', config.branch );

      // Load project instance.
      var project = new upm.Project();

      // Relay messages to console.
      project.on( 'message', self.log );
      project.on( 'error', self.error );

      // Project is broken.
      if( !project.is_valid ) {
        return self.error( 'Unable to run install; verify that component.json is valid.' );
      }

      // Run update if needed.
      project.update();

      // Project dependencies updated.
      project.once( 'updated', function updated() {

        var builder = upm.Builder({
          prefix: config.prefix,
          require: false
        });

        // Relay messages to console.
        builder.on( 'message', self.log );
        builder.on( 'error', self.error );

        // Built Complete.
        builder.on( 'built', function( error ) {

          if( error ) {
            self.error( 'Built of [%s] project is failed: %s.', builder.config.name, error.message );
          } else {
            self.log( 'Built of [%s] project is complete.', builder.config.name );
          }

        })

      });

    });

  program
    .command( 'commit' )
    .description( 'Commit to repository.' )
    .option( '-m, --message <message>', 'Set commit message. <message>', 'General update.' )
    .action( function commit( config ) {
      console.log( 'install!' );
    });

  program
    .command( 'provision' )
    .description( 'Deploy to a server.' )
    .option( '-m, --message <message>', 'Set commit message. <message>', 'General update.' )
    .action( function build( config ) {
      console.log( 'provision!' );
    });

  // Render help if no arguments passed
  if( process.argv.length === 2 ) {
    program.outputHelp()
  }

  // Parse arguments
  program.parse( process.argv );

}

Object.defineProperties( cli.prototype, {
  table: {
    /**
     * Console Output with a Table
     *
     * @example
     *    this.table( { data: 'here' } )
     *
     */
    value: function table( data ) {
      var table = new ( require( 'cli-table' ) );
      table.push( data );
      console.log( table.toString() );
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  log: {
    /**
     * Console Output
     *
     * @example
     *      this.log( 'Blah' )
     *
     * @param type
     * @param message
     * @param color
     */
    value: function log() {
      console.log( '  \u001b[36m' + require( 'util' ).format.apply( require( 'util' ), arguments ) + '\u001b[39m' );
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  error: {
    /**
     * Error Output
     *
     */
    value: function error() {
      console.log( '  \u001b[31mError: ' + require( 'util' ).format.apply( require( 'util' ), arguments ) + '\u001b[39m' );
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  notice: {
    /**
     * Notice Output
     *
     */
    value: function notice() {
      console.log( '  \u001b[32mNotice: ' + require( 'util' ).format.apply( require( 'util' ), arguments ) + '\u001b[39m' );
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
})

// Instantiate and export.
Object.defineProperties( module.exports = new cli, {
  print: {
    value: function print() {
      console.log.apply( console, arguments );
    },
    enumerable: true,
    configurable: true
  },
  completer: {
    value: function completer( line ) {

      var completions = '.help .error .exit .quit .q'.split( ' ' )
      var hits = completions.filter( function( c ) {
        return c.indexOf( line ) == 0
      } )

      // show all completions if none found
      return [hits.length ? hits : completions, line]

    },
    enumerable: true,
    configurable: true
  },
  menu: {
    value: function( args ) {

    },
    enumerable: true,
    configurable: true
  },
  parse: {
    value: function( args ) {

      if( 'string' === typeof args ) {
        args = args.split( ' ' );
      }

      return parser( args );

    },
    enumerable: true,
    configurable: true
  }
});