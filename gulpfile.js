var gulp = require('gulp'),
    del = require('del'),
    compileLESS = require('gulp-less'),
    plumber = require('gulp-plumber'),
    minCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    rename = require('gulp-rename'),
    svgstore = require('gulp-svgstore'),
    posthtml = require('gulp-posthtml'),
    include = require('posthtml-include'),
    browserSync = require('browser-sync').create();

// Работа с изображениями
// Перевод изображений в WebP
gulp.task('webp', function() {
    return gulp.src('img/*.{png,jpg}')
        .pipe(webp({quality: 90}))

        .pipe(gulp.dest('img'));
});

// Сжатие изображений
gulp.task('image', function() {
    return gulp.src('img/*.{png,jpg,svg}')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))

        .pipe(gulp.dest('img'));
});

gulp.task('images', 
    gulp.parallel(
        'webp',
        'image'
    )
);

//ПОДГОТОВКА СБОРКИ
//Копирование файлов для создания готового проекта
gulp.task('copy', function() {
    return gulp.src([
        'img/**',
        'js/**',
        'fonts/**'
    ], {
        base: '.'
    })
        .pipe(gulp.dest('build'));
});

//Удаление
gulp.task('clean', function() {
    return del('build');
});

// Компиляция LESS
gulp.task('style', function(done) {
    gulp.src('less/style.less')
        .pipe(plumber())
        .pipe(compileLESS())
        .pipe(autoprefixer())
        .pipe(gulp.dest('build/css'))
        .pipe(minCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));

    done();
});

//Создание SVG-спрайта
gulp.task('sprite', function() {
    return gulp.src('img/*.svg')
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))

        .pipe(gulp.dest('build/img'));
});

//Замена svg-шников спрайтом 
gulp.task('html', function(){
    return gulp.src('*.html')
        .pipe(posthtml([
            include()
        ]))

        .pipe(gulp.dest('build'));
});

gulp.task('build', 
    gulp.series(
        'clean',
        'copy',
        'style',
        'sprite',
        'html'
    )
);

//Сервер
gulp.task('serve', function(done) {
    browserSync.init({
        server: "build/"
    });

    gulp.watch("less/**/*.less", gulp.series('style'));
    gulp.watch("*.html", gulp.series('html'));

    done();
});