#!/bin/bash

find "$1" -name "*.smi" -exec python smi2srt.py {} \;