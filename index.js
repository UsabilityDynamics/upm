/**
 * author: potanin@UD
 *
 */
module.exports = process.env.APP_COVERAGE ? require( './static/lib-cov/udx' ) : require( './lib/udx' );
