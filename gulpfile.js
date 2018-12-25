const gulp = require('gulp');
const mocha = require('gulp-mocha');
const log = require('gulplog');

gulp.task('mocha', () => {
  gulp.src(['./server/test/**'], { read: false })
    .pipe(mocha({
      reporter: 'list',
      exit: true,
      require: '@babel/register'
    }))
    .on('error', log.error);
});

gulp.task('watch-mocha', ['mocha'], () => {
  gulp.watch(['./server/test/**'], ['mocha']);
});

gulp.task('default', ['watch-mocha']);
