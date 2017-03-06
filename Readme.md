#darkenize.js

There is many plugins or application for changing to dark-theme. However, It changes only the frame of application such as Chrome. To change to dark-theme in web page, developer has to implement style sheet for dark-theme. **darkenize.js** can generate automatically the dark color of the currently applied color.

##Features

- Generate automatically the dark color value of the currently applied color


##How

1. Select all elements excluding the predefined element
1. Change the color space from RGB to HSV
2. Control the brightness by threshold and element-type (e.g. text, container and etc)

##Future work

I am planning to implement command line version for node.js. In command line, It can generate automatically the dark-theme style sheet.

##Reference

[darkenize-chrome-extension](https://github.com/se0kjun/darkenize-chrome-extension)