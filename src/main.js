#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const fsu = require('./fileSystemUtils');
const config = require('./config').config;

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
  }
}

function createDirectories(pathElements) {
  let newComponentPath = addElementsToDirPath(pathElements, executionPath);
  fsu.createNecessaryFoldersForPath(newComponentPath);
  createRequiredFiles(newComponentPath);
}

function createRequiredFiles(pathToCreate) {
  const pathElements = pathToCreate.split(path.sep);

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

  for (let k = 0; k < config.build.length; k++) {
    let templatePath = config.build[k].templatePath;
    templatePath = addElementsToDirPath(
      templatePath.split('/'),
      __dirname
    );
    fsu.readTemplate(templatePath).then(data => {
      templatesData[k] = data;
      counterCallback();
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
