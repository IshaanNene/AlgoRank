build:
	docker build -t algo-rank .
run:
	docker run --rm --memory=128m --cpus="0.5" --read-only --security-opt seccomp=seccomp_profile.json --network=none --tmpfs /tmp:rw,exec,mode=1777 algo-rank python3 main.py Run
submit:
	docker run --rm --memory=128m --cpus="0.5" --read-only --security-opt seccomp=seccomp_profile.json --network=none --tmpfs /tmp:rw,exec,mode=1777 algo-rank python3 main.py Submit

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
