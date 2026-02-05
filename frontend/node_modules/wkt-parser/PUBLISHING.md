# Publishing

Make sure you have the latest from the main branch:

    git pull origin main

Use `npm version` to update the version number in the `package.json`.

    npm version {patch|minor|major} --no-git-tag-version

Then run the publish script

   ./publish.sh

afterwards don't forget to update the versions to be a prerelease of the next version, so if you just published 1.1.1 then:

    npm version 1.1.2-dev
    git push --follow-tags
