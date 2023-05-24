const { spawn } = require('child_process');
const fs = require('fs')
const path = require('path')

// run vite build --watch
const vite = spawn('node', [path.resolve(__dirname, 'node_modules/vite/bin/vite.js'), 'build', '--watch']);
vite.stdout.pipe(process.stdout)
vite.stderr.pipe(process.stdout)

// Mock Windows root directory has change
let count = 0
const root = path.relative(__dirname, '/')
const fakeDir = path.resolve(path.join(root, 'vite-windows-build-watch-error-dir'))
const timer = setInterval(() => {
    count++
    fs.existsSync(fakeDir) ? fs.rmdirSync(fakeDir) : fs.mkdirSync(fakeDir)
    if (count >= 5 || vite.exitCode) {
        clearInterval(timer)
        vite?.kill()
    }
}, 1000)

