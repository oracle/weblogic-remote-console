---
title: Review security issues
date: 2021-09-01
draft: false
description: Review and resolve potential security issues in your WebLogic Server domain
weight: 4
---

WebLogic Server regularly checks domains to ensure they comply with its recommended security policies. If a domain does not meet the recommendations, a security warning is logged and displayed in the WebLogic Remote Console.

{{% notice note %}}
You must have the July 2021 Patch Set Update (PSU) for WebLogic Server applied to your  domain to receive security warnings.
{{% /notice %}}

When there are active security warnings in your domain, a banner with red text appears at the top of the WebLogic Remote Console window. Click the banner to see the current security warnings. You can also get to the security warnings pages through **Monitoring** > **Environment** > **Domain Security Runtime**.

Security policy violations that can trigger a warning include outdated TLS versions, patch updates, and certificates, among others. To protect your domain, resolve these warnings as soon as possible. The same issue can affect multiple servers within your domain simultaneously so make sure to fix the issue on every affected server. Depending on the problem and its resolution, you may need to restart servers to clear the security warnings.

Some level of security validation occurs in all domain modes but is most strict in secured production mode and least strict in development mode.

If you think certain policies don't apply to your environment or are not feasible to implement with your business needs, you can disable individual security checks (with the exception of the minimum JDK version check).

See [Review Potential Security Issues](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/lockd/secure.html#GUID-4148D1BE-2D54-4DA5-8E94-A35D48DCEF1D) in *Securing a Production Environment for Oracle WebLogic Server* for more information.

Do not rely on the Security Warnings Report alone to determine the security of your domain. While these security configuration settings cover a broad set of potential security issues, other security issues that do not generate warnings may still exist in your domain.