/* eslint-env node */

const gulp = require('gulp');
// const sass = require("gulp-sass");
// const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(['js/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

const defaultFunction = function() {
  browserSync.init({
    server: './',
  });
  console.log('teste');
  gulp.watch('**/*.*').on('change', reload);
  gulp.watch('js/**/*.js', gulp.series('lint'));
};

gulp.task('default', gulp.series('lint', defaultFunction));


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

