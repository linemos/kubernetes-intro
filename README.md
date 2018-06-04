# kubernetes-intro

This is an introduction to Kubernetes. During this workshop you will learn how to deploy a frontend application and a backend application on a Kubernetes cluster on Google Cloud.

## Sign up
Create an account on Google Cloud Platform. 
  - Go to: https://console.cloud.google.com 
  - Sign up. You will have to register a payment method to complete the sign up. The first 12 months are free, as long as you don't use more than the included $300 credits, so you should not be charged anything for this workshop.
  - Create a project

## Installation
In order to explore the Kubernetes cluster on Google Kubernetes Engine you need to install the Google Cloud SDK command line tool.
  - Follow the guide [here](https://cloud.google.com/sdk/downloads).
  - Do **all steps** in the guide until you have typed:  `gcloud init`.
      - Authenticate in the browser when you are asked to. 
      - Choose to create a new project. 
      You will have to give it a name and it will be given a unique **project ID** that we will use in the rest of the workshop. 
 
      **After the init process is finished**
      - Go back to the [Google Cloud Console](https://console.cloud.google.com/) in your browser and search in the search field for *Google Compute Engine API*.
      - You will be asked to enable billing at this point. Choose your billing account and click enable for this project.
      - Click *enable*.
      

```
gcloud auth login
```


## Create a cluster.

We need a cluster where we want to run our application.

You can create the cluster both in the Console view in your browser and by the gcloud command line tool. We will use the Console to do it and also look at the equivalent gcloud command. 

- Visit [Google Cloud Console](https://console.cloud.google.com/) in your browser. Click on *Kubernetes Engine* in the left side menu. If you are asked to enable the engine, do so. Click on the button *CREATE CLUSTER*
- Name your cluster `cv-cluster`.
- Choose the zone `europe-west1b`.
- Choose Cluster Version. Set to `1.10.2-gke.1`
- Next you see that you can select what machine type to use. This defines the resources each node in your cluster will have. You don't need to change this.
- You can also select the image for the virtual machines for the nodes. The default Container Optmized OS is good for our use case. The size for the node pool defaults to 3. We will leave that as is. Feel free to explore the other options below, but there are no other changes we need to do before creating our cluster.
- Just below the create button, there are two links to get the command line and REST request. Click on these to see how you can create the same cluster without the GUI.
- Click Create. This will probably take several minutes. In the meantime you can move on to the next section. Notice that you can view the setup progress for your cluster in the top right corner.

## Install the Kubernetes command-line tool
To operate our cluster, we will use the Kubernetes command line tool, kubectl:

```
gcloud components install kubectl
```

The cloud SDK installs the tool for you. This tool is not Google Cloud specific, but is used to operate Kubernetes clusters regardless of where they are hosted.

You can see if your cluster is created by this command:

```
gcloud container clusters list
```

If the status of your cluster is `RUNNING`, you are good to go. The next step is to make sure that the Kubernetes command line tool is authenticated against our new cluster. This is easily done by this neat gcloud command:

```
gcloud container clusters get-credentials cv-cluster
```

What this does is to write credentials to the file `~/.kube/config`. You can take a look at it too see what is written to it.

## Describe components of the cluster
Now that we are authenticated, we can look at the components in our cluster by using the kubectl command.

Remember how Kubernetes consists of nodes? List them by this command:
```
kubectl get nodes
```

If you want you can get more details about them by describing one of them:
```
kubectl describe nodes <INSERT_NODE_NAME>
```

We also have different namespaces:
```
kubectl get namespace
```

This should list three namespaces. `kube-system`, `kube-public` and `default`. The namespace `default`is where we will deploy our applications. `kube-system` is used by Kubernetes

## Deployment
In Github, fork this project. You have an account and be logged in to do so.

## Docker containers
To create a deployment on Kubernetes, you need to specify at least one container for your application. Kubernetes will on a deploy pull the image specified and create pods with this container. Docker is the most commonly used container in Kubernetes.

In this repository you will find code for both applications in the backend and frontend directories. Each of these folders also have their own Dockerfile. Take a look at the files
[frontend/Dockerfile](./frondend/Dockerfile) and [backend/Dockerfile](./backend/Dockerfile) too see how they are built up. We could create the Docker images locally from our computer by building it with the docker deamon, but we are going to explore build triggers in Google Cloud Platform instead.

### Build triggers
- To create a build trigger, go to cloud console and find Container Registry in the left side menu and click *Build triggers*, then *Create trigger*
- Choose Github as build source. Click *Continue*
- Select your fork as repository and click *Continue*
- Now you must specify your build trigger:
	- *Trigger Name*: Backend trigger
	- *Trigger Type*: You can set a trigger to start a build on commits to a particular branch, or on commits that contain a particular tag. Enter `:backend:` // dobbeltsjekk
	- *Build Configuration*: Point to the backend Dockerfile in `./backend/Dockerfile`
	- *Image name* ...
- Set branch to `master`
- Tag....
- Click *Create*

Now, do the same thing for the frontend application. Use the tag `:frontend:` and set the Docker image to be `gcr.io/[YOUR_PROJECT_ID]/frontend`.

This sets up a build trigger that listens to new commits on the master branch of your repository. If the commit is tagged with `:frontend:`, it will use the Dockerfile in the backend directory to create a new Docker image. Click on the small menu on the trigger and select *Run trigger* to test it. Once it is finished building, you can find the image under the Images menu point.

### Test the build trigger
You tried to run the build trigger manually in the previous step. Now you will test how it works on new commits on your Github repository. Open the file [./backend/server.js](./backend/server.js) and edit the JSON responses to your name, workplace and education. Commit with a message that includes `:backend:`.

Go back to the Build triggers in Cloud Console and click on *Builds* to see whether the backend starts building. Notice that you can follow the build log if you want to see whats going on.

When it is done, go to the Images in the menu and make sure that you can find your backend image there.


## Deploy to your Kubernetes Cluster
It's time to deploy the frontend and backend to your cluster!

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

.... Hva med headless service med selector?

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

3.  Update the [./yaml/frontend-service.yaml](./yaml/frontend-service.yaml):

...
... hmmm NodePort service eller ingress?

```
kubectl apply -f ./yaml/frontend-service.yaml
```

4. Wait for your service to get an external IP
```
watch kubectl get service
```

If you don't have `watch` installed:

```
kubectl get service -w
```

5. Visit the external IP in your peferred browser to make sure you see your awezome CV online

## Rolling updates
As you read earlier, Kubernetes can update your application without down time with a rolling-update strategy. You will now update the background color of the frontend application, see that the build trigger creates a new image and update the deployment to use this.

1. Open the file [./frontend/INSERT_FILE](./frontend/INSERT_FILE) and edit the field `background-color` to your favourite color
2. Commit your changes and make sure to include :frontend: in your commit message (and push if you edit from your local computer)
3. Go back to the cloud console in your browser and make sure that the build trigger finishes successfully
4. Navigate to the Docker image and click *Add tag*. Add the tag `2.0`
5. Update the image specification on the file [./yaml/backend-deployment.yaml](./yaml/backend-deployment.yaml) by adding the tag `:2.0`
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
kubectl apply -f ./yaml/backend-deployment.yaml
```

and watch how the Pods are terminated and created in the other terminal window. Notice that there are always at least one Pod running and that the last of the old Pods are first terminated when on of the new ones has the status running.
