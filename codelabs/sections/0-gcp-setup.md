## Sign up
Create an account on Google Cloud Platform. 
  1. Go to: https://console.cloud.google.com 
  2. Sign up. You will have to register a payment method to complete the sign up. The first 12 months are free, as long as you don't use more than the included $300 credits, so you should not be charged anything for this workshop.

### Installation
In order to explore the Kubernetes cluster on Google Kubernetes Engine you need to install the Google Cloud SDK command line tool.


### Download the Google Cloud SDK 
  
  **Linux/Mac:** 
  
  1. Enter the following at a command prompt: `curl https://sdk.cloud.google.com | bash`
  2. Restart your shell: `exec -l $SHELL`
  3. Run gcloud init to initialize the gcloud environment: `gcloud init` 
  
  **Windows:**
  
  1. Download the [Cloud SDK installer](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe).
  2. Launch the installer and follow the prompts.
  Cloud SDK requires Python 2 with a release version of Python 2.7.9 or later.
  3. After installation has completed, accept the following options:
        - Start Cloud SDK Shell
        - Run `gcloud init`
  The installer starts a terminal window and runs the `gcloud init` command.
  The default installation does not include the App Engine extensions required to deploy an application using gcloud commands.
    
    
### Initialize gcloud

Authenticate in the browser when you are asked to with the `gcloud init` command. 
Pick an existing project as your default for now (*option 1*). Example on the output in your terminal:
    
    Pick cloud project to use:
     [1] arched-media-225216
     [2] Create a new project
    Please enter numeric choice or text value (must exactly match list
    item):  1

## Create a cluster
We need a cluster where we want to run our application.

You can create the cluster both in the Console view in your browser and by the gcloud command line tool.
We will use the Console to do it and also look at the equivalent gcloud command provided by the Google Console. 

  1. Visit [Google Cloud Console](https://console.cloud.google.com/) in your browser.
     Click on *Kubernetes Engine* in the left side menu. If you are asked to enable the engine, do so. Read [this](https://cloud.google.com/kubernetes-engine/kubernetes-comic/) cartoon while you wait for it to get ready.
  2. Click on the button *CREATE CLUSTER*
  3. Choose *Standard cluster*
  3. Give the cluster the name `cv-cluster`.
  4. Choose the zone `europe-north1-a` (which is in Finland).
  5. Choose Master Version: Set it to the newest available version.
  6. Next you see that you can select what machine type to use. This defines the resources each node in your cluster will have. You don't need to change this.
  7. On the right side of the create button, there are two links to get the command line and REST request. Click on these to see how you can create the same cluster without the GUI.
  8. Click Create. This will probably take several minutes. In the meantime you can move on to the next section. Notice that you can view the setup progress for your cluster in the top right corner.
