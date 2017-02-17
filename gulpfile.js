'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var getLmnTask = require('lmn-gulp-tasks');

gulp.task('js', function () {
    gulp.src(['./src/jquery.js', './src/index.js'])
        .pipe(concat('darkenize.min.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['js'], function () {
	gulp.watch(['src/*.js'], ['js']);
});
