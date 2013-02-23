# Contributing

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

### Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

### PhantomJS
While grunt runs the included unit tests via [PhantomJS](http://phantomjs.org/), this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers **but please note** that the some of the tests will fail in a browser unless your time zone is `Europe/London`. The `gruntfile.js` will however correctly set the time zone for PhantomJS to ensure that the tests run during build will always use the expected time zone, regardless of your location. Remember, though, that it's only the _tests_ that expect to be in `Europe/London` - the plugin should work anywhere.

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that grunt's CLI is installed by running `grunt --version`.  If the command isn't found, run `npm install -g grunt-cli`.  For more information about installing grunt, see the [getting started guide](http://gruntjs.com/getting-started).

1. Fork and clone the repo.
1. Run `npm install` to install all dependencies (including grunt).
1. Run `grunt` to grunt this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `grunt` to see the tests fail.
1. Fix stuff.
1. Run `grunt` to see if the tests pass. Repeat steps 2-4 until done.
1. Open `test/*.html` unit test file(s) in actual browser to ensure tests pass everywhere.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.
