# REACT CLI FOR GENERATING COMPONENTS WITH TEMPLATES

This small React library will help you generate/create your new component!
Command inspired by Angular 'ng generate component'.

# Install

`npm install -g cli-rct`

# Use

`rct g path/to/new/component`

Last part of the path is always the component name. First letter will be uppercased if necessary.
By default basic component will be generated along with simple test file and empty CSS sheet.
It also replaces all occurances of '(component_name)' in templates with the component name from path.

It's also configurable!

If you want to use your own instructions simply provide cli_config.json in the root directory of your project. It should have following structure:

```
{
    "defaultBuild":[ // array of templates to use
    {
        "description" : "Description of template", // optional description field.
        "templatePath" : "path/to/template", // path to a txt file containing file content.
        //Relative to cli_config.json
        "extension" : :".example" // extension that will be added to generated file.
        }
    ],
    <your_custom_name> : [
        <template_object>,
        <template_object>
    ]
}

```

As you can see, you can have more then one build specified. To use your custom build use following command:

`rct g <your_custom_name> path/to/new/component`

This way you will generate templates found in <your_custom_name> array.

Example:

```
{
    "defaultBuild":[
        ... default build tempaltes
    ],
    "my_build" : [
        {
        "description" : "My custom template",
        "templatePath" : "path/to/template",
        "extension" : :".example"
        }
    ]
}

```

With this looking cli_config.json use following command:

`rct g my_build test/Component`

You will generate file test/Component.example specified in my_build array. Without specifying any name, defaultBuild will be executed.
