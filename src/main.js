#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const fsu = require('./fileSystemUtils');
let config = require('./config').config;
let isCustomConfig = false;
try {
  config = require(process.cwd() + path.sep + 'cli_config.json');
  isCustomConfig = true;
  console.log('Using custom config from cli_config.json.');
} catch (e) {}

const commandArguments = process.argv.slice(2);

const executionPath = process.cwd() + path.sep + 'src';

checkForGenerateCommand();

function checkForGenerateCommand() {
  if (commandArguments[0] === 'g' || commandArguments[0] === 'generate') {
    console.log('Generating required templates...');
    let customBuild;
    let componentPath = commandArguments[1];
    if (commandArguments.length == 3) {
      customBuild = commandArguments[1];
      componentPath = commandArguments[2];
      if (config.hasOwnProperty(customBuild)) {
        console.log('Using build with name ' + customBuild);
      } else {
        console.log(
          'Build with name ' + customBuild + 'not found. Using default.'
        );
        customBuild = undefined;
      }
    }
    executeGenerateCommand(customBuild, componentPath);
  } else {
    console.log('invalid command ' + "'" + commandArguments[0] + " '");
    process.exit();
  }
}

function executeGenerateCommand(buildType, componentPath) {
  const pathLength = getTargetPathLength(componentPath);
  if (pathLength == 0) {
    console.log('invalid component name');
    process.exit();
  } else {
    createDirectories(componentPath.split('/'));
    createRequiredFiles(componentPath.split('/'), buildType);
  }
}

function getTargetPathLength(componentPath) {
  const pathElements = componentPath.split('/');
  return pathElements.length;
}

function createDirectories(pathElements) {
  let newComponentPath = addElementsToDirPath(pathElements, executionPath);
  fsu.createNecessaryFoldersForPath(newComponentPath);
}

function createRequiredFiles(pathElements, buildType) {
  const componentName = pathElements[pathElements.length - 1];
  const templates = buildType
    ? config[buildType]
    : config.defaultBuild
    ? config.defaultBuild
    : config.build;
  if (!templates) {
    console.log(
      'No builds found. Try to use default one or check your cli_config.json.'
    );
    process.exit();
  }
  const templatesData = [];
  let counter = 0;

  const templatesDataFetchedCb = function() {
    for (let k = 0; k < templates.length; k++) {
      let template = templates[k];
      let dataToWrite = templatesData[k];
      dataToWrite = dataToWrite.replace(/\(component_name\)/g, componentName);
      let fileName = componentName + template.extension;
      let userPathElements = JSON.parse(JSON.stringify(pathElements));
      userPathElements.splice(userPathElements.length - 1, 1);
      const startingPath = addElementsToDirPath(
        userPathElements,
        executionPath
      );

      let pathToFile = startingPath + path.sep + fileName;

      fsu.saveToFile(dataToWrite, pathToFile);
    }
  };

  const counterCallback = function() {
    counter++;
    if (counter === templates.length) {
      templatesDataFetchedCb();
    }
  };
  readTemplatesData(templatesData, counterCallback, templates);
}

function readTemplatesData(target, cb, templates) {
  let startingDir = __dirname;
  if (isCustomConfig) {
    startingDir = process.cwd();
  }

  for (let k = 0; k < templates.length; k++) {
    let templatePath = templates[k].templatePath;
    templatePath = addElementsToDirPath(templatePath.split('/'), startingDir);
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
