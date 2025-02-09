build:
	docker build -t algo-rank .
run:
	docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/AlgoRank/writable algo_rank Run 1
submit:
	docker run --rm --memory=256m --cpus="0.5" --pids-limit=50 --security-opt="no-new-privileges" --network=none --tmpfs /tmp:size=64m -v "$(pwd)":/AlgoRank/writable algo_rank Submit 1

gits_up:
	git status
	git add .
	git commit -m "Updates"
	git push

clean:
	rm -f a.out program

run:
	chmod +x run.sh
	./run.sh
