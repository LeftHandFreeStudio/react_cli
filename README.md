# REACT CLI FOR GENERATING COMPONENTS WITH TEMPLATES

This small React library will help you generate/create your new component!
Command inspired by Angular 'ng generate component'.

It's configurable!

Edit src/config.js in order to define your own generated files like so:
"build":[ <template_object>, <template_object>, <template_object> ]

Each <template_object> has following structure:

```
{
    "description" : "Description of template", // optional description field.
    "templatePath" : "path/to/template", // path to a txt file containing file content.
    "extension" : :".example" // extension that will be added to generated file.
}
```

# Install

```npm install -g cli-rct```
# Use

```rct g path/to/new/component```

Generates file based on configuration from config.js.
Last part of the path is always the component name. First letter will be uppercased if necessary.
By default basic component will be generated along with simple test file and empty CSS sheet.
