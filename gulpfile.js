var { exec } = require('child_process');
const { series, parallel, src, dest } = require('gulp');
function defaultTask(cb) {
  // task code goes here 
  cb();
}

function myDate(cb) {
  console.log('Calling  Mydate');
  cb();
}

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = defaultTask;
exports.date = myDate;
// exports.stream = streamTask;