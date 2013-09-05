REPORTER = list
LIB_COV = static/lib-cov
JSON_FILE = static/all.json
HTML_FILE = static/coverage.html

test-all: clean document lib-cov test-code

document:
	yuidoc -q --configfile static/yuidoc.json
  
push:
	yuidoc -q --configfile static/yuidoc.json
	git add . && git commit -m "WIP" && git push

test-code:
	@NODE_ENV=test mocha \
  --timeout 200 \
  --ui exports \
  --reporter $(REPORTER) \
  test/*.js

test-cov: lib-cov
	@APP_COVERAGE=1 $(MAKE) test \
	REPORTER=html-cov > $(HTML_FILE)

lib-cov:
	jscoverage lib $(LIB_COV)

clean:
	rm -fr static/lib-cov/*
	rm -fr static/codex/*