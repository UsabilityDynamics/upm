## Overview
UPM is a CLI client for working with modules and packages that span accross multiple super projects most with their own repositories.

 * UPM is a Node.js command-line tool for rapidly building applications via the use of modular "Components"
 * UPM can compile LESS, minify CSS, optimize and compress JavaScript, import and auto-load PHP libraries, manage fonts, views and maintain Git/SVN repository integrity.
 * UPM can manage application and web service deployment and remote control via SSH.
 * UPM is based on Component.js, Composer.js and NPM and supports all three data packages.
 * UPM allows modular packages to freely move around different projects yet still stay in synchronization with their own repository.
 * UPM prevents multiple instance of a Package from falling out of synchronization.

## Usage
UPM is intended primarily for internal usage but is available to everybody.
All CLI commands always execute in the current working directory where the target project is expected to be.

  upm create           initialize a new package.json file, makefile and other scaffolding
  upm update           install or update dependancies and compile/build addets
  upm install          install a new dependancy or update all existing dependancies
  upm deploy           deploy code to a web server
  upm push             commit package to repository
  upm pull             pull package from repository

## Compilation Libraries
UPM utlizes third-party libraries for compiling different files.

  * [Recess](https://github.com/twitter/recess) - LESS compiler developed by Twitter.
  * [UglifyJS 2](https://github.com/mishoo/UglifyJS2) - JavaScript compressor.
  * [YUI Compressor](https://github.com/yui/yuicompressor) - Yahoo! CSS compressor.
  * PHP libraries are not compiled but organized in a way that supports autoloading PSR-0 packages.

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
