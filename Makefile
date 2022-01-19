.PHONY: cbuild start stop restart sh logs compile deploy tsh test addresses lint run fsh ftest flint

container=shitcoin-factory
frontend=frontend

# Build the container
cbuild:
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
	docker compose logs -f

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
	docker compose exec $(container) yarn run lint
	docker compose exec $(container) yarn run check
	docker compose exec $(container) yarn run lintjs
	docker compose exec $(container) yarn run checkjs

run:
	docker compose exec $(container) truffle exec index.js

# frontend commands

fsh:
	docker compose exec $(frontend) sh

ftest:
	docker compose exec -T $(frontend) /bin/sh -c "yarn test"

flint:
	docker compose exec -T $(frontend) /bin/sh -c "yarn eslint '**/*.ts' --fix"
	docker compose exec -T $(frontend) /bin/sh -c "yarn prettier --write '**/*.ts'"
