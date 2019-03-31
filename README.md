# REACT CLI FOR GENERATING COMPONENTS WITH TEMPLATES

This small React library will help you generate/create your new component!
Command inspired by Angular 'ng generate component'.

# Install

```npm install -g cli-rct```

# Use

```rct g path/to/new/component```

Last part of the path is always the component name. First letter will be uppercased if necessary.
By default basic component will be generated along with simple test file and empty CSS sheet.

It's also configurable!

If you want to use your own instructions simply provide cli_config.json in the root directory of your project. It should have following structure:

```
{
    "build":[ // array of templates to use
    {
        "description" : "Description of template", // optional description field.
        "templatePath" : "path/to/template", // path to a txt file containing file content.
        //Relative to cli_config.json
        "extension" : :".example" // extension that will be added to generated file.
        }
    ]
}

```
