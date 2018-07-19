---
layout: page
title: "Extension instantiation"
category: doc
date: 2018-07-19 22:28:24
order: 37
---

To create extensions instances, PF4J uses an [ExtensionFactory]({{ site.codeurl }}/pf4j/src/main/java/org/pf4j/ExtensionFactory.java).
By default, PF4J uses `DefaultExtensionFactory` as implementation of `ExtensionFactory`.

You can change the default implementation with
```java
new DefaultPluginManager() {
    
    @Override
    protected ExtensionFactory createExtensionFactory() {
        return MyExtensionFactory();
    }

};
```

`DefaultExtensionFactory` uses [Class#newInstance()](https://docs.oracle.com/javase/7/docs/api/java/lang/Class.html#newInstance()) method to create the extension instance.

An extension instance is created on demand, when `plugin.getExtensions(MyExtensionPoint.class)` is called.
By default, if you call `plugin.getExtensions(MyExtensionPoint.class)` twice:
```java
plugin.getExtensions(MyExtensionPoint.class);
plugin.getExtensions(MyExtensionPoint.class);
``` 
then for each call, a new extension instance is created.

If you want to return the same extension instance (singleton), you need to use [SingletonExtensionFactory]({{ site.codeurl/pf4j/src/main/java/org/pf4j/SingletonExtensionFactory.java }}).
```java
new DefaultPluginManager() {
    
    @Override
    protected ExtensionFactory createExtensionFactory() {
        return SingletonExtensionFactory();
    }

};
```
