const chokidar = require('chokidar');
const spawn = require('child_process').spawn;

console.log('Loaded');

const solhintBinary = 'solhint'
const watchDir = '.';
const events = {
  add: 'add',
  change: 'change'
}
const chokidarOptions = {
  ignored: /\.git|node_modules/,
  ignoreInitial: true
};

function watch(options) {
  function runSolhint(path) {
    console.log('Running Solhint on: %s', path);

    const solhint = spawn(solhintBinary, [path]);

    solhint.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    solhint.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    solhint.on('close', (code) => {
      console.log(`Solhint exited with code ${code}`);
    });
  }

  chokidar
    .watch(watchDir, chokidarOptions)
    .on(events.add, (path) => runSolhint(path))
    .on(events.change, (path) => runSolhint(path))
    .on('error', () => console.log('error'));

  console.log('Watching: %o', watchDir);
};

watch();
