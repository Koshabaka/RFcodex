#!/usr/bin/env node
const {execSync} = require('child_process');
const path = require('path');

function run(command, options = {}) {
  console.log(`$ ${command}`);
  execSync(command, {stdio: 'inherit', ...options});
}

const projectRoot = path.resolve(__dirname, '..');
const gradleWrapper = path.join(projectRoot, 'android', 'gradlew');

run(`cd ${projectRoot}/android && ./gradlew assembleDebug -PofflineMode=true`);

console.log('APK собран. Установите его командой:');
console.log('adb install -r app/build/outputs/apk/debug/app-debug.apk');
