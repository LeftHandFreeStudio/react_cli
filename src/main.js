#! /usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const r = require('./readTemplates');
const config = require('./config').config;

const commandArguments = process.argv.slice(2);

const executionPath = process.cwd();

checkForGenerateCommand();

function checkForGenerateCommand() {
  if (commandArguments[0] === 'g' || commandArguments[0] === 'generate') {
    console.log('generating component');
    executeGenerateCommand();
  } else {
    console.log('invalid command ' + "'" + commandArguments[0] + " '");
    process.exit();
  }
}

function executeGenerateCommand() {
  validateComponentName();
}

function validateComponentName() {
  const componentPath = commandArguments[1];
  const pathElements = componentPath.split('/');
  let componentName = '';
  if (pathElements.length == 0) {
    console.log('invalid component name');
    process.exit();
  } else {
    console.log('creating directories');
    createDirectories(pathElements);
  }
}

function createDirectories(pathElements) {
  let newComponentPath = path.join(process.cwd(), pathElements[0]);
  for (let k = 1; k < pathElements.length; k++) {
    newComponentPath = path.join(newComponentPath, pathElements[k]);
  }
  ensureDirectoryExistence(newComponentPath);
  createRequiredFiles(newComponentPath);
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function createRequiredFiles(pathToCreate) {
  const pathElements = pathToCreate.split(path.sep);
  console.log(pathElements);

  const componentName = pathElements[pathElements.length - 1];
  const templatesData = [];
  let counter = 0;

  const readDataCallback = function() {
    for (let k = 0; k < config.build.length; k++) {
      let template = config.build[k];
      let dataToWrite = templatesData[k];
      dataToWrite = dataToWrite.replace(/\(component_name\)/g, componentName);
      let fileName = componentName + template.extension;
      let userPathElements = commandArguments[1].split('/');
      userPathElements.splice(userPathElements.length - 1, 1);
      const startingPath = createPathToFileFromArray(
        userPathElements,
        process.cwd()
      );

      let pathToFile = startingPath + path.sep + fileName;

      fs.writeFile(pathToFile, dataToWrite, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log(pathToFile + ' created!');
      });
    }
  };

  const counterCallback = function() {
    counter++;
    if (counter === config.build.length) {
      readDataCallback();
    }
  };

  for (let k = 0; k < config.build.length; k++) {
    let templatePath = config.build[k].templatePath;
    templatePath = createPathToFileFromArray(
      templatePath.split('/'),
      __dirname
    );
    r.readTemplate(templatePath).then(data => {
      templatesData[k] = data;
      counterCallback();
    });
  }
}

function createPathToFileFromArray(pathArray, startingDir) {
  if (pathArray.length === 0) {
    return startingDir;
  }

  let pathToReturn = path.join(startingDir, pathArray[0]);
  for (let k = 1; k < pathArray.length; k++) {
    pathToReturn = path.join(pathToReturn, pathArray[k]);
  }
  return pathToReturn;
}

function applyReplacements(replacements, dataToReplace) {
  for (let k = 0; k < replacements.length; k++) {
    let replacement = replacements[k];
  }
}
