CONTAINER_NAME=contatita-banco_postgres_processo_seletivo-1
DB_USER=contatita_user
DB_NAME=contatita_database

.PHONY: prepare-environment stop clean

prepare-environment:
	@echo "Subindo container do PostgreSQL..."
	docker compose up -d
	@echo "Aguardando PostgreSQL ficar pronto..."
	@until docker exec $(CONTAINER_NAME) pg_isready -U $(DB_USER) -d $(DB_NAME); do \
		echo "Aguardando..."; \
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