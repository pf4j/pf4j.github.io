---
layout: page
title: "Development mode"
category: doc
date: 2018-01-23 20:31:25
order: 30
---

PF4J can run in two modes: **DEVELOPMENT** and **DEPLOYMENT**.  
The DEPLOYMENT(default) mode is the standard workflow for plugins creation: create a new Maven module for each plugin, codding the plugin (declares new extension points and/or
add new extensions), pack the plugin in a zip file, deploy the zip file to plugins folder. These operations are time consuming and from this reason I introduced the DEVELOPMENT runtime mode.  
The main advantage of DEVELOPMENT runtime mode for a plugin developer is that he/she is not enforced to pack and deploy the plugins. In DEVELOPMENT mode you can developing plugins in a simple and fast mode.   

Lets describe how DEVELOPMENT runtime mode works.

First, you can change the runtime mode using the "pf4j.mode" system property or overriding `DefaultPluginManager.getRuntimeMode()`.  
For example I run the pf4j demo in eclipse in DEVELOPMENT mode adding only `"-Dpf4j.mode=development"` to the pf4j demo launcher.  
You can retrieve the current runtime mode using `PluginManager.getRuntimeMode()` or in your Plugin implementation with `getWrapper().getRuntimeMode()`(see [WelcomePlugin]({{ site.demourl }}/plugins/plugin1/src/main/java/org/pf4j/demo/welcome/WelcomePlugin.java)).   
The DefaultPluginManager determines automatically the correct runtime mode and for DEVELOPMENT mode overrides some components(pluginsDirectory is __"../plugins"__, __PropertiesPluginDescriptorFinder__ as PluginDescriptorFinder, __DevelopmentPluginClasspath__ as PluginClassPath).  
Another advantage of DEVELOPMENT runtime mode is that you can execute some code lines only in this mode (for example more debug messages).

**NOTE:** If you use Eclipse then make sure annotation processing is enabled at least for any projects registering objects using annotations. In the properties for your new project go to __Java Compiler > Annotation Processing__
Check the __“Enable Project Specific Settings”__ and make sure __“Enable annotation processing”__ is checked.  
If you use Maven as build manger, after each dependency modification in your plugin (Maven module) you must run __Maven > Update Project...__   

For more details see the demo application.
