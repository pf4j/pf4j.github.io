---
layout: page
title: "Class loading"
category: doc
date: 2018-07-19 20:21:38
order: 15
---

Class loaders are responsible for loading Java classes during runtime dynamically to the JVM (Java Virtual Machine).
Class loaders are part of the Java Runtime Environment. When the JVM requests a class, the class loader tries to locate the class and load the class definition into the runtime using the fully qualified class name.
The `java.lang.ClassLoader.loadClass()` method is responsible for loading the class definition into runtime. It tries to load the class based on a fully qualified name.

If the class isn’t already loaded, it delegates the request to the parent class loader. This process happens recursively.

PF4J uses [PluginClassLoader]({{ site.codeurl }}/pf4j/src/main/java/org/pf4j/PluginClassLoader.java) to load classes from plugins.  
So, __each available plugin is loaded using a different `PluginClassLoader`__.  
One instance of `PluginClassLoader` should be created by plugin manager for every available plug-in.  
By default, this class loader is a Parent Last ClassLoader - it loads the classes from the plugin's jars before delegating to the parent class loader.

By default (parent last), `PluginClassLoader` uses below strategy when a load class request is received via `loadClass(String className)` method:
- if the class is a system class (`className` starts with `java.`), delegate to the system loader
- if the class is part of the plugin engine (`className` starts with `org.pf4j`), use parent class loader (`ApplicationClassLoader` in general)
- try to load using current PluginClassLoader instance
- if the current PluginClassLoader cannot load the class, try to delegate to `PluginClassLoader`s of plugin's dependencies
- delegate class load to parent class loader 
  
Use `parentFirst` parameter of `PluginClassLoader` to change the loading strategy.  
For example if I want to use a Parent First strategy in my application, all I must to achieve this is:
```java
new DefaultPluginManager() {
    
    @Override
    protected PluginClassLoader createPluginClassLoader(Path pluginPath, PluginDescriptor pluginDescriptor) {
        return new PluginClassLoader(pluginManager, pluginDescriptor, getClass().getClassLoader(), true);
    }

};

```

If you want to know what plugin loaded a specific class you can use:
```java
pluginManager.whichPlugin(MyClass.class);
```


