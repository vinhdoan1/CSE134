var minify = require('gulp-minifier');
var gulp = require('gulp');

gulp.task('default', function() {
  return gulp.src('hw5/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
  })).pipe(gulp.dest('build'));
});
