#!/usr/bin/env node
const {execSync} = require('child_process');
const path = require('path');

function run(command) {
  console.log(`$ ${command}`);
  execSync(command, {stdio: 'inherit'});
}

const projectRoot = path.resolve(__dirname, '..');
const iosProject = path.join(projectRoot, 'ios');

run(`cd ${iosProject} && xcodebuild -workspace RFCodes.xcworkspace -scheme RFCodes -configuration Debug -sdk iphonesimulator`);

console.log('Сборка завершена. Запустите симулятор командой:');
console.log('xcrun simctl install booted build/Debug-iphonesimulator/RFCodes.app');
console.log('xcrun simctl launch booted com.example.rfcodes');
