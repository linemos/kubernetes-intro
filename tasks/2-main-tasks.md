#Main tasks

## Fork this repository
In GitHub, fork this project. You need a fork to use build triggers in the next step. You have an account and be logged in to do so.

## Docker containers
To create a deployment on Kubernetes, you need to specify at least one container for your application. Kubernetes will on a deploy pull the image specified and create pods with this container. Docker is the most commonly used container in Kubernetes.

    In this repository you will find code for both applications in the backend and frontend directories. Each of these folders also have their own Dockerfile. Take a look at the files
    [frontend/Dockerfile](./frondend/Dockerfile) and [backend/Dockerfile](./backend/Dockerfile) too see how they are built up. Notice the `.dockerignore` files as well. This file tells the Docker daemon which files and directories to ignore, for example the `node_modules` directory.

    We could create the Docker images locally from our computer by building it with the docker deamon, but we are going to explore build triggers in Google Cloud Platform instead.

### Build triggers
1. To create a build trigger, go to cloud console and find Container Registry in the left side menu and click *Build triggers*, then *Create trigger*
2. Choose Github as build source. Click *Continue*
3. Select your fork as repository and click *Continue*
4. Now you must specify your build trigger:
    - *Trigger Name*: Backend trigger
- *Trigger Type*: You can set a trigger to start a build on commits to a particular branch, or on commits that contain a particular tag. Enter `:backend:` // dobbeltsjekk
- *Build Configuration*: Point to the backend Dockerfile in `./backend/Dockerfile`
- *Image name* ...
- Tag....
- Set branch to `master`
5. Click *Create*

Now, do the same thing for the frontend application. Use the tag `:frontend:` and set the Docker image to be `gcr.io/[YOUR_PROJECT_ID]/frontend`.

    This sets up a build trigger that listens to new commits on the master branch of your repository. If the commit is tagged with `:frontend:`, it will use the Dockerfile in the backend directory to create a new Docker image. Click on the small menu on the trigger and select *Run trigger* to test it. Once it is finished building, you can find the image under the Images menu point.

### Test the build trigger
1. You tried to run the build trigger manually in the previous step. Now you will test how it works on new commits on your GitHub repository. Open the file [./backend/server.js](./backend/server.js) and edit the JSON responses to your name, workplace and education.
2. Commit with a message that includes `:backend:`.
3. Go back to the Build triggers in Cloud Console and click on *Builds* to see whether the backend starts building. Notice that you can follow the build log if you want to see whats going on.
4. When it is done, go to the Images in the menu and make sure that you can find your backend image there.

## Deploy to your Kubernetes Cluster
It's time to deploy the frontend and backend to your cluster! The preferred way to configure Kubernetes resources is to specify them in YAML files.

In the folder [./yaml](./yaml) you find the YAML files specifying what resources Kubernetes should create. There is two services, one for the backend application and one for the frontend application. Same with deployments.

    1. Open the file [./yaml/backend-deployment.yaml](./yaml/backend-deployment.yaml) and in the field `spec.template.spec.containers.image` insert your backend Docker image full name. It should be something like `gcr.io/MY_PROJECT_ID/backend:1.0`

There are a few things to notice here:
    - The number of replicas is set to 3. This is the number of pods we want running at all times
- The container spec has defined port 80, so the Deployment will open this port on the containers
- The label `app: backend` is defined three places:
    - `metadata` is used by the service, which we will look at later
- `spec.selector.matchLabels` is how the Deployment knows which Pods to manage
- `spec.template.metadata` is the label added to the Pods

2. Create the resources for the backend and frontend:
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

When all pods are running, quit by `ctrl + q`.

    Pods are Kubernetes resources that mostly just contains one or more containers, along with some Kubernetes network stuff and specifications on how to run the container(s). Our pods all just contains one container. There are several use cases where you might want to specify several containers in one pod, for example if your application uses a proxy.

    The Pods were created when you applied the specification of the type `Deployment`, which is a controller resource. The Deployment specification contains a desired state. The Deployment controller changes the state to achieve this. When creating the Deployment, it will create ReplicaSet, which it owns. The ReplicaSet will then create the desired number of pods, and recreate them if the Deployment specification changes, e.g. if you want another number of pods running or if you update the Docker image to use. It will do so in a rolling-update manner, which we will explore soon. Noticed that the pod names were prefixed with the deployment names and two hashes? The first hash is the hash of the ReplicaSet, the second is unique for the Pod.

4. Explore the Deployments:
    ```
  kubectl get deployments
  ```

Here you can see the age of the Deployment and how many Pods that are desired in the configuration specification, the number of running pods, the number of pods that are updated and how many that are available.

5. Explore the ReplicaSets:
    ```
  kubectl get replicaset
  ```

The statuses are similar to those of the Deployments, exept that the ReplicaSet have no concept of updates. If you run an update to a Deployment, it will create a new ReplicaSet with the updated specification and tell the old ReplicaSet to scale number of pods down to zero.

