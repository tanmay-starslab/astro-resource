.PHONY: all generate site book clean

all: generate site book

generate:
	npm run generate

site:
	npm run build

book: generate
	cd book && latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=../output/pdf main.tex

clean:
	cd book && latexmk -C -outdir=../output/pdf main.tex
