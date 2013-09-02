UDX is a CLI client for working with modular packages.

  As soon as you have a composer.json in a directory, that directory is a package.
  When you add a require to a project, you are making a package that depends on other packages.
  The only difference between your project and libraries is that your project is a package without a name.


## Usage
The follow are abstracted CLI commands that are repository/platform independent.
All CLI commands always execute in the current working directory.

  udx-create           create a new package.json file, makefile and other scaffolding
  udx-update           updates dependancies of
  udx-install          install a new dependancy or update all existing dependancies
  udx-build            compile the package and prepare for distribution
  udx-deploy           deploy code to a web server
  udx-push             commit package to repository
  udx-pull             pull package from repository

## Supported Repositories and Dependency Managers

### Packagist
For PHP libraries the Packagist repository is used which is strongly based on NPM.
Composer works with Packagist.org, GitHub, SVN as well as with ZIP, Tar and text files accessible via the web.
Packagist must all loaded into the same directory (usually called Vendor).

### NPM
The Node.js repository is supported inherently since udx is a Node.js module.

### Git & SVN
UDX recognizes when working within a Git or SVN repository and will commit code to either one.

### Composer
Composer is a tool for dependency management in PHP that uses Packagist as well as others.
It allows you to declare the dependent libraries your project needs and it will install them in your project for you.

### Component.io
For front-end libraries that may include JavaScript, CSS, images and even fonts the Component package type is best.
Component will handle combining scripts and styles and fixing URLs.

## Coming Later
 - Bower
 - WordPress.org

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
