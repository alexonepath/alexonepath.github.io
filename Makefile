publish:
	git submodule update --init --recursive --remote
	bundle exec rake site:deploy --quiet
	@echo "Done publishing."
	@echo "https://alexonepath.github.io/"