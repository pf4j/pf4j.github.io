---
layout: page
title: "Troubleshooting"
category: doc
date: 2018-01-23 21:31:18
order: 120
---

Below are listed some problems that may occur when attempting to use PF4J, and suggestions for solving them.

- **No Extensions Found**

See if you have a file `extensions.idx` in each plugin.  
If file `extensions.idx` doesn't exist then probably there is something wrong with the annotation processing step (enable annotation processing in your IDE or in your Maven script).   
If file `extensions.idx` exists and it's not empty then sure you have a class loader issue (you have the same extension point in two different class loader), in this situation you must remove some libraries (probably the API jar) from plugin.   

If the problem persist or you want to find more info related to the extensions discovery process (e.g what interfaces/classes are loaded by each plugin, what classes are not recognized as extensions for an extension point) then you must put on `TRACE` level the logger for `PluginClassLoader` and `AbstractExtensionFinder` (see the [log4j.properties]({{ site.demourl }}/app/src/main/resources/log4j.properties) file for demo).   

Are some resources on the internet related to this subject: [#82](https://github.com/pf4j/pf4j/issues/82), [#64](https://github.com/pf4j/pf4j/issues/64) and [No extensions found] (https://groups.google.com/forum/#!topic/pf4j/tEQXY_WpD3A).
