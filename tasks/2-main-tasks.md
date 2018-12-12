# Main tasks

## Fork this repository

**If you *did create* your own Goggle Cloud project and cluster**; fork this repo and clone it on your laptop.
We need this to use build triggers in the next step. 

**If you *did NOT* create your own Google Cloud project**; clone this repository and jump to the assignments under [Deploy to your Kubernetes Cluster](#deploy-to-your-kubernetes-cluster).


## Docker containers
To create a deployment on Kubernetes, you need to specify at least one container for your application.
Kubernetes will on a deploy pull the image specified and create pods with this container.
Docker is the most commonly used container in Kubernetes.

In this repository you will find code for both applications in the backend and frontend directories.
Each of these folders also have their own Dockerfile.
Take a look at the docker files too see how they are built up:
  - [frontend/Dockerfile](../frontend/Dockerfile)
  - [backend/Dockerfile](../backend/Dockerfile)
  
Notice the `.dockerignore` files as well.
This file tells the Docker daemon which files and directories to ignore, for example the `node_modules` directory.

We could create the Docker images locally from our computer by building it with the docker deamon,
but we are going to explore build triggers in Google Cloud Platform instead.

### Build triggers
1. Go to cloud console: find **Cloud Build** in the left side menu (under tools).
If you are asked to enable the Container Build API, do so.
2. Click *Create trigger*
3. Choose Github as build source. Click *Continue*
4. Select your fork as the repository and click *Continue*
5. Now its time to specify the build trigger:
    - *Name*: Backend trigger
    - *Trigger type*: `Tag`
    -  Set tag to `cv-backend-.*`
    - Leave *Included files filter (glob)* and *Ignored files filter (glob)* empty
    - *Build Configuration*: Dockerfile
    - *Dockerfile directory*: Point to the backend Dockerfile in `backend/`
    - *Dockerfile name*: `Dockerfile`
    - *Image name*: `gcr.io/$PROJECT_ID/backend:$TAG_NAME`
   
6. Click *Create trigger*

Now, do the same thing for the frontend application.
Name it `Frontend trigger`, and set the directory to be `/frontend/` and
set the Docker image to be `gcr.io/$PROJECT_ID/frontend:$TAG_NAME`.

This sets up a build trigger that listens to new commits on the master branch of your repository.
If the commit is tagged with `cv-frontend-1`, it will use the Dockerfile in the frontend directory to create a new Docker image.

7. Click on the small menu on the trigger and select *Run trigger* to test it
8. Once it is finished building, you can find the image under the *Builder Images* in the menu point.

### Test the build trigger
You tried to run the build trigger manually in the previous step.
Now you will test how it works on new commits on your GitHub repository.

#### Change the code
Open the file [backend/server.js](../backend/server.js) and edit the JSON responses to your name, workplace and education.
You can either change the code in an editor or in GitHub directly. Commit and push your commit.

#### Publish your changes
We need to add a tag to notify our build triggers that the code has changed and need to rebuild. 
There are two ways to ad a tag:

**In the terminal**

If you commit from the git command line, the command to tag the latest commit is:

  ```
  git tag -a cv-backend-2
  git push --tags
  ```
*NB: Remember to change the latest number in your tag. If cv-backend-2 already is a tag, you should use cv-backend-3* 

**In GitHub**

You can add a tag to your directly from GitHub: 
1. In the repo, Click on *releases*, next to contributors.
2. Click on *Draft a new release*
3. Write your new tag, i.e., *cv-backend-2*
4. Create release title if you want (ex: What have you done?)
5. Click *Publish release*

**Then**

Go back to the Build triggers in Cloud Console and click on *Build history* to see whether the backend starts building.
Notice that you can follow the build log if you want to see whats going on. 

## Deploy to your Kubernetes Cluster
It's time to deploy the frontend and backend to your cluster!
The preferred way to configure Kubernetes resources is to specify them in YAML files.

In the folder [yaml/](../yaml) you find the YAML files specifying what resources Kubernetes should create.
There are two services, one for the backend application and one for the frontend application.
Same for the deployments.

1. Open the file [yaml/backend-deployment.yaml](../yaml/backend-deployment.yaml) and
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
  
2. Open the file [yaml/frontend-deployment.yaml](../yaml/frontend-deployment.yaml) and
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

## Create services
Now that our applications are running, we would like to route traffic to them.

1. Open [yaml/backend-service.yaml](../yaml/backend-service.yaml)
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

## Exposing your app
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

 
## Rolling updates
As you read earlier, Kubernetes can update your application without down time with a rolling-update strategy. 
You will now update the background color of the frontend application, see that the build trigger creates a new image and
update the deployment to use this in your web application.

1. Open the file [frontend/src/index.css](../frontend/src/index.css) and edit the field `background-color` to your favourite color
2. Commit your changes
3. Create a *cv-frontend-2.0* tag like we did earlier. 
3. Go back to the cloud console in your browser and make sure that the build trigger finishes successfully
4. Update the image specification on the file [yaml/frontend-deployment.yaml](../yaml/frontend-deployment.yaml) by adding the tag `:2.0`
5. Open a new terminal window to watch the deletion and creation of Pods:
  
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

and watch how the Pods are terminated and created in the other terminal window.
Notice that there are always at least one Pod running and that the last of the old Pods are first terminated when on of the new ones has the status running.

## Inspection and logging
Ok, everything looks good!
But what if you need to inspect the logs and states of your applications?
Kubernetes have a built in log feature.
Lets take a look at our backend application, and see what information we can retrieve.

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

2. Ok, the logs were fine! Lets look at the environment variables set by Kubernetes in our containers:
  
  ```
  kubectl exec -it <INSERT_THE_NAME_OF_A_POD> -- printenv
  ```

  Here you can see that we have IP addresses and ports to our frontend service.
  These IP addresses are internal, not reachable from outside the cluster.
  You can set your own environment variables in the deployment specification.
  They will show up in this list as well.

3. We can also describe our deployment, to see its statuses and pod specification:
  
  ```
  kubectl describe deployment backend
  ```
  
  Notice that `StrategyType: RollingUpdate` that we saw when we applied an updated frontend is set by default.


## DNS
A cool thing in Kubernetes is the Kubernetes DNS.
Inside the cluster, Pods and Services have their own DNS record.
For example, our backend service is reachable on `backend.<NAMESPACE>.svc.cluster.local`. If you are sending the request from the same namespace, you can also reach it on `backend`.
We will take a look at this.

1. Get your current namespace

  ```
  kubectl config view | grep namespace: 
  ```

  If there is no output, your namespace is `default`.

2. List pods to copy a pod name

  ```
  kubectl get pods -l app=frontend
  ```

2. We will run `curl` from one of our frontend containers to see that we can reach our backend internally on `http://backend.<NAMESPACE>.svc.cluster.local:5000`

  ```
  kubectl exec -it INSERT_FRONTEND_POD_NAME -- curl -v http://backend.<NAMESPACE>.svc.cluster.local:5000
  ```

  The HTTP status should be 200 along with the message "Hello, I'm alive"

3. Run `curl` from the same container to see that we can reach our backend internally on the shortname `http://backend:5000` as well

  ```
  kubectl exec -it INSERT_FRONTEND_POD_NAME -- curl -v http://backend:5000
  ```

  The output should be the same as above. 
  
4. To fix the issue where we had to delete the frontend ReplicaSet to get the internal IP for the backend Service could be avoided if we used the DNS instead. 

## Next

Continue with the [extra tasks](./3-extra-tasks.md).

Before you quit: [Delete your cluster and clean up](./4-delete-tasks.md).
