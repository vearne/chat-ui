VERSION := v0.0.3


COMMAND_NAME = chat-ui
IMAGE_NAME = woshiaotian/${COMMAND_NAME}:${VERSION}

.PHONY: chat-ui
chat-ui:
	yarn --ignore-engines && yarn build

.PHONY: image
image: chat-ui ## Build admin docker image
	docker build -f ./docker_build/Dockerfile --rm -t ${IMAGE_NAME} .
	docker push ${IMAGE_NAME}

.PHONY: image-multiple
image-multiple:
	docker buildx build -f ./docker_build/Dockerfile\
 		--platform linux/amd64,linux/arm64 --push -t ${IMAGE_NAME} .

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: cover
	cover:
		$(shell [ -e cover.out ] && rm cover.out)
		@go list -f '{{if or (len .TestGoFiles) (len .XTestGoFiles)}}go test -covermode=count -coverprofile={{.Name}}_{{len .Imports}}_{{len .Deps}}.coverprofile -coverpkg $(TEST_PK    GS_DELIM) {{.ImportPath}}{{end}}' $(TEST_PKGS) | xargs -I {} bash -c {}
		@echo "mode: count" > cover.out
		@grep -h -v "^mode:" *.coverprofile >> "cover.out"
		@rm *.coverprofile
		go tool cover -func=cover.out

.DEFAULT_GOAL := help
