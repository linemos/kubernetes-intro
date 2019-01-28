## Deploy to your Kubernetes Cluster

It's time to deploy the frontend and backend to your cluster!
The preferred way to configure Kubernetes resources is to specify them in YAML files.

In the folder [yaml/](../../yaml) you find the YAML files specifying what resources Kubernetes should create.
There are two services, one for the backend application and one for the frontend application.
Same for the deployments.

1. Open the file [yaml/backend-deployment.yaml](../../yaml/backend-deployment.yaml) and
in the field `spec.template.spec.containers.image` insert your backend Docker image full name. 
It should be something like `gcr.io/MY_PROJECT_ID/backend:TAG_NAME`, example: `gcr.io/my-kubernetes-project-1234/backend:cv-backend-1`.
 
If you did not create build triggers, use the docker image `gcr.io/arched-media-225216/backend:cv-backend-3`. 

There are a few things to notice in the deployment file:
- The number of replicas is set to 3. This is the number of pods we want running at all times
- The container spec has defined port 5000, so the Deployment will open this port on the containers
- The label `app: backend` is defined three places:
  - `metadata` is used by the service, which we will look at later
  - `spec.selector.matchLabels` is how the Deployment knows which Pods to manage
  - `spec.template.metadata` is the label added to the Pods
  
2. Open the file [yaml/frontend-deployment.yaml](../../yaml/frontend-deployment.yaml) and
in the field `spec.template.spec.containers.image` insert your frontend Docker image full name. 
It should be something like `gcr.io/MY_PROJECT_ID/frontend:TAG_NAME`. If you did not create build triggers, use `gcr.io/arched-media-225216/frontend:cv-frontend-3` instead.

2. Create the resources for the backend and frontend (from root folder in the project):
  
  ```
  kubectl apply -f ./yaml/backend-deployment.yaml
  kubectl apply -f ./yaml/frontend-deployment.yaml
  ```

3. Watch the creation of pods:
  
  ```
  watch kubectl get pods
  ```

  If you don't have `watch` installed, you can use this command instead:
  
  ```
  kubectl get pods -w
  ```

  When all pods are running, quit by `ctrl + q` (or `ctrl + c` when on Windows).

Pods are Kubernetes resources that mostly just contains one or more containers,
along with some Kubernetes network stuff and specifications on how to run the container(s).
Our pods all just contains one container. There are several use cases where you might want to specify several
containers in one pod, for example if your application is using a proxy.

The Pods were created when you applied the specification of the type `Deployment`,
which is a controller resource. 
The Deployment specification contains a desired state and the Deployment controller changes the state to achieve this.
When creating the Deployment, it will create ReplicaSet, which it owns.
The ReplicaSet will then create the desired number of pods, and recreate them if the Deployment specification changes,
e.g. if you want another number of pods running or if you update the Docker image to use.
It will do so in a rolling-update manner, which we will explore soon.

*Did you noticed that the pod names were prefixed with the deployment names and two hashes?* - The first hash is the hash of the ReplicaSet, the second is unique for the Pod.

4. Explore the Deployments:
  
  ```
  kubectl get deployments
  ```

Here you can see the age of the Deployment and how many Pods that are desired in the configuration specification,
the number of running pods, the number of pods that are updated and how many that are available.

5. Explore the ReplicaSets:
  
  ```
  kubectl get replicaset
  ```

The statuses are similar to those of the Deployments, except that the ReplicaSet have no concept of updates.
If you run an update to a Deployment, it will create a new ReplicaSet with the updated specification and
tell the old ReplicaSet to scale number of pods down to zero.

### Create services
Now that our applications are running, we would like to route traffic to them.

1. Open [yaml/backend-service.yaml](../../yaml/backend-service.yaml)
  There are a few things to notice:
    - The protocol is set to TCP, which means that the Service sends requests to Pods on this protocol. UDP is also supported
    - The spec has defined port 80, so it will listen to traffic on port 80 and sends traffic to the Pods on the same port. We could also define `targetPort` if the port on the Pods are different from the incoming traffic port
    - The label `app: backend` defines that it should route requests to our Deployment with the same label

2. Create the Services:

  ```
  kubectl apply -f ./yaml/backend-service.yaml
  kubectl apply -f ./yaml/frontend-service.yaml
  ```

2. List the created services:
  
  ```
  kubectl get service
  ```

As you can see, both services have defined internal IPs, `CLUSTER-IP`. These internal IPs are only available inside the cluster. But we want our frontend application to be available from the internet. In order to do so, we must expose an external IP.

### Exposing your app
Ok, so now what? With the previous command, we saw that we had two services, one for our frontend and one for our backend. But they both had internal IPs, no external. We want to be able to browse our application from our browser.
Lets look at another way. The Service resource can have a different type, it can be set as a LoadBalancer.

1. Open the frontend service file again
2. Set `type` to be `LoadBalancer`
3. Save and run

  ```
  kubectl apply -f ./yaml/frontend-service.yaml
  ```
  
4. Wait for an external IP:

  ```
  watch kubectl get service frontend
  ```

  or
  
  ```
  kubectl get service frontend -w
  ```

5. Visit the IP in your browser to see your amazing CV online. But something is off!
    There is no data, and if you inspect the network traffic in the browser console log, you can see that the requests to the api is responding with an error code.

    This is because the frontend application is expecting the IP of the backend Service to be set at the point of deployment.
    But since we deployed the frontend application before creating the Service objects,
    meaning there was not any IP to give the frontend container on creation time.
    
6. To fix this, we can delete the ReplicaSet for the frontend application:

   ```
   kubectl delete replicaset -l app=frontend
   ```

    By doing this, the Deployment will create a new ReplicaSet which will again create new Pods.
    At this time the backend Service exists and is given to the frontend application.

 