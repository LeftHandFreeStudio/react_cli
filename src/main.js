#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const fsu = require('./fileSystemUtils');
let config = require('./config').config;
let isCustomConfig = false;
try {
  config = require(process.cwd() + path.sep + 'cli_config.json');
  isCustomConfig = true;
} catch (e) {

}


const commandArguments = process.argv.slice(2);

const executionPath = process.cwd() + path.sep + 'src';

checkForGenerateCommand();

function checkForGenerateCommand() {
  if (commandArguments[0] === 'g' || commandArguments[0] === 'generate') {
    console.log('Generating required templates...');
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
  if (pathElements.length == 0) {
    console.log('invalid component name');
    process.exit();
  } else {
    createDirectories(pathElements);
    createRequiredFiles(pathElements);
  }
}

function createDirectories(pathElements) {
  let newComponentPath = addElementsToDirPath(pathElements, executionPath);
  fsu.createNecessaryFoldersForPath(newComponentPath);
}

function createRequiredFiles(pathElements) {
  const componentName = pathElements[pathElements.length - 1];
  const templatesData = [];
  let counter = 0;

  const templatesDataFetchedCb = function () {
    for (let k = 0; k < config.build.length; k++) {
      let template = config.build[k];
      let dataToWrite = templatesData[k];
      dataToWrite = dataToWrite.replace(/\(component_name\)/g, componentName);
      let fileName = componentName + template.extension;
      let userPathElements = commandArguments[1].split('/');
      userPathElements.splice(userPathElements.length - 1, 1);
      const startingPath = addElementsToDirPath(
        userPathElements,
        executionPath
      );

      let pathToFile = startingPath + path.sep + fileName;

      fsu.saveToFile(dataToWrite, pathToFile);
    }
  };

  const counterCallback = function () {
    counter++;
    if (counter === config.build.length) {
      templatesDataFetchedCb();
    }
  };
  readTemplatesData(templatesData, counterCallback);
}

function readTemplatesData(target, cb) {
  let startingDir = __dirname;
  if (isCustomConfig) {
    startingDir = process.cwd();
  }

  for (let k = 0; k < config.build.length; k++) {
    let templatePath = config.build[k].templatePath;
    templatePath = addElementsToDirPath(
      templatePath.split('/'),
      startingDir
    );
    fsu.readTemplate(templatePath).then(data => {
      target[k] = data;
      cb();
    });
  }
}

function addElementsToDirPath(elementsArray, startingDir) {
  if (elementsArray.length === 0) {
    return startingDir;
  }

  let pathToReturn = path.join(startingDir, elementsArray[0]);
  for (let k = 1; k < elementsArray.length; k++) {
    pathToReturn = path.join(pathToReturn, elementsArray[k]);
  }
  return pathToReturn;
}
