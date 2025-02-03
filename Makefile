make:
	docker build --cgroup-parent algo-rank .
	docker run --rm algo-rank python3 main.py Run

make_submit:
	docker build -t algo-rank .
	docker run --rm algo-rank python3 main.py Submit

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
