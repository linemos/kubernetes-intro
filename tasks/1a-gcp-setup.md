# Google Cloud Platform setup
Follow these steps to set up a cluster in Google Kubernetes Engine.

## Sign up
Create an account on Google Cloud Platform. 
  1. Go to: https://console.cloud.google.com 
  2. Sign up. You will have to register a payment method to complete the sign up. The first 12 months are free, as long as you don't use more than the included $300 credits, so you should not be charged anything for this workshop.

## Installation
In order to explore the Kubernetes cluster on Google Kubernetes Engine you need to install the Google Cloud SDK command line tool.
  1. Follow the guide [here](https://cloud.google.com/sdk/docs/downloads-interactive).
  2. Do **all steps** in the guide until you have typed:  `gcloud init`.
        - Authenticate in the browser when you are asked to. 
        - Choose to create a new project. 
      You will have to give it a name and it will be given a unique **project ID** that we will use in the rest of the workshop. 

## Create a cluster.
We need a cluster where we want to run our application.

You can create the cluster both in the Console view in your browser and by the gcloud command line tool. We will use the Console to do it and also look at the equivalent gcloud command. 

  1. Visit [Google Cloud Console](https://console.cloud.google.com/) in your browser. *Make sure that the selected project on the blue hader on top of the page is the same as you created in the previous step*. Click on *Kubernetes Engine* in the left side menu. If you are asked to enable the engine, do so. Click on the button *CREATE CLUSTER*
  2. Name your cluster `cv-cluster`.
  3. Choose the zone `europe-west2-b`.
  4. Choose Cluster Version. Set to `1.10.2-gke.3`
  5. Next you see that you can select what machine type to use. This defines the resources each node in your cluster will have. You don't need to change this.
  6. You can also select the image for the virtual machines for the nodes. The default Container Optmized OS is good for our use case. The size for the node pool defaults to 3. We will leave that as is. Feel free to explore the other options below, but there are no other changes we need to do before creating our cluster.
  7. Just below the create button, there are two links to get the command line and REST request. Click on these to see how you can create the same cluster without the GUI.
  8. Click Create. This will probably take several minutes. In the meantime you can move on to the next section. Notice that you can view the setup progress for your cluster in the top right corner.


## Next

[Go back to complete the installation and setup](./1-installation-tasks.md).
