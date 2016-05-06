VERSION := $(shell git describe --always --tags --abbrev=0 | tail -c +2)
RELEASE := $(shell git describe --always --tags | awk -F- '{ if ($$2) dot="."} END { printf "1%s%s%s%s\n",dot,$$2,dot,$$3}')
VENDOR := "SKB Kontur"
URL := "https://github.com/moira-alert"
LICENSE := "GPLv3"

default: test build tar

build:
	npm run build

test: prepare
	npm test

.PHONY: test

prepare:
	npm install

clean:
	rm -rf build

tar:
	mkdir -p build/root/var/www/moira || true
	cp -rf favicon.ico build/root/var/www/moira/
	cp -rf config.json.example build/root/var/www/moira/
	cp -rf dist/* build/root/var/www/moira/
	tar -czvPf build/moira-web-$(VERSION)-$(RELEASE).tar.gz -C build/root  .

rpm:
	fpm -t rpm \
		-s "tar" \
		--description "Moira Web" \
		--vendor $(VENDOR) \
		--url $(URL) \
		--license $(LICENSE) \
		--name "moira-web" \
		--version "$(VERSION)" \
		--iteration "$(RELEASE)" \
		-p build \
		build/moira-web-$(VERSION)-$(RELEASE).tar.gz

deb:
	fpm -t deb \
		-s "tar" \
		--description "Moira Web" \
		--vendor $(VENDOR) \
		--url $(URL) \
		--license $(LICENSE) \
		--name "moira-web" \
		--version "$(VERSION)" \
		--iteration "$(RELEASE)" \
		-p build \
		build/moira-web-$(VERSION)-$(RELEASE).tar.gz

packages: clean tar rpm deb
