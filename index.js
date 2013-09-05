/**
 * UPM Loader
 *
 * for upm
 * author: potanin@UD
 */
module.exports = process.env.APP_COVERAGE ? require( './static/lib-cov/upm' ) : require( './lib/upm' );
