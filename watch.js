
var cp = require('child_process');

var chokidar = require('chokidar');

watch('css/**/*.styl', 'build-css');
watch('scripts/**/*.js', 'build-js');
watch('public/js/main-dev.js', 'uglify-js');
watch('views/**/*.jade', 'build-html');

function watch (path, cmd) {
  run(cmd);
  chokidar.watch(path)
    .on('change', () => run(cmd));
}

function run (cmd) {
  const child = cp.spawn('npm', ['run', cmd]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
