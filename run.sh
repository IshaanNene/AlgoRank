#!/bin/bash
docker build -t algo_rank .

LANGUAGES=("c" "cpp" "java" "go" "rust")

run_test() {
    local mode=$1
    local problem=$2
    local lang=$3
    
    docker run --rm \
        --memory=256m \
        --cpus="0.5" \
        --pids-limit=50 \
        --security-opt="no-new-privileges" \
        --network=none \
        --tmpfs /tmp:size=64m \
        -v "$(pwd)/Problem:/AlgoRank/Problem:ro" \
        -v "$(pwd)/Solutions:/AlgoRank/Solutions:ro" \
        algo_rank "$mode" "$problem" "$lang"
}

for lang in "${LANGUAGES[@]}"; do
    echo "Testing language: $lang"
    
    for problem in {1..10}; do
        echo "Running problem $problem in Run mode..."
        run_test "Run" "$problem" "$lang"
        
        # echo "Running problem $problem in Submit mode..."
        # run_test "Submit" "$problem" "$lang"
    done
done