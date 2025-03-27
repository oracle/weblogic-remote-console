---
title: Contribute to the documentation
weight: 4
---

The WebLogic Remote Console documentation is produced using the [Hugo static site generator](https://gohugo.io/). The webpages are created in markdown and hosted within the same repository as the WebLogic Remote Console. This makes it easy to suggest edits and improvements directly to the documentation.

To make an update to the documentation:

1. Clone the repository.
    ```
    $ git clone https://github.com/oracle/weblogic-remote-console
    ```
1. Create a new branch.
    ```
    $ git checkout -b <your-branch>
    ```
1. Make your changes to the documentation. Edit the markdown source files in `hugo/staging/content`.
1.  Build the site locally to view your changes.
    ```
    cd hugo/staging
    hugo server -b http://localhost:1313/weblogic-remote-console
    ```
    View the local site at `http://localhost:1313/weblogic-remote-console/`.
1. When you are ready to submit your changes, push your branch to origin and submit a pull request. Remember to follow the guidelines in the [Contribute to the WebLogic Remote Console](contribute) document.

    {{< alert title="Note" color="primary" >}}Make sure that you *only* check in changes from the `hugo/staging/content` area. Do not build the site and try to commit the static files.
    {{< /alert >}}