---
layout: page
title: "Extensions"
category: doc
date: 2019-01-30 06:03:56
order: 36
---

### About extension points

In order to extend the functionality of an application, it has to define a so called extension point. This is an interface or abstract class, that defines a specific behaviour for an extension.

The following example defines an extension point to extend a `javax.swing.JMenuBar` with additional menu entries:

```java
import javax.swing.JMenuBar;
import org.pf4j.ExtensionPoint;

interface MainMenuExtensionPoint extends ExtensionPoint {

    void buildMenuBar(JMenuBar menuBar);

}
```

### About extensions

An extension is a concrete implementation of an extension point. 

The following example adds a menu with the title "Hello World" to the menu bar by implementing the `MainMenuExtensionPoint` interface:

```java
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import org.pf4j.Extension;

@Extension
public class MyMainMenuExtension implements MainMenuExtensionPoint {

    public void buildMenuBar(JMenuBar menuBar) {
        JMenu exampleMenu = new JMenu("Example");
        exampleMenu.add(new JMenuItem("Hello World"));
        menuBar.add(exampleMenu);
    }

}
```

An extension can be loaded from the application classpath (so called [system extensions]({% post_url 2018-01-23-system-extension %})) or it can be provided by a plugin.

Please notice the `@Extension` annotation. This annotation marks the class as a loadable extension for PF4J. All classes, that are marked with the `@Extension` annotation, are automatically published at compile time in the created JAR file - either in the `META-INF/extensions.idx` file or as service in the `META-INF/services` folder. By using the `@Extension` annotation you don't have to create those files manually!


### How extensions are loaded

According to the example above the application can build the menu bar like this:

```java
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import org.pf4j.DefaultPluginManager;
import org.pf4j.PluginManager;

public static void main(String[] args) {
    // Init the plugin environment.
    // This should be done once during the boot process of the application.
    PluginManager pluginManager = new DefaultPluginManager();
    pluginManager.loadPlugins();
    pluginManager.startPlugins();

    // Launch Swing application.
    java.awt.EventQueue.invokeLater(new Runnable() {

        public void run() {
            // Build the menu bar by using the available extensions.
            JMenuBar mainMenu = new JMenuBar();
            for (MainMenuExtensionPoint extension : pluginManager.getExtensions(MainMenuExtensionPoint.class)) {
                extension.buildMenuBar(mainMenu);
            }

            // Create and show a dialog with the menu bar.
            JDialog dialog = new JDialog();
            dialog.setTitle("Example dialog");
            dialog.setSize(450,300);
            dialog.setJMenuBar(mainMenu);
            dialog.setVisible(true);
        }

    });

}
```

### Additional extension parameters

The `@Extension` annotation can provide some further options, that might be helpful in certain situations.

#### Ordering extensions

Let's assume we have multiple extensions for the menu bar and we like to have control, in which order the menu entries appear in the menu bar. In this case we might use the `ordinal` within the `@Extension` annotation:

```java
@Extension(ordinal = 1)
public class FirstMainMenuExtension implements MainMenuExtensionPoint {

    public void buildMenuBar(JMenuBar menuBar) {
        JMenu menu = new JMenu("First");
        menu.add(new JMenuItem("Hello World"));
        menuBar.add(menu);
    }

}
```

By defining `@Extension(ordinal = 1)` the plugin manager will always load this extension first. Therefore the first entry of the menu bar is always called "First".

```java
@Extension(ordinal = 2)
public class SecondMainMenuExtension implements MainMenuExtensionPoint {

    public void buildMenuBar(JMenuBar menuBar) {
        JMenu menu = new JMenu("Second");
        menu.add(new JMenuItem("Hello World"));
        menuBar.add(menu);
    }

}
```

By defining `@Extension(ordinal = 2)` the plugin manager will always load this extension after the first one.

#### Explicitly configure an extension point

In real world applications it is quite common to create abstract classes for interfaces. Let's assume the following class hierarchy:

![example for an explicit extension point](/pf4j-explicit-extension-point.png)

In this case the extension class (`Plugin1MainMenuExtension`) is __not directly derived__ from the `org.pf4j.ExtensionPoint` interface. Instead the application extends this interface with its own `BaseExtensionPoint` interface in order to add some additional methods. Also the application provides an abstract `MainMenuAdapter` class, that is finally extended by the `Plugin1MainMenuExtension`.

You can find a similar approach for example in the [`java.awt.event.WindowListener`](https://docs.oracle.com/javase/7/docs/api/java/awt/event/WindowListener.html) interface and the abstract [`java.awt.event.WindowAdapter`](https://docs.oracle.com/javase/7/docs/api/java/awt/event/WindowAdapter.html) class.

In this scenario it is necessary to explicitly register the extension point in the `@Extension` annotation:

```java
@Extension(points = {MainMenuExtensionPoint.class})
public class Plugin1MainMenuExtension extends MainMenuAdapter {

    public void buildMenuBar(JMenuBar menuBar) {
        // some implementation...
    }

}
```

Otherwise PF4J might not be able to automatically detect the correct extension points for the extension at compile time (as described in [issue #264](https://github.com/pf4j/pf4j/issues/264)).

#### Explicitly configure plugin dependencies

Plugins may have an [__optional__ dependency on each other]({% post_url 2019-01-30-plugins %}#optional-plugin-dependencies). This might lead to a situation, in which a certain extension depends on a plugin, that is not available at application runtime. Let's assume the following class hierarchy:

![example for extension dependencies](/pf4j-optional-extensions.png)

This scenario describes an application, which provides a plugin for contact management (`ContactsPlugin`) and another plugin for calendar management (`CalendarPlugin`). Both plugins provide a form, that allows the user to edit contacts / calendar entries. Those forms can be extended with extension points:

-   The contact form shows a panel with assigned calendar entries (via `CalendarContactsFormExtension`), in case the calendar plugin is available at runtime.
-   The calendar form shows a panel with assigned contact entries (via `ContactsCalendarFormExtension`), in case the contacts plugin is available at runtime.

In order to make those circular dependencies work, the extensions in the `com.example.plugins.contacts.addons` package are provided as a separate JAR file, that is bundled in the `lib` folder of the contacts plugin.

Both plugins also have to work independently. For example the user might not need calendar management within his application. In this case he can disable / remove the calendar plugin entirely and the contacts plugin should still work. In this specific scenario both plugins must have an [__optional__ dependency on each other]({% post_url 2019-01-30-plugins %}#optional-plugin-dependencies). The plugin manager still has to load the contacts plugin even if the calendar plugin is not enabled / available at runtime.

But those optional dependencies might lead to the situation, that a certain extension depends on a non existent plugin. In order to avoid class loading errors in this particular case you can define the plugins, that are necessary to load a certain extension through the `@Extension` annotation:

```java
@Extension(plugins = {ContactsPlugin.ID, CalendarPlugin.ID})
public class CalendarContactsFormExtension implements ContactsFormExtension {

    public JPanel getPanel() {
        // some implementation...
    }
    public void load(ContactsEntry entry) {
        // some implementation...
    }
    public void load(ContactsEntry save) {
        // some implementation...
    }

}
```

```java
@Extension(plugins = {ContactsPlugin.ID, CalendarPlugin.ID})
public class ContactsCalendarFormExtension implements CalendarFormExtension {

    public JPanel getPanel() {
        // some implementation...
    }

    public void load(CalendarEntry entry) {
        // some implementation...
    }

    public void load(CalendarEntry save) {
        // some implementation...
    }

}
```

In this case the plugin manager will only load these extensions, if all of the required plugins are available / enabled at runtime.

__Please notice:__ This feature is only necessary, if you use plugins with an [__optional__ dependency on each other]({% post_url 2019-01-30-plugins %}#optional-plugin-dependencies). In this case you have to add the [`asm` library](https://asm.ow2.io/) into the classpath of your application.

This feature is discussed in [issue #266](https://github.com/pf4j/pf4j/issues/266).
