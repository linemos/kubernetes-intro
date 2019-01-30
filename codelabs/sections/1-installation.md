## Installation 

### Install the Kubernetes command-line tool
1. To operate our cluster, we will use the Kubernetes command line tool, *kubectl*:
  ```
   gcloud components install kubectl
  ```

The cloud SDK installs the tool for you. This tool is not Google Cloud specific, but is used to operate Kubernetes clusters regardless of where they are hosted.

2. You can see if your cluster is created by this command:
   
   ```
   gcloud container clusters list
   ```

    If the status of your cluster is `RUNNING`, move on to the step 3. If there is no output, you might have the wrong project set in your config file. Do this to set the correct project:
  
    - Go back to your browser and click on the dropdown next to `Google Cloud Platform`. This should open a modal where at least one project is listed.
    - Copy the ID of the active project
    - Type this in your terminal:
  
        ```
        gcloud config set project INSERT_PROJECT_ID
        ```
    
    - Run:
    
        ```
        gcloud container clusters list
        ```
    
3. We want to set the default zone of our application, this tells google cloud where to look for the cluster.
We created our cluster in *europe-north1-a* and will set our default zone to this. 

    ```
    gcloud config set compute/zone europe-north1-a
    ``` 

4. The next step is to make sure that the Kubernetes command line tool is authenticated against our new cluster. This is easily done by this neat gcloud command:
    ```
   gcloud container clusters get-credentials cv-cluster
   ```

What this does is to write credentials to the file `~/.kube/config`. You can take a look at that file too see what is written to it.

**Extra task:** If you want bash autocompletion for kubectl, follow [these steps](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion).

### Describe components of the cluster
Now that we are authenticated, we can look at the components in our cluster by using the kubectl command.

1. Remember how Kubernetes consists of nodes? List them by this command:

    ```
   kubectl get nodes
   ```

2. If you want you can get more details about them by describing one of them:

    ```
   kubectl describe nodes <INSERT_NODE_NAME>
   ```
   
   A node is a worker machine in Kubernetes. A node may be a VM or physical machine, depending on the cluster.