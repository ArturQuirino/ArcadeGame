const gulp = require("gulp");
// const sass = require("gulp-sass");
// const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task("default", function(){
    browserSync.init({
        server: "./"
    })

    gulp.watch("**/*.*").on("change", reload);
    console.log("default!");
});



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

