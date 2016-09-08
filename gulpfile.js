'use strict';


var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var getLmnTask = require('lmn-gulp-tasks');

gulp.task('js', function () {
    gulp.src('./src/index.js')
        .pipe(concat('darkenize.min.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest('./dist'));
});

// gulp.task('js', getLmnTask('browserify', {
// 	src: './src/index.js',
// 	dest: './dist/darkenize.min.js',
// 	minify: true,
// 	onError: function (err) {
// 		console.log('The browserify task died!');
// 		console.log(err);
// 	}

// }));

gulp.task('default', ['js'], function () {
	gulp.watch(['src/*.js'], ['js']);
});
