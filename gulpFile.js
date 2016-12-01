var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require("gulp-sourcemaps"),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    es = require('event-stream'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    nano = require('gulp-cssnano');


var url = 'local.version10.ca/edouard/';
var basePath = '';

gulp.task('scripts', function(){
    var js = gulp.src('./js/*.js');

    return js
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./js/build"));
});


gulp.task('less', function(){
    return gulp.src('./styles/less/styles.less')
        .pipe(plumber(function (error) { //affiche erreur si il y a, sans crasher le watch
            // Output an error message
            gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
            // emit the end event, to properly end the task
            this.emit('end');
        }))
        .pipe(concat('styles.min.css'))
        .pipe(less({
            modifyVars: {
                path_bower:'~"../../../bower_components/"'
                //path : '~"../../images/build/"' //modification du path des images en prod
            }
        }))
        .pipe(nano({zindex:false}))
        .pipe(gulp.dest('./styles/css'))
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('browser-sync', function() {
    browserSync.init([
        basePath + '/styles/css/**/*.css',
        basePath + '/js/**/*.js'
        ], {
        proxy: url
    });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});


gulp.task('watch',['browser-sync'], function (){
    gulp.watch('js/*.{js,coffee}', ['scripts']);
    gulp.watch('styles/less/**/*.less', ['less']);

    gulp.watch("styles/**/*.css", ['bs-reload']);
    gulp.watch("*.html", ['bs-reload']);
});

// Default Task
gulp.task('default', ['scripts', 'less', 'watch']);
