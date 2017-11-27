var gulp = require('gulp');
var browserSync = require('browser-sync').create();
browserSync.init({
    server: "./"
});
 browserSync.stream();

gulp.task('default', function(){
	console.log('Here we go');
	gulp.watch('css/**/*.css',['reload']);
	gulp.watch('./*.html',['reload']);
	gulp.watch('js/**/*.js',['reload']);
});

gulp.task('reload', function () {
    browserSync.reload();
});