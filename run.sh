#!/bin/bash
docker build -t algo_rank .
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit