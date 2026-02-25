CONTAINER_NAME=postgres_processo
DB_USER=contatita_user
DB_NAME=contatita_database

.PHONY: prepare-environment stop clean format-all

prepare-environment:
	@echo "Subindo containers..."
	docker compose up -d
	@echo "Aguardando PostgreSQL ficar pronto..."
	@until docker exec $(CONTAINER_NAME) pg_isready -U $(DB_USER) -d $(DB_NAME); do \
		echo "Aguardando banco..."; \
		sleep 2; \
	done
	@echo "Rodando migrations..."
	docker cp migrations/schema-create.sql $(CONTAINER_NAME):/schema-create.sql
	docker exec $(CONTAINER_NAME) psql -U $(DB_USER) -d $(DB_NAME) -f /schema-create.sql
	@echo "Ambiente pronto!"

stop:
	docker compose down

clean:
	docker compose down -v

format-all:
	@echo "Formatando backend..."
	cd backend && npm run format
	@echo "Formatando frontend..."
	cd frontend && npm run format
	@echo "Formatação concluída!"