# Deploying to docker



    docker build -t andreassolberg/solbergapi .
    docker run -d -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker run -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker ps



# Deploying to Google Cloud Engine

    # kubectl create -f secrets.yaml
    # kubectl create -f pod.json
    kubectl create -f rc.json
    kubectl expose rc solbergapirc --type="LoadBalancer" --port 80 --target-port 8080


Debug:

    gcloud container clusters list
    gcloud container clusters describe smedstua-cluster
    kubectl get pods
    kubectl describe pods
    kubectl get services
    kubectl describe services
    kubectl get rc
    kubectl describe rc


------