## Create services
Now that our applications are running, we would like to route traffic to them.

1. Open [./yaml/backend-service.yaml](./yaml/backend-service.yaml)
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

As you can see, both services have defined internal IPs. These internal IPs are only available inside the cluster. But we want our frontend application to be available from the internet. In order to do so, we must expose an external IP.

3. Update the [./yaml/frontend-service.yaml](./yaml/frontend-service.yaml):
```
   kubectl apply -f ./yaml/frontend-service.yaml
   ```

4. Check that your service is up
    ```
   kubectl get service
   ```

## Exposing your app
Ok, so now what? With the previous command, we saw that we had two services, one for our frontend and one for our backend. But they both had internal IPs, no external. We want to be able to browse our application from our browser.In order to do so, we will now make an ingress.

    An ingress are an Kubernetes resource that will allow traffic from outside the cluster to your services. We will now create such a resource to get an external IP and allow requests to our frontend service.

1. Open the file [./yaml/ingress.yaml](./yaml/ingress.yaml)
Notice that we have defined that we have configured our ingress to send requests to our `frontend` service on port `8080`.
2. Create the ingress resource:
    ```
   kubectl apply -f ingress.yaml
   ```
3. Wait for an external IP to be configured
    ```
   watch kubectl get ingress cv-ingress
   ```
or
    ```
   kubectl get ingress cv-ingress -w
   ```
4. Visit the external IP in your peferred browser to make sure you see your awezome CV online

## Rolling updates
As you read earlier, Kubernetes can update your application without down time with a rolling-update strategy. You will now update the background color of the frontend application, see that the build trigger creates a new image and update the deployment to use this.

1. Open the file [./frontend/INSERT_FILE](./frontend/INSERT_FILE) and edit the field `background-color` to your favourite color
2. Commit your changes and make sure to include :frontend: in your commit message (and push if you edit from your local computer)
3. Go back to the cloud console in your browser and make sure that the build trigger finishes successfully
4. Navigate to the newly created Docker image and click *Add tag*. Add the tag `2.0`
5. Update the image specification on the file [./yaml/frontend-deployment.yaml](./yaml/frontend-deployment.yaml) by adding the tag `:2.0`
6. Open a new terminal window to watch the deletion and creation of Pods:
    ```
   watch kubectl get pods
   ```

If you don't have `watch` installed, you can use this command instead:

    ```
   kubectl get pods -w
   ```

Don't close this window.

7. In the other terminal window, apply the updated Deployment specification
    ```
   kubectl apply -f ./yaml/frontend-deployment.yaml
   ```

and watch how the Pods are terminated and created in the other terminal window. Notice that there are always at least one Pod running and that the last of the old Pods are first terminated when on of the new ones has the status running.

## Inspection and logging
Ok, everything looks good! But what if you need to inspect the logs and states of your applications? Kubernetes have a built in log feature. Lets take a look at our backend application, and see what information we can retrieve.

1. View the logs of one container
- First, list the pod names:
    ```
      kubectl get pods -l app=backend
      ```
The flag `l` is used to filter by pods with the label `app=backend`.

- Now, you can view the logs from one pod:
    ```
      kubectl logs <INSERT_THE_NAME_OF_A_POD>
      ```

    - You can also get all logs filtered by label.
    ```
      kubectl logs -l app=backend
      ```

Notice that this output appends the pods logs one by one, so the time could be a little confusing.

2. Ok, the logs were fine! Lets look at the environment variables set by Kubernetes in our containers:
    ```
  kubectl exec -it <INSERT_THE_NAME_OF_A_POD> -- printenv
  ```

Here you can see that we have IP adresses and ports to our frontend service. These IP adresses are internal, not reachable from outside the cluser. You can set your own environment variables in the deployment specification. They will show up in this list as well.

3. We can also describe our deployment, to see its statuses and pod specification:
    ```
  kubectl describe deployment backend
  ```
Notice that `StrategyType: RollingUpdate` that we saw when we applied an updated frontend is set by default.


## DNS
A cool thing in Kubernetes is the Kubernetes DNS. Inside the cluster, Pods and Services have their own DNS record. For example, our backend service is reachable on the record `backend.default.svc.cluster.local`. We will take a look at this.

    Kubernetes is running on nodes, Virtual Machines. We will now ssh into one of these nodes in order to curl our Kube DNS records.
1. List nodes:
    ```
   kubectl get nodes
   ```

2. Use `gcloud` to ssh into one of the nodes listed
    ```
   gcloud compute ssh <INSERT_NODE_NAME> --zone=europe-west1-b
   ```

3. Try to curl our backend service:
    ```
   curl -v backend.default.svc.cluster.local
   ```

The HTTP status should be 200 along with the message "Hello, I'm alive"

