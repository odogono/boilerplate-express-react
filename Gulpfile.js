const Gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const Del = require('rimraf');
const Envify = require('envify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const Path = require('path');
const Sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const Webserver = require('gulp-webserver');
const Uglify = require('gulp-uglify');
const UnreachableBranchTransform = require('unreachable-branch-transform');

const Livereload = require('gulp-livereload');
const Nodemon = require('gulp-nodemon');

const clientEntry = './src/client/index.js';
const serverEntry = './src/server/index.js';

const vendorBundle = './web/js/vendor.js';
const clientBundle = './web/js/app.js';

const vendors = [
  'react', 
  'react-dom', 
  'underscore'
];

const log = {
    info: console.log,
    error: console.log
};

const PROCESS_ENV = process.env.NODE_ENV || 'development';

Gulp.task('clean', () => {
  Del.sync( clientBundle );
  Del.sync( vendorBundle );
});

Gulp.task('build.bundle.vendor', () => {
  const b = browserify({
    debug: true
  });

  // require all libs specified in vendors array
  vendors.forEach(lib => b.require(lib) );

  b.bundle()
  .pipe(source( Path.basename(vendorBundle) ))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  // .pipe(Uglify())
  .pipe(sourcemaps.write('./maps'))
  .pipe(Gulp.dest(Path.dirname(vendorBundle)))
  .on('error', err => console.log("Error : ", err.message))
  ;
});

Gulp.task('build.bundle.client', cb => {
  const b = browserify({
    entries: [ clientEntry ],
    debug: true
  });

  b.external(vendors) // Specify all vendors as external source
  .transform( babelify, {
      presets:[ "es2015-node", 'stage-0', 'react' ],
  })
  .transform( Envify, {
      _: 'purge',
      NODE_ENV: PROCESS_ENV,
      PLATFORM_ENV: 'browser'
  })
  .transform( UnreachableBranchTransform )
  .bundle()
  .pipe(source( Path.basename(clientBundle) ))
  .pipe(buffer())
  // .pipe(sourcemaps.init({loadMaps: true}))
  // .pipe(Uglify())

  // .pipe(sourcemaps.write('./maps'))
  .pipe( Gulp.dest (Path.dirname(clientBundle)) )
  .on('error', err => console.log("Error : ", err.message))
  .on('finish', () => {
      log.info('finished building client');
      Livereload.reload();
      return cb();
  })
  ;
});

Gulp.task('watch', function() {
    Gulp.watch( 'src/**/*', ['build.bundle.client'] );
    Gulp.watch( 'web/scss/**/*.scss', ['build.styles'] );
});


Gulp.task('build.styles', function(cb){
    return Gulp.src('./web/scss/*.scss')
            .pipe(Sass())
            .on('error', function(err){
                return cb('error with sass: ' + err.message );
            })
            .pipe(Gulp.dest('./web/css'))
            .pipe(Livereload());
});


Gulp.task('webserver', function (cb) {
    // NOTE - tiny-lr is not yet npm3 compatible
    // var lrPath = Path.join(__dirname, 'node_modules/livereload-js/dist/livereload.js')
    Livereload.listen(); // {livereload:lrPath}
    console.log('serve: started')
    Nodemon({
        script  : 'src/server/index.js',
        execMap: {
            "js": "babel-node --presets es2015-node,react"
        },
        env: {
            'NODE_ENV': 'development'
        },
        watch: [ 'src/server', 'src/shared', 'src/server/index.js' ]
        //...add nodeArgs: ['--debug=5858'] to debug 
        //..or nodeArgs: ['--debug-brk=5858'] to debug at server start
    })
    .on('restart', function () {
        // use a timeout to give the server time to come back up
        // - a pity this has to happen really!
        setTimeout( () => Livereload.reload(),2500 );
    });
});

// Gulp.task('default', ['build:app', 'build:vendor']);

Gulp.task('build', [ 'build.styles', 'build.bundle.vendor', 'build.bundle.client'] );
// Gulp.task('default', ['build.styles', 'serve', 'watch']);

Gulp.task('default', ['build', 'webserver', 'watch']);
