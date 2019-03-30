module.exports.config = {
  build: [
    {
      description: 'Component template',
      templatePath: '../templates/default/defaultComponentTemplate.txt',
      extension: '.js'
    },
    {
      description: 'Component tests template',
      templatePath: '../templates/default/defaultTestsTemplate.txt',
      extension: '.test.js'
    },
    {
      description: 'Component CSS template',
      templatePath: '../templates/default/defaultCssTemplate.txt',
      extension: '.css'
    }
  ]
};
