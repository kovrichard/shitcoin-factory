.PHONY: build start stop restart sh logs compile deploy tsh test addresses lint run

container=shitcoin-factory

# Build the container
build:
	docker compose build

# Start the container
start:
	docker compose up -d

# Stop the container
stop:
	docker compose stop

# Restart the container
restart: stop start

# Open a shell inside the container
sh:
	docker compose exec $(container) sh

# Watch live logs of the container
logs:
	docker compose logs -f $(container)

# Compile smart contracts
compile:
	docker compose exec $(container) truffle compile

# Deploy smart contracts to the blockchain
deploy:
	docker compose exec $(container) truffle migrate --reset

# Open truffle shell inside the container
tsh:
	docker compose exec $(container) truffle console

# Run tests
test:
	docker compose exec $(container) truffle test

addresses:
	docker compose exec $(container) truffle exec addresses.js

lint:
	docker compose exec ${container} npm run lint
	docker compose exec ${container} npm run check
	docker compose exec ${container} npm run lintjs
	docker compose exec ${container} npm run checkjs

run:
	docker compose exec ${container} truffle exec index.js
