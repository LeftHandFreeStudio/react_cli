const fs = require('fs');
const path = require('path');

module.exports.readTemplate = function (path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', function (err, data) {
      resolve(data);
    });
  });
};

module.exports.saveToFile = function (dataToSave, path) {
  fs.writeFile(path, dataToSave, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('\x1b[32m', '    ' + path + ' created!');
  });
};



module.exports.createNecessaryFoldersForPath = function ensureDirectoryExists(filePath) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}
