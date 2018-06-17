---
layout: page
title: "Plugin lifecycle"
category: doc
date: 2018-01-23 20:02:17
order: 20
---

Each plugin passes through a pre-defined set of states. [PluginState](https://github.com/pf4j/pf4j/blob/master/pf4j/src/main/java/org/pf4j/PluginState.java) defines all possible states.   
The primary plugin states are:

* `CREATED`
* `DISABLED`
* `RESOLVED`
* `STARTED`
* `STOPPED`

The `DefaultPluginManager` contains the following logic:

* all plugins are resolved & loaded
* `DISABLED` plugins are __NOT__ automatically `STARTED` by pf4j in `startPlugins()` __BUT__ you may manually start (and therefore enable) a *DISABLED* plugin by calling `startPlugin(pluginId)` instead of `enablePlugin(pluginId)` + `startPlugin(pluginId)`
* only `STARTED` plugins may contribute extensions. Any other state should not be considered ready to contribute an extension to the running system.

The differences between a `DISABLED` plugin and a `STARTED` plugin are:

* a `STARTED` plugin has executed `Plugin.start()`, a `DISABLED` plugin has not
* a `STARTED` plugin may contribute extension instances, a `DISABLED` plugin may not

`DISABLED` plugins still have valid class loaders and their classes can be manually
loaded and explored, but the resource loading - which is important for inspection -
has been handicapped by the `DISABLED` check.

As integrators of pf4j evolve their extension APIs it will become
a requirement to specify a minimum system version for loading plugins.
Loading & starting a newer plugin on an older system could result in
runtime failures due to method signature changes or other class
differences.  

For this reason was added a manifest attribute (in `PluginDescriptor`) to specify a 'requires' version
which is a minimum system version on x.y.z format, or a 
[SemVer Expression](https://github.com/zafarkhaja/jsemver#semver-expressions-api-ranges). 
Also `DefaultPluginManager` contains a method to
specify the system version of the plugin manager and the logic to disable
plugins on load if the system version is too old (if you want total control, 
please override `isPluginValid()`). This works for both `loadPlugins()` and `loadPlugin()`.  

__PluginStateListener__ defines the interface for an object that listens to plugin state changes. You can use `addPluginStateListener()` and `removePluginStateListener()` from PluginManager if you want to add or remove a plugin state listener.  

Your application, as a PF4J consumer, has full control over each plugin (state). So, you can load, unload, enable, disable, start, stop and delete a certain plugin using `PluginManager` (programmatically).
