#!/bin/bash
docker build -t algo_rank .
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 1
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 2
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 3
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 4
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 5
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 6
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 7
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 8
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 9
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Run 10

docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 1
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 2
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 3
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 4
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 5
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 6
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 7
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 8
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 9
docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/CodeForge/writable algo_rank Submit 10