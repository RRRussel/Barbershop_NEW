// Компиляция LESS
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    compileLESS = require('gulp-less'),
    minCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber');

gulp.task('style', function(done) {
    gulp.src('less/style.less')
        .pipe(plumber())
        .pipe(compileLESS())
        .pipe(autoprefixer())
        .pipe(minCSS())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream())

    done();
});

gulp.task('serve', function(done) {


    browserSync.init({
        server: "."
    });

    gulp.watch("less/**/*.less", gulp.parallel('style'));
    gulp.watch("*.html") .on('change', browserSync.reload);

    done();
});

gulp.task('default', gulp.series( 'serve', 'style' ));


