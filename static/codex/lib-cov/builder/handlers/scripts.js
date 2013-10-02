/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['builder/handlers/scripts.js']) {
  _$jscoverage['builder/handlers/scripts.js'] = [];
  _$jscoverage['builder/handlers/scripts.js'][6] = 0;
  _$jscoverage['builder/handlers/scripts.js'][7] = 0;
  _$jscoverage['builder/handlers/scripts.js'][8] = 0;
  _$jscoverage['builder/handlers/scripts.js'][9] = 0;
  _$jscoverage['builder/handlers/scripts.js'][10] = 0;
  _$jscoverage['builder/handlers/scripts.js'][11] = 0;
  _$jscoverage['builder/handlers/scripts.js'][12] = 0;
  _$jscoverage['builder/handlers/scripts.js'][13] = 0;
  _$jscoverage['builder/handlers/scripts.js'][14] = 0;
  _$jscoverage['builder/handlers/scripts.js'][15] = 0;
  _$jscoverage['builder/handlers/scripts.js'][16] = 0;
  _$jscoverage['builder/handlers/scripts.js'][18] = 0;
  _$jscoverage['builder/handlers/scripts.js'][20] = 0;
  _$jscoverage['builder/handlers/scripts.js'][21] = 0;
  _$jscoverage['builder/handlers/scripts.js'][25] = 0;
  _$jscoverage['builder/handlers/scripts.js'][27] = 0;
  _$jscoverage['builder/handlers/scripts.js'][28] = 0;
  _$jscoverage['builder/handlers/scripts.js'][31] = 0;
  _$jscoverage['builder/handlers/scripts.js'][37] = 0;
  _$jscoverage['builder/handlers/scripts.js'][52] = 0;
  _$jscoverage['builder/handlers/scripts.js'][54] = 0;
  _$jscoverage['builder/handlers/scripts.js'][55] = 0;
  _$jscoverage['builder/handlers/scripts.js'][57] = 0;
}
_$jscoverage['builder/handlers/scripts.js'][6]++;
module.exports = (function build(builder) {
  _$jscoverage['builder/handlers/scripts.js'][7]++;
  var self = this;
  _$jscoverage['builder/handlers/scripts.js'][8]++;
  var extname = require("path").extname;
  _$jscoverage['builder/handlers/scripts.js'][9]++;
  var basename = require("path").basename;
  _$jscoverage['builder/handlers/scripts.js'][10]++;
  var resolve = require("path").resolve;
  _$jscoverage['builder/handlers/scripts.js'][11]++;
  var join_path = require("path").join;
  _$jscoverage['builder/handlers/scripts.js'][12]++;
  var Batch = require("batch");
  _$jscoverage['builder/handlers/scripts.js'][13]++;
  var fs = require("fs");
  _$jscoverage['builder/handlers/scripts.js'][14]++;
  var read = fs.readFileSync;
  _$jscoverage['builder/handlers/scripts.js'][15]++;
  var mkdir = require("mkdirp");
  _$jscoverage['builder/handlers/scripts.js'][16]++;
  var component = builder.config;
  _$jscoverage['builder/handlers/scripts.js'][18]++;
  builder.build((function complete(error, obj) {
  _$jscoverage['builder/handlers/scripts.js'][20]++;
  if (error) {
    _$jscoverage['builder/handlers/scripts.js'][21]++;
    builder.emit("error", "Script Build failed when trying to create directory: [%s]".error.message);
  }
  _$jscoverage['builder/handlers/scripts.js'][25]++;
  mkdir(resolve(component.build.scripts.out), (function (error) {
  _$jscoverage['builder/handlers/scripts.js'][27]++;
  if (error) {
    _$jscoverage['builder/handlers/scripts.js'][28]++;
    builder.emit("error", "Script Build failed when trying to create directory: [%s]".error.message);
  }
  _$jscoverage['builder/handlers/scripts.js'][31]++;
  var js = [obj.js,];
  _$jscoverage['builder/handlers/scripts.js'][37]++;
  var umd = ["if (typeof exports == \"object\") {", "  module.exports = require(\"" + builder.config.name + "\");", "} else if (typeof define == \"function\" && define.amd) {", "  define(function(){ return require(\"" + builder.config.name + "\"); });", "} else {", "  this[\"" + builder.config.name + "\"] = require(\"" + builder.config.name + "\");", "}"];
  _$jscoverage['builder/handlers/scripts.js'][52]++;
  fs.writeFile(resolve(component.build.scripts.out, component.config.basename + ".js"), js.join("\n\n"), (function (error) {
  _$jscoverage['builder/handlers/scripts.js'][54]++;
  if (error) {
    _$jscoverage['builder/handlers/scripts.js'][55]++;
    builder.emit("error", "Scripts [%s] built with error: [%s].", builder.config.name, error.message);
  }
  else {
    _$jscoverage['builder/handlers/scripts.js'][57]++;
    builder.emit("verbose", "Scripts [%s] built.", builder.config.name);
  }
}));
}));
}));
});
_$jscoverage['builder/handlers/scripts.js'].source = ["/**"," * Compile JavaScript"," *"," * @param builder"," */","module.exports = function build( builder ) {","  var self = this;","  var extname = require( 'path' ).extname;","  var basename = require( 'path' ).basename;","  var resolve = require( 'path' ).resolve;","  var join_path = require( 'path' ).join;","  var Batch = require( 'batch' );","  var fs = require( 'fs' );","  var read = fs.readFileSync;","  var mkdir = require( 'mkdirp' );","  var component = builder.config;","","  builder.build( function complete( error, obj ) {","","    if( error ) {","      builder.emit( 'error', 'Script Build failed when trying to create directory: [%s]'. error.message );","    }","","    // Create Directory.","    mkdir( resolve( component.build.scripts.out ), function( error ) {","","      if( error ) {","        builder.emit( 'error', 'Script Build failed when trying to create directory: [%s]'. error.message );","      }","","      var js = [","        //obj.require,","        obj.js,","        //'( function() {'","      ];","","      var umd = [","        'if (typeof exports == \"object\") {',","        '  module.exports = require(\"' + builder.config.name + '\");',","        '} else if (typeof define == \"function\" &amp;&amp; define.amd) {',","        '  define(function(){ return require(\"' + builder.config.name + '\"); });',","        '} else {',","        '  this[\"' + builder.config.name + '\"] = require(\"' + builder.config.name + '\");',","        '}'","      ];","","      //js.push( umd.join( '\\n' ) );","","      //js.push( '})();' );","","      // Write compiled file to output directory.","      fs.writeFile( resolve( component.build.scripts.out, component.config.basename + '.js' ), js.join( \"\\n\\n\" ), function( error ) {","","        if( error ) {","          builder.emit( 'error', 'Scripts [%s] built with error: [%s].', builder.config.name, error.message );","        } else {","          builder.emit( 'verbose', 'Scripts [%s] built.', builder.config.name );","        }","","        // console.log( obj );","","      } );","","    });","","  });","","}"];
