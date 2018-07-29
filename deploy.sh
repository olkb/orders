#!/bin/bash
set -e # exit with nonzero exit code if anything fails

if [ -f .env ]; then
	export $(egrep -v '^#' .env | xargs)
fi

if [ "${TRAVIS_PULL_REQUEST}"  != "false" ]; then
  # Exit if we're running a pull request
  echo "Pull request - not running script"
  exit 0;
fi

if [ ! -f .env ]; then
	rm -rf .git
	git init
	git remote add origin https://github.com/${TRAVIS_REPO_SLUG}

	# inside this git repo we'll pretend to be a new user
	git config user.name "OLKB Bot"
	git config user.email "hello@olkb.com"
fi

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add README.md
git commit -am "Update order statuses [skip ci]"

# Force push from the current repo's dev branch to the remote github.io
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}" master #> /dev/null 2>&1