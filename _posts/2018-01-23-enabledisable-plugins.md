---
layout: page
title: "Enable/Disable plugins"
category: doc
date: 2018-01-23 21:21:37
order: 35
---

In theory, it's a relation **1:N** between an extension point and the extensions for this extension point.   
This works well, except for when you develop multiple plugins for this extension point as different options for your clients to decide on which one to use.  
In this situation you wish a possibility to disable all but one extension.   
For example I have an extension point for sending mail (EmailSender interface) with two extensions: one based on Sendgrid and another
based on Amazon Simple Email Service.   
The first extension is located in Plugin1 and the second extension is located in Plugin2.   
I want to go only with one extension ( **1:1** relation between extension point and extensions) and to achieve this I have two options:  
1) uninstall Plugin1 or Plugin2 (remove folder pluginX.zip and pluginX from plugins folder)  
2) disable Plugin1 or Plugin2  

For option two you must create a simple file **enabled.txt** or **disabled.txt** in your plugins folder.   
The content for **enabled.txt** is similar with:

```
########################################
# - load only these plugins
# - add one plugin id on each line
# - put this file in plugins folder
########################################
welcome-plugin
```

The content for **disabled.txt** is similar with:

```
########################################
# - load all plugins except these
# - add one plugin id on each line
# - put this file in plugins folder
########################################
welcome-plugin
```

All comment lines (line that start with # character) are ignored.   
If a file with enabled.txt exists then disabled.txt is ignored. See enabled.txt and disabled.txt from the demo folder.
