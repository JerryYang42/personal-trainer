.PHONY: install setup dev build start migrate seed test clean

install:
	npm install

## Run install + migrate + seed in one shot (first-time setup)
init: install migrate seed

dev:
	npm run dev

build:
	npm run build

start: build
	npm start

migrate:
	npm run migrate

seed:
	npm run seed

test:
	npm test

clean:
	rm -rf dist/ trainer.db drizzle/
