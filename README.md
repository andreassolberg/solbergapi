# Deploying to docker



    docker build -t andreassolberg/solbergapi .
    docker run -d -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker run -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker ps


