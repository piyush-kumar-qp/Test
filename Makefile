.PHONY: install build up down dev

install:
	npm install

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

dev:
	npm run dev

dev:frontend:
	npm run dev:frontend

shake:
	npm run start:debug --workspace=backend