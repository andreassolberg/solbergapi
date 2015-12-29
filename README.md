# Deploying to docker



    docker build -t andreassolberg/solbergapi .
    docker run -d -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker run -p 8080:8080 --env-file=./ENV -t andreassolberg/solbergapi
    docker ps



# Deploying to Google Cloud Engine

Resource controller

    # kubectl create -f secrets.yaml
    # kubectl create -f pod.json
    kubectl create -f rc.json


Secrets

    echo -n some-base64-encoded-payload | base64
    kubectl create -f secrets.yaml

Load balancer 

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



## Update

Update image:

    kubectl rolling-update solbergapirc --image=andreassolberg/solbergapi:latest



## Upgrade cluster

    gcloud container clusters upgrade CLUSTER_NAME









----- 


Does not work.

    kubectl rolling-update solbergapirc -f rc.json 
