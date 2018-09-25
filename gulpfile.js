const gulp = require("gulp");
gulp.task('css', function () {
    const postcss = require('gulp-postcss');
    const tailwindcss = require('tailwindcss');
    return gulp.src('./tailwind.css')
        .pipe(postcss([
            tailwindcss('./tailwind-config.js'),
            require('autoprefixer'),
        ]))
        .pipe(gulp.dest('src/'));
});