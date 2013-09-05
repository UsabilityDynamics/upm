#!/usr/bin/env node

/**
 * Usability Dynamics Package Manager CLI
 *
 *    upm-create
 *    upm-install
 *    upm-update
 *    upm-commit
 *    upm-build
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
  var upm       = require( '../' ).start();
  var commander = require( 'commander' ).Command;
  var extend    = require( 'extend' );
  var basename  = require( 'path' ).basename;
  var logger    = require( 'winston' );
  var program   = new commander( 'upm' );

  // Handle dashed-commands.
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
    .option( '-r, --repository <repository>', 'Path to GitHub repository.', 'UsabilityDynamics/new-project' )
    .option( '-t, --type <type>', 'Type of project.', 'library' )
    .option( '-v, --version <version>', 'Component version.', '0.0.1' )
    .action( function create( config ) {
      logger.info( 'Creating a [%s] project called [%s].', config.type, config.name );

      // Load component.json
      var project = new upm.Project({
        name: config.name,
        version: config.version,
        type: config.type,
        repository: {
          type: 'git',
          url: [ 'https://github.com', config.repository ].join( '/' )
        }
      });

      if( !project.is_valid ) {
        return logger.error( 'Could not create project.' );
      }

      project.create()

    });

  program
    .command( 'install' )
    .description( 'Install component dependencies.' )
    .option( '-o, --out <dir>', 'output directory defaulting to ./build', 'build' )
    .option( '-n, --name <file>', 'base name for build files defaulting to build', 'build' )
    .option( '-b, --branch <branch>', 'install from branch', 'master' )
    .option( '-p, --prefix <prefix>', 'prefix css asset urls with <prefix>')
    .action( function install( config ) {
      logger.info( 'Installing component dependancies from the [%s] branch.', config.branch );

      // Load component.json
      var project = new upm.Project();

      // Project is broken.
      if( !project.is_valid ) {
        return logger.error( 'Unable to run install or an invalid project.' );
      }

      // No dependencies to update.
      if( !project.have_dependencies ) {
        return logger.info( 'No dependencies to update.')
      }

      // Run the udpate.
      project.update({
        force: true
      });

      // logger.info( 'Installing component dependancies from the [%s] branch.', config.branch );

      return;

      upm.Builder({
        prefix: config.prefix
      });

    });

  program
    .command( 'update' )
    .description( 'Update repository, fetch dependencies and build.' )
    .option( '-b, --branch <branch>', 'Fetch a specific branch. <branch>', 'master' )
    .action( function update( config ) {
      upm.debug( 'Updating component from the [%s] branch.', config.branch );

    });

  program
    .command( 'commit' )
    .description( 'Commit to repository.' )
    .option( '-m, --message <message>', 'Set commit message. <message>', 'General update.' )
    .action( function commit( config ) {
      console.log( 'install!' );
    });

  program
    .command( 'build' )
    .description( 'Compile components.' )
    .option( '-o, --out <dir>', 'output directory defaulting to ./build', 'build' )
    .option( '-n, --name <file>', 'base name for build files defaulting to build', 'build ' )
    .option( '-p, --prefix <prefix>', 'prefix css asset urls with <prefix>')
    .option( '-u, --use <name>', 'use the given build plugin(s)')
    .action( function build( config ) {
      upm.debug( 'Building the [%s] branch.', config.branch );

      var _builder = upm.Builder({
        prefix: config.prefix,
        require: false
      });

      _builder.on( 'complete', function() {
        console.log( 'Build comlete.' );
      });

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