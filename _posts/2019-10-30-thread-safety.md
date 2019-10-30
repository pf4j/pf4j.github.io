---
layout: page
title: "Thread safety"
category: doc
date: 2019-10-30 19:59:14
order: 115
---

PF4J is not [thread safety](https://en.wikipedia.org/wiki/Thread_safety).
This information is present in javadoc of [AbstractPluginManager](https://github.com/pf4j/pf4j/blob/master/pf4j/src/main/java/org/pf4j/AbstractPluginManager.java) and [DefaultPluginManager](https://github.com/pf4j/pf4j/blob/master/pf4j/src/main/java/org/pf4j/DefaultPluginManager.java).  
It's your responsibility to deal with concurrency.

