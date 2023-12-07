BUILD_OPTIONS=--minify

.PHONY: build client

client:
	@bun build ./src --outfile ./dist/bundle.js $(BUILD_OPTIONS)

# server:
# 	@bun build ./server --outfile ./dist/server/bundle.js $(BUILD_OPTIONS)

build: client