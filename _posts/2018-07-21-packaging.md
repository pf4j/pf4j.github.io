---
layout: page
title: "Packaging"
category: doc
date: 2018-07-21 19:46:02
order: 17
---

After you developed and tested your plugin you should packaging and releasing.   
Currently, PF4J supports builtin two types of packaging 
- fat/shade/one-jar file (`.jar`) 
- zip file with `lib` and `classes` directories (.zip)

The first versions of PF4J came by default only with support for `.zip` format.  
To install a plugin in your application you need to add it to `plugins` (pluginsRoot) directory.
Your content of `plugins` directory can look like:
```
$ tree plugins
plugins
├── disabled.txt
├── enabled.txt
├── demo-plugin1-2.4.0.zip
└── demo-plugin2-2.4.0.zip
```
or
```
$ tree plugins
plugins
├── disabled.txt
├── enabled.txt
├── demo-plugin1-2.4.0.jar
└── demo-plugin2-2.4.0.jar
```
if you use `.jar` plugin packaging format.

If you want, you can mix multiple packaging format. For example, by default, you can mix `.jar` plugins with `.zip` plugins:
```
$ tree plugins
plugins
├── disabled.txt
├── enabled.txt
├── demo-plugin1-2.4.0.jar
└── demo-plugin2-2.4.0.zip
```

I recommend you to use `.jar` because is most simple and is a standard format in Java.

All plugins are loaded by `PluginManager` from `plugins` directory.  
You can specify other location using `pf4j.pluginsDir` system property (`-Dpf4j.pluginsDir=plugins`) or programmatically 
when you create `DefaultPluginManager`.  

