---
layout: page
title: "Default/System extension"
category: doc
date: 2018-01-23 21:23:38
order: 40
---

Starting with version 0.9 you can define an extension directly in the application jar (you're not obligated
to put the extension in a plugin - you can see this extension as a default/system extension).
See [WhazzupGreeting]({{ site.demourl }}/app/src/main/java/org/pf4j/demo/WhazzupGreeting.java)
for a real example.

This is great for starting application phase. In this scenario you have a minimalist plugin framework with one class loader
(the application class loader), similar with Java [ServiceLoader](https://docs.oracle.com/javase/7/docs/api/java/util/ServiceLoader.html)
but with the following benefits:
- no need to write provider-configuration files in the resource directory `META-INF/services`, you using the elegant
 `@Extension` annotation from PF4J
- anytime you can switch to the multiple class loader mechanism without to change one code line in your application  

Of course the code present in the `Boot` class from the demo application it is functional but you can use a more minimalist code
skipping `pluginManager.loadPlugins()` and `pluginManager.startPlugins()`.

```java
public static void main(String[] args) {
    PluginManager pluginManager = new DefaultPluginManager();
    pluginManager.loadPlugins();
    pluginManager.startPlugins();
    List<Greeting> greetings = pluginManager.getExtensions(Greeting.class);
    for (Greeting greeting : greetings) {
        System.out.println(">>> " + greeting.getGreeting());
    }
}
```

The above code can be written:

```java
public static void main(String[] args) {
    PluginManager pluginManager = new DefaultPluginManager();
    List<Greeting> greetings = pluginManager.getExtensions(Greeting.class);
    for (Greeting greeting : greetings) {
        System.out.println(">>> " + greeting.getGreeting());
    }
}
```
