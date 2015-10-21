
var cp = require('child_process')

var chokidar = require('chokidar')

watch('css/**/*.styl', 'npm run build-css')
watch('scripts/**/*.js', 'npm run build-js')
watch('views/**/*.jade', 'npm run build-html')

function watch (path, cmd, cb) {
  chokidar.watch(path)
    .on('change', execCurry(cmd, cb))
}

function execCurry (cmd, cb) {
  return function () {
    exec(cmd, cb)
  }
}

function exec (cmd, cb) {
  cp.exec(cmd, function (err, stdout, stderr) {
    err && console.error(err)
    stdout && console.log(stdout)
    stderr && console.error(stderr)

    cb && cb(err, stdout, stderr)
  })
}
