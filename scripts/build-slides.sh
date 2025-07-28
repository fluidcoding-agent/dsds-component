#!/bin/bash
git pull
cd docs/
marp --html -o static/slides -I slides
cp -rf slides/images static/slides
