const fs = require('fs');
module.exports.readTemplate = function(path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', function(err, data) {
      resolve(data);
    });
  });
};
