---
layout: page
title: "Quickstart"
category: dev
date: 2019-09-08 17:09:53
order: 5
---

There are two really good reasons to create a PF4J quickstart. The first is if you just want to get started using PF4J quickly. 
The quickstart will set up a ready-to-use project in under a minute (depending on your bandwidth). Another great reason to create a quickstart is to accompany a bug report. 
If you report a bug in [Github](https://github.com/pf4j/pf4j/issues) or on the [mailing list](http://groups.google.com/group/pf4j), the core developers may not be able to recreate it easily.

Quickstarts are made from a Maven archetype. So, you will need to have [Maven](http://maven.apache.org) installed and working (from the command line) before following this.

Creating a quickstart provides only a very basic starting point for your PF4J project. If you are looking for examples of how to use PF4J and its various features, please refer to the [demo](/doc/demo.html) projects instead!

To create your project you must follow these steps:

- create your quickstart project:

```
mvn archetype:generate \
  -DarchetypeGroupId=org.pf4j \
  -DarchetypeArtifactId=pf4j-quickstart \
  -DarchetypeVersion=3.6.0 \
  -DgroupId=com.mycompany \
  -DartifactId=myproject
```
maybe you want to change `groupId`, `artifactId` and `archetypeVersion` (the latest PF4J version)

- run your application from command line:

```
cd myproject
./run.sh
```

For more information, please see [this](https://github.com/pf4j/pf4j/issues/306#issuecomment-493198655) comment.
