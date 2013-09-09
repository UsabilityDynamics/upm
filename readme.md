UPM is a CLI client for working with modules and packages that span accross multiple super projects most with their own repositories.

 * Integrate and reuse Packages within other projects.
 * Packages should be free to move around yet still stay in synchronization with their own repository.
 * UPM prevents multiple instance of a Package from falling out of synchronization.
 * UPM can be used to create a new Package, define and download dependancies, generate a build and push back to own repository without any conflict from the super repository.

## Usage
The follow are abstracted CLI commands that are repository/platform independent.
All CLI commands always execute in the current working directory.

  upm create           initialize a new package.json file, makefile and other scaffolding
  upm update           install or update dependancies and compile/build addets
  upm install          install a new dependancy or update all existing dependancies
  upm deploy           deploy code to a web server
  upm push             commit package to repository
  upm pull             pull package from repository

## Supported Repositories and Dependency Managers

### Used Compiler Libraries
UPM utlizes third-party libraries for compiling different files.

  * [Recess](https://github.com/twitter/recess) - LESS compiler developed by Twitter.
  * [UglifyJS 2](https://github.com/mishoo/UglifyJS2) - JavaScript compressor.
  * [YUI Compressor](https://github.com/yui/yuicompressor) - Yahoo! CSS compressor.
  * PHP libraries are not compiled but organized in a way that supports autoloading PSR-0 packages.

## Changelog

### 0.0.3
 - Added native support for views, schemas and libs (PHP files).
 - Added dedicated JS, LESS, CSS and PHP build handlers.
 - Added compile support to mimick Composer.js structure.

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
