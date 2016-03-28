import gulp       from 'gulp';
import babel      from 'gulp-babel';
import pjson      from './package.json';


gulp.task('js', () => {
	return gulp
		.src('./src/main.js')
		.pipe(babel())
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', () => {
	gulp.watch('src/*.js', ['js']);
});