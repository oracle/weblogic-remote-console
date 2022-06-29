---
title: Understand access discrepancies
date: 2021-09-01
draft: false
description: How user roles affect what you see in the WebLogic Remote Console
weight: 6
---

The WebLogic Remote Console restricts what non-administrator users can see or do. Users with the roles Deployer, Monitor, or Operator are only shown the areas and features necessary for their role. These restrictions range from broad (hiding the entire Edit Tree perspective from users in the Monitor role) to narrow (hiding Create buttons on some pages). For full access to all the functionality of the WebLogic Remote Console, log in as an administrator.

The scope of these restrictions is too extensive to list comprehensively but the table below provides some examples.

{{% notice note%}}
These restrictions are based on the default security policies assigned to each role. If you customize the policies to add or remove access beyond the default, those changed permissions will not be reflected in the WebLogic Remote Console. It will continue to hide or show functionality based on the default security policies.

See [Users, Groups, and Security Roles](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/roles/secroles.html#GUID-A313D8DB-50DB-43EE-8BA1-EDECDC0DE2FE) in *Securing Resources Using Roles and Policies for Oracle WebLogic Server* for more information. You may also find [Default Security Policies for MBeans](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wlmbr/common/mbeansecroles.html) in *WebLogic Server MBean Reference* helpful.
{{% /notice %}}

|Role | Limitations|
|---|---|
|Administrator | No limitations. Administrators have full access to all functionality in the WebLogic Remote Console.|
|Deployer | Can view but not edit server or domain configurations; Can modify areas related to application deployment including some JDBC and JMS resources.|
|Monitor | Read-only access to the WebLogic Remote Console.|
|Operator | Can start and stop servers but cannot see the Edit Tree perspective.|
