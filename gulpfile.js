/* eslint-env node */

const gulp = require('gulp');
// const sass = require("gulp-sass");
// const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('lint', function() {
  return gulp.src(['js/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

const defaultFunction = function() {
  browserSync.init({
    server: './dist',
  });
  gulp.watch('index.html', gulp.series('copy-html'));
  gulp.watch('js/**/*.js', gulp.series('copy-js'));
  gulp.watch('css/*.css', gulp.series('copy-css'));
  gulp.watch('dist/**/*.*').on('change', reload);
};

gulp.task('copy-html', function() {
  return gulp.src('./index.html')
      .pipe(gulp.dest('./dist'));
});

gulp.task('copy-css', function() {
  return gulp.src('./css/*')
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-js', function() {
  return gulp.src([
    './js/resources.js',
    './js/engine.js',
    './js/player.js',
    './js/bonus.js',
    './js/app.js',
  ])
      .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      // .pipe(babel({
      //   presets: ['@babel/env'],
      // }))
      // .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-images', function() {
  return gulp.src('./images/*')
      .pipe(imagemin([imagemin.optipng(), pngquant()]))
      .pipe(gulp.dest('./dist/images'));
});

gulp.task('delete-dist-folder', function() {
  return gulp.src('./dist', {read: false})
      .pipe(clean());
});

gulp.task('copy-files',
    gulp.parallel('copy-html', 'copy-css', 'copy-js', 'copy-images'));

gulp.task('default',
    gulp.series('delete-dist-folder', 'copy-files', defaultFunction));


// gulp.task('styles', function() {
//     gulp.src('sass/**/*.scss')
//         .pipe(sass())
//         .on('error', sass.logError)
//         .pipe(
//             autoprefixer({
//               browsers: ["last 2 versions"]
//             })
//           )
//         .pipe(gulp.dest('./css'))
//         .pipe(browserSync.stream());

//     console.log("Styles!");
// });

