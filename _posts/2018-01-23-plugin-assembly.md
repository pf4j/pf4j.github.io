---
layout: page
title: "Plugin assembly"
category: doc
date: 2018-01-23 20:05:57
order: 23
---

After you developed a plugin the next step is to deploy it in your application. For this task, one option is to create a zip file with a structure described in section [How to use]({{ site.url }}) from the beginning of the document.  
If you use [Apache Maven](https://maven.apache.org) as build manger then your pom.xml file must looks like [this]({{ site.demourl }}/plugins/plugin1/pom.xml). This file it's very simple and it's self explanatory.  
If you use [Apache Ant](http://ant.apache.org) then your build.xml file must looks like [this](https://github.com/gitblit/gitblit-powertools-plugin/blob/master/build.xml). In this case please look at the "build" target.  
