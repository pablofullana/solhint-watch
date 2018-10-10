const chokidar = require('chokidar')
const spawn = require('child_process').spawn
const keypress = require('keypress')

const solhintBinary = 'solhint'
const watchDir = './**/*.sol'
const events = {
  add: 'add',
  change: 'change'
}
const chokidarOptions = {
  ignored: /\.git|node_modules/,
  ignoreInitial: true
};


function runSolhint(path) {
  console.clear()
  console.log('Running Solhint on: %s', path)

  const solhint = spawn(solhintBinary, [path])

  solhint.stdout.on('data', (data) => console.log(`${data}`))
  solhint.stderr.on('data', (data) => console.log(`${data}`))

  solhint.on('close', (code) => console.log(`Solhint exited with code ${code}`))
}

function watch(options) {
  chokidar
    .watch(watchDir, chokidarOptions)
    .on(events.add, (path) => runSolhint(path))
    .on(events.change, (path) => runSolhint(path))
    .on('error', () => console.log('error'))

  console.log('Watching: %o', watchDir);
}

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name == 'enter') {
    runSolhint(watchDir)
  }
});

keypress(process.stdin);
console.clear()
console.log('Loaded')
watch()
