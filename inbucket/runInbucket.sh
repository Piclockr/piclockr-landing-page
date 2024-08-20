#!/bin/bash
set -o pipefail
docker run -d --rm --name inbucket -p 9000:9000 -p 2500:2500 -p 1100:1100 inbucket/inbucket
