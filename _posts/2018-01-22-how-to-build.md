---
layout: page
title: "How to build"
category: dev
date: 2018-01-22 21:40:19
order: 30
---

Requirements: 

- [Git](https://git-scm.com/)
- JDK 9+ (test with `java -version`)
- [Apache Maven 3](https://maven.apache.org/) (test with `mvn -version`)

Steps:

- create a local clone of this repository (with `git clone https://github.com/pf4j/pf4j.git`)
- go to project's folder (with `cd pf4j`)
- build the artifacts (with `mvn clean package` or `mvn clean install`)

After above steps a folder _pf4j/target_ is created and all goodies are in that folder.

