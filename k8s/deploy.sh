#!/bin/bash

# Apply RBAC resources
kubectl apply -f rbac.yaml

# Apply deployments and services
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f nginx-deployment.yaml
kubectl apply -f database-statefulset.yaml

