---
layout: page
title: "Plugin descriptor"
category: doc
date: 2026-08-26 09:00:00
order: 26
---

The plugin descriptor holds the metadata of a plugin. PF4J reads it from `MANIFEST.MF` for jar plugins and from `plugin.properties` for directory plugins, through a [PluginDescriptorFinder]({{ site.codeurl }}/pf4j/src/main/java/org/pf4j/PluginDescriptorFinder.java). See [Plugins]({% post_url 2019-01-30-plugins %}) for the attributes you declare there.

`PluginDescriptor` is an interface with getters only:

```java
public interface PluginDescriptor {

    String getPluginId();
    String getPluginDescription();
    String getPluginClass();
    String getVersion();
    String getRequires();
    String getProvider();
    String getLicense();
    List<PluginDependency> getDependencies();

}
```

[DefaultPluginDescriptor]({{ site.codeurl }}/pf4j/src/main/java/org/pf4j/DefaultPluginDescriptor.java) is the built-in implementation. You get the descriptor of a loaded plugin from its wrapper:

```java
PluginDescriptor descriptor = pluginManager.getPlugin("welcome-plugin").getDescriptor();
```

## Adding your own metadata

The set of fields above is fixed. If your application needs something else, for example an author or a homepage, you supply your own descriptor and your own finder.

Both built-in finders create the descriptor through a factory method, so you only have to override that method to change the type:

```java
protected DefaultPluginDescriptor createPluginDescriptorInstance() {
    return new DefaultPluginDescriptor();
}
```

Start with a descriptor that adds what you need:

```java
public class MyPluginDescriptor extends DefaultPluginDescriptor {

    private String author;

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

}
```

Then extend the finder. Call `super` to get all the standard fields populated, and read only your own attribute:

```java
public class MyPluginDescriptorFinder extends PropertiesPluginDescriptorFinder {

    @Override
    protected DefaultPluginDescriptor createPluginDescriptorInstance() {
        return new MyPluginDescriptor();
    }

    @Override
    protected PluginDescriptor createPluginDescriptor(Properties properties) {
        MyPluginDescriptor descriptor = (MyPluginDescriptor) super.createPluginDescriptor(properties);
        descriptor.setAuthor(properties.getProperty("plugin.author"));

        return descriptor;
    }

}
```

`ManifestPluginDescriptorFinder` works the same way, with `createPluginDescriptor(Manifest manifest)` instead.

Plug the finder into your manager, as described in [Custom manager]({% post_url 2018-01-23-custom-manager %}):

```java
PluginManager pluginManager = new DefaultPluginManager() {

    @Override
    protected PluginDescriptorFinder createPluginDescriptorFinder() {
        return new MyPluginDescriptorFinder();
    }

};
```

Reading your field takes a cast, because `getDescriptor()` returns the interface:

```java
MyPluginDescriptor descriptor = (MyPluginDescriptor) pluginManager.getPlugin("welcome-plugin").getDescriptor();
String author = descriptor.getAuthor();
```

## Or keep the metadata in your plugin class

Extending the descriptor is not always the right answer. If the metadata is only used by the plugin itself, read it in your own base plugin class instead:

```java
public abstract class MyPlugin extends Plugin {

    // read whatever you need here

}
```

That keeps the descriptor untouched, at the cost of parsing the source a second time.

Use the descriptor when you want to reuse the parsing that PF4J already does, or when you need the metadata for plugins that are not started. A plugin class is optional, so a plugin may not have one at all, while every plugin found in the repository has a descriptor.
