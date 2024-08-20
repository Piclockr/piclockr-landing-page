#!/bin/bash
set -o pipefail

docker run -v ./:/path zricethezav/gitleaks:latest detect --source="/path"