BUILD_OPTIONS=--minify

.PHONY: build

build:
	bun build ./src --outfile ./dist/bundle.js $(BUILD_OPTIONS)