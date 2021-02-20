#!/bin/sh
set -x

sha=`git rev-parse HEAD`
git config --global user.email "bryan.brady@gmail.com"
git config --global user.name "bryan brady"
git clone git@github.com:bryanbrady/asdf-sh.git
cp index.html index.js asdf-sh/mandelbrot-js/
cd asdf-sh
if ! git diff --exit-code; then
  git add -u
  git commit -m "https://github.com/bryanbrady/mandelbrot-js/commit/$sha"
  git push origin master
fi
