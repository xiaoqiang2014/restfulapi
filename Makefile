
define docker_up
	docker compose stop -t 3
	docker compose up --build --force-recreate --remove-orphans -d
endef

dev: 
	$(call docker_up)

dev-clean:
	docker compose down -v