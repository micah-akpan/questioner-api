const { exec } = require('child_process');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const log = require('gulplog');

gulp.task('test', () => {
  gulp.src(['./server/test/**'], { read: false })
    .pipe(mocha({
      reporter: 'list',
      exit: true,
      require: '@babel/register',
    }))
    .on('error', log.error);
});

gulp.task('coverage', (cb) => {
  exec('npm run coverage', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('watch-test', ['test'], () => {
  gulp.watch(['./server/test/**'], ['test']);
});

gulp.task('default', ['watch-test']);
