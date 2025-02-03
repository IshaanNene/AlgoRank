make:
	 docker build -t algo-rank .
	 docker run --rm algo-rank

gits_up:
	 git status
	 git add .
	 git commit -m "Updates"
	 git push
clean:
	rm a.out
	rm program