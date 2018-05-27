# kubernetes-intro

This is an introduction to Kubernetes. During this workshop you will learn how to deploy a frontend application and a backend application on a Kubernetes cluster on Google Cloud.

In this repository you will find code for both applications in the backend and frontend directories. Each of these folders also have their own Dockerfile.

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
  gcloud auth login ...?
  ```


## Docker containers

### Build triggers

## Create a cluster.

We need a cluster where we want to run our application.

You can create the cluster both in the Console view in your browser and by the gcloud command line tool. We will use the Console to do it and also look at the equivalent gcloud command. 

- Visit[Google Cloud Console](https://console.cloud.google.com/) in your browser. Click on *Kubernetes Engine* in the left side menu. If you are asked to enable the engine, do so. Click on the button *CREATE CLUSTER*
- Name your cluster `cv-cluster`.
- Choose the zone `europe-west1b`.
- Choose Cluster Version. Set to `1.10.2-gke.1`
- Next you see that you can select what machine type to use. This defines the resources each node in your cluster will have. You don't need to change this.
- You can also select the image for the virtual machines for the nodes. The default Container Optmized OS is good for our use case. The size for the node pool defaults to 3. We will leave that as is. Feel free to explore the other options below, but there are no other changes we need to do before creating our cluster.
- Just below the create button, there are two links to get the command line and REST request. Click on these to see how you can create the same cluster without the GUI.
- Click Create. This will probably take several minutes. In the meantime you can move on to the next section. Notice that you can view the setup progress for your cluster in the top right corner.

##Install the Kubernetes command-line tool
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

