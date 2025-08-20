---
layout: default
title: "PF4J"
---

<img src="{{ site.baseurl }}/pf4j-logo.svg" width="250"/>

#### Trusted By

- **Netflix Spinnaker** - Continuous delivery platform
- **Facebook Buck** (Java version) - Build system  
- **Huawei Cloud** - Real-time data processing and scoring systems (MRS - MapReduce Service)
- **Eclipse Foundation** - Connected Services Platform (ECSP) for automotive software-defined vehicles
- **Appsmith** [![GitHub stars](https://img.shields.io/github/stars/appsmithorg/appsmith.svg)](https://github.com/appsmithorg/appsmith) - Low-code application platform
- **Halo CMS** [![GitHub stars](https://img.shields.io/github/stars/halo-dev/halo.svg)](https://github.com/halo-dev/halo) - Modern content management

[View more projects...](https://github.com/pf4j/pf4j/issues/173)

---

A plugin is a way for a third party to extend the functionality of an application. A plugin implements extension points declared by application or other plugins. Also, a plugin can define extension points.

**NOTE:** Starting with version 0.9 you can define an extension directly in the application jar (you're not obligated to put the extension in a plugin - you can see this extension as a default/system extension). See [WhazzupGreeting](https://github.com/pf4j/pf4j/blob/master/demo/gradle/app/src/main/java/org/pf4j/demo/WhazzupGreeting.java) for a real example.

#### Features/Benefits

With PF4J you can easily transform a monolithic java application in a modular application.  
PF4J is an open source (Apache license) lightweight (around **100 KB**) plugin framework for java, with minimal dependencies (only `slf4j-api`) and very extensible (see `PluginDescriptorFinder` and `ExtensionFinder`).

#### Why Choose PF4J?

- **Enterprise-proven:** Powers Netflix Spinnaker and Facebook Buck
- **Lightweight:** Only ~100KB with minimal dependencies  
- **Simple:** No XML configuration, pure Java
- **Alternative to OSGi:** Easy to learn and implement

Practically, PF4J is a microframework that aims to keep the core simple but extensible. We also have a community-driven ecosystem of extensions.

#### Components

- **Plugin** is the base class for all plugins types. Each plugin is loaded into a separate class loader to avoid conflicts.
- **PluginManager** is used for all aspects of plugins management (loading, starting, stopping). You can use a built-in implementation as `JarPluginManager`, `ZipPluginManager`, `DefaultPluginManager` (it's a `JarPluginManager` + `ZipPluginManager`) or you can implement a custom plugin manager starting from `AbstractPluginManager` (implement only factory methods).
- **PluginLoader** loads all information (classes) needed by a plugin.
- **ExtensionPoint** is a point in the application where custom code can be invoked. It's a java interface marker.   
Any java interface or abstract class can be marked as an extension point (implements `ExtensionPoint` interface).
- **Extension** is an implementation of an extension point. It's a java annotation on a class.

**PLUGIN** = a container for **EXTENSION POINTS** and **EXTENSIONS** + lifecycle methods (start, stop, delete)

A **PLUGIN** is similar with a **MODULE** from other systems. If you don't need lifecycle methods (hook methods for start, stop, delete) you are not forced to supply a plugin class (the `PluginClass` property from the plugin descriptor is optional). You only need to supply some description of plugin (id, version, author, ...) for a good tracking (your application wants to know who supplied the extensions or extensions points).

#### Java version

The current minimum Java version required to build PF4J should be 9, but the runtime Java version can be 8 since the artifact is a multi-release jar.