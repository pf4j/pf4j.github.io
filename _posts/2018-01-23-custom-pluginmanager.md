---
layout: page
title: "Custom PluginManager"
category: doc
date: 2018-01-23 20:27:36
order: 25
---

To create a custom plugin manager you could:

* implements `PluginManager` interface (create a plugin manager from scratch)
* modifies some aspects/behaviors of built-in implementations (`DefaultPluginManager`, `JarPluginManager`)
* extends `AbstractPluginManager` class

`JarPluginManager` is a `PluginManager` that loads plugin from a jar file. Actually, a plugin is a fat jar, a jar which contains classes from all the libraries,
on which your project depends and, of course, the classes of current project.
`AbstractPluginManager` adds some glue that help you to create quickly a plugin manager. All you need to do is to implement some factory methods.
PF4J uses in many places the factory method pattern to implement the dependency injection (DI) concept in a manually mode.
See below the abstract methods for `AbstractPluginManager`:

```java
public abstract class AbstractPluginManager implements PluginManager {

    protected abstract PluginRepository createPluginRepository();
    protected abstract PluginFactory createPluginFactory();
    protected abstract ExtensionFactory createExtensionFactory();
    protected abstract PluginDescriptorFinder createPluginDescriptorFinder();
    protected abstract ExtensionFinder createExtensionFinder();
    protected abstract PluginStatusProvider createPluginStatusProvider();
    protected abstract PluginLoader createPluginLoader();

    // other non abstract methods

}
```

`DefaultPluginManager` contributes with "default" components (`DefaultExtensionFactory`, `DefaultPluginFactory`, `DefaultPluginLoader`, ...) to `AbstractPluginManager`.  
Most of the times it's enough to extends `DefaultPluginManager` and to supply your custom components.
 
Starting with version 2.0 it's possible to coexist multiple plugins types (jar, zip, directory) in the same `PluginManager`.
For example, `DefaultPluginManager` works out of the box with zip and jar plugins. The idea is that `DefaultPluginManager` uses a compound version for:

- `PluginDescriptorFinder` (`CompoundPluginDescriptorFinder`)
- `PluginLoader` (`CompoundPluginLoader`)
- `PluginRepository` (`CompoundPluginRepository`)

```java
public class DefaultPluginManager extends AbstractPluginManager {
   
    ...
    
    @Override
    protected PluginDescriptorFinder createPluginDescriptorFinder() {
        return new CompoundPluginDescriptorFinder()
            .add(new PropertiesPluginDescriptorFinder())
            .add(new ManifestPluginDescriptorFinder());
    }
    
    @Override
    protected PluginRepository createPluginRepository() {
        return new CompoundPluginRepository()
            .add(new DefaultPluginRepository(getPluginsRoot(), isDevelopment()))
            .add(new JarPluginRepository(getPluginsRoot()));
    }
    
    @Override
    protected PluginLoader createPluginLoader() {
        return new CompoundPluginLoader()
            .add(new DefaultPluginLoader(this, pluginClasspath))
            .add(new JarPluginLoader(this));
    }

}
```

So, it's very easy to add new strategies for plugin descriptor finder, plugin loader and plugin repository.
