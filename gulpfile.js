require('dotenv').config()

const gulp = require('gulp')
const rsync = require('gulp-rsync')

gulp.task('deploy', function() {

  // Dirs and Files to sync
  const rsyncPaths = ['dist']

  // Default options for rsync
  const rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
  };


  rsyncConf.hostname = process.env.HOSTNAME // hostname
  rsyncConf.username = process.env.USERNAME // ssh username
  rsyncConf.destination = process.env.DESTINATION // path where uploaded files go

  // Use gulp-rsync to sync the files
  return gulp.src(rsyncPaths).pipe(rsync(rsyncConf))
})
