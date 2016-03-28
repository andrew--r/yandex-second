import gulp       from 'gulp';
import uglify     from 'gulp-uglify';
import source     from 'vinyl-source-stream';
import buffer     from 'vinyl-buffer';
import browserify from 'browserify';
import babel      from 'babelify';
import pjson      from './package.json';


gulp.task('js', () => {
	let bundler = browserify(`src/main.js`, { debug: true }).transform(babel);
	return bundler
		.bundle()
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(source(pjson.name))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', () => {
	gulp.watch('src/*.js', ['js']);
});