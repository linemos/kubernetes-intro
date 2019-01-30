author: Line Moseng and Ingrid Guren
id: lidev-introduction-to-kubernetes-namespace

<a name="introductiontokuberneteswithnamespaces"></a>

# 1\. Introduction to Kubernetes with Namespaces

<a name="setuptouseexistingcluster"></a>

# 2\. Setup to use existing cluster
Follow these steps to authenticate with an existing Google Kubernetes Engine cluster with a service account. You will not be able to do all tasks in the workshop with this setup.

<a name="installgooglecloudsdktool"></a>

## 1\. Install Google Cloud SDK tool
In order to explore the Kubernetes cluster on Google Kubernetes Engine you need to install the Google Cloud SDK command line tool.
1. Follow the guide to setup the `gcloud` tool, but stop before the step `gcloud init`. You can find the guide [here](https://cloud.google.com/sdk/docs/downloads-interactive)

<a name="activateserviceaccount"></a>

## 2\. Activate service account
Email `linemos@gmail.com` with the topic `Kubernetes intro SA` to create a service account.

When you have received an service account, download the file. We will use it to authenticate with Google Cloud.

1. Open the file and copy the email adress in the field `client_email`
2. Use this command to authenticate your computer with the cluster:

	```
	gcloud auth activate-service-account INSERT_CLIENT_EMAIL_HERE --key-file=PATH_TO_JSON_FILE --project INSERT_PROJECT_NAME	
	```

3. Verify that you have successfully authenticated by this command:

	```
	gcloud container clusters list
	```

	The result should be similar to this:

	```
	NAME        LOCATION         MASTER_VERSION  MASTER_IP       MACHINE_TYPE   NODE_VERSION  NUM_NODES  STATUS	
	cv-cluster  europe-north1-a  1.10.2-gke.3    35.197.214.235  n1-standard-2  1.10.2-gke.3  6          RUNNING
	```


<a name="describecomponentsofthecluster"></a>

### 1\. Describe components of the cluster
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

<a name="clonethisrepository"></a>

## 3\. Clone this repository

1. Clone [this](https://github.com/linemos/kubernetes-intro) repository to your laptop.



<a name="deploytoyourkubernetescluster"></a>

## 4\. Deploy to your Kubernetes Cluster

It's time to deploy the frontend and backend to your cluster!
The preferred way to configure Kubernetes resources is to specify them in YAML files.

In the folder [yaml/](https://github.com/linemos/kubernetes-intro/blob/master/yaml/) you find the YAML files specifying what resources Kubernetes should create.
There are two services, one for the backend application and one for the frontend application.
Same for the deployments.

1. Open the file [yaml/backend-deployment.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/backend-deployment.yaml) and
in the field `spec.template.spec.containers.image` insert the path to the Docker image we have created for the backend: `gcr.io/ndc-london-kubernetes/backend:1`. 

There are a few things to notice in the deployment file:
- The number of replicas is set to 3. This is the number of pods we want running at all times
- The container spec has defined port 5000, so the Deployment will open this port on the containers
- The label `app: backend` is defined three places:
  - `metadata` is used by the service, which we will look at later
  - `spec.selector.matchLabels` is how the Deployment knows which Pods to manage
  - `spec.template.metadata` is the label added to the Pods
  
2. Open the file [yaml/frontend-deployment.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/frontend-deployment.yaml) and
in the field `spec.template.spec.containers.image` insert `gcr.io/ndc-london-kubernetes/frontend:1`, which is a Docker image we have created for the frontend application.

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
All of our pods contains only one container. There are several use cases where you might want to specify several
containers in one pod, for instance if you need a proxy in front of your application.

The Pods were created when you applied the specification of the type `Deployment`, which is a controller resource. 
The Deployment specification contains a desired state and the Deployment controller changes the state to achieve this.
When creating the Deployment, it will create ReplicaSet, which it owns.

The ReplicaSet will then create the desired number of pods, and recreate them if the Deployment specification changes,
e.g. if you want another number of pods running or if you update the Docker image to use.
It will do so in a rolling-update manner, which we will explore soon. The Pods are running on the cluster nodes. 

![Illustration of deployments, replicasets, pods and nodes.](https://storage.googleapis.com/cdn.thenewstack.io/media/2017/11/07751442-deployment.png)



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

<a name="createservices"></a>

## 5\. Create services
Now that our applications are running, we would like to route traffic to them.

* Open [yaml/backend-service.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/backend-service.yaml)
  There are a few things to notice:
    - The protocol is set to TCP, which means that the Service sends requests to Pods on this protocol. UDP is also supported
    - The spec has defined port 80, so it will listen to traffic on port 80 and sends traffic to the Pods on the same port. We could also define `targetPort` if the port on the Pods are different from the incoming traffic port
    - The label `app: backend` defines that it should route requests to our Deployment with the same label

* Create the Services:

  ```
  kubectl apply -f ./yaml/backend-service.yaml
  kubectl apply -f ./yaml/frontend-service.yaml
  ```

* List the created services:
  
  ```
  kubectl get service
  ```

As you can see, both services have defined internal IPs, `CLUSTER-IP`. These internal IPs are only available inside the cluster. But we want our frontend application to be available from the internet. In order to do so, we must expose an external IP.

<a name="exposingyourapp"></a>

### 1\. Exposing your app
Ok, so now what? With the previous command, we saw that we had two services, one for our frontend and one for our backend. But they both had internal IPs, no external. We want to be able to browse our application from our browser.
Lets look at another way. The Service resource can have a different type, it can be set as a LoadBalancer.

* Open the frontend service file again
* Set `type` to be `LoadBalancer`
* Save and run

  ```
  kubectl apply -f ./yaml/frontend-service.yaml
  ```
  
* Wait for an external IP:

  ```
  watch kubectl get service frontend
  ```

  or
  
  ```
  kubectl get service frontend -w
  ```

* Visit the IP in your browser to see your amazing CV online. But something is off!
    There is no data, and if you inspect the network traffic in the browser console log, you can see that the requests to the api is responding with an error code.

    This is because the frontend application is expecting the IP of the backend Service to be set at the point of deployment.
    But we deployed the frontend application before creating the Service objects,
    meaning there was not any IP to give the frontend container on creation time.
    
* To fix this, we can delete the ReplicaSet for the frontend application:

   ```
   kubectl delete replicaset -l app=frontend
   ```

    By doing this, the Deployment will create a new ReplicaSet which will again create new Pods.
    At this time the backend Service exists and is given to the frontend application.

 

<a name="rollingupdates"></a>

## 6\. Rolling updates
As you read earlier, Kubernetes can update your application without down time with a rolling-update strategy. 
It is time to update to the newest version of the frontend application. This version has an updated background color.
 
* Update the image specification on the file [yaml/frontend-deployment.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/frontend-deployment.yaml) by adding the tag `:2`
* Open a new terminal window to watch the deletion and creation of Pods:
  
  ```
  watch kubectl get pods
  ```

  If you don't have `watch` installed, you can use this command instead:

  ```
  kubectl get pods -w
  ```

  Don't close this window.

* In the other terminal window, apply the updated Deployment specification
  
  ```
  kubectl apply -f ./yaml/frontend-deployment.yaml
  ```

and watch how the Pods are terminated and created in the other terminal window.

Notice that there are always at least one Pod running and that the last of the old Pods are first terminated when on of the new ones has the status running.



<a name="inspectionandlogging"></a>

## 7\. Inspection and logging
Ok, everything looks good!
But what if you need to inspect the logs and states of your applications?
Kubernetes have a built in log feature.

Lets take a look at our backend application, and see what information we can retrieve.

* View the logs of one container
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

* Ok, the logs were fine! Lets look at the environment variables set by Kubernetes in our containers:
  
  ```
  kubectl exec -it <INSERT_THE_NAME_OF_A_POD> -- printenv
  ```

  Here you can see that we have IP addresses and ports to our frontend service.
  These IP addresses are internal, not reachable from outside the cluster.
  You can set your own environment variables in the deployment specification.
  They will show up in this list as well.

* We can also describe our deployment, to see its statuses and pod specification:
  
  ```
  kubectl describe deployment backend
  ```
  
  Notice that `StrategyType: RollingUpdate` that we saw when we applied an updated frontend is set by default.


<a name="dns"></a>

### 1\. DNS
A cool thing in Kubernetes is the Kubernetes DNS.
Inside the cluster, Pods and Services have their own DNS record.
For example, our backend service is reachable on `backend.<NAMESPACE>.svc.cluster.local`. If you are sending the request from the same namespace, you can also reach it on `backend`.
We will take a look at this.

* Get your current namespace

  ```
  kubectl config view | grep namespace: 
  ```

  If there is no output, your namespace is `default`.

* List pods to copy a pod name

  ```
  kubectl get pods -l app=frontend
  ```

* We will run `curl` from one of our frontend containers to see that we can reach our backend internally on `http://backend.<NAMESPACE>.svc.cluster.local:5000`

  ```
  kubectl exec -it INSERT_FRONTEND_POD_NAME -- curl -v http://backend.<NAMESPACE>.svc.cluster.local:5000
  ```

  The HTTP status should be 200 along with the message "Hello, I'm alive"

* Run `curl` from the same container to see that we can reach our backend internally on the shortname `http://backend:5000` as well

  ```
  kubectl exec -it INSERT_FRONTEND_POD_NAME -- curl -v http://backend:5000
  ```

  The output should be the same as above. 
  
* To fix the issue where we had to delete the frontend ReplicaSet to get the internal IP for the backend Service could be avoided if we used the DNS instead. 



<a name="extratasks"></a>

## 8\. Extra tasks

<a name="differentmethodstoexposeaservice"></a>

### 1\. Different methods to expose a service
Right now we have exposed our frontend service through an ingress. We will now look into two other ways.

<a name="servicetypenodeport"></a>

#### 1\. Service type NodePort
The first way is with the service type NodePort. If we look at our frontend service, we can see that it already is defined as this type. So we are good to go then? No, not yet.

* We will change our frontend service to be a type NodePort instead. Open the file [yaml/frontend-service.yaml](.https://github.com/linemos/kubernetes-intro/blob/master/yaml/frontend-service.yaml)
* Set the `type` to be `NodePort` and save
* Apply the changes

  ```
  kubectl apply -f ./yaml/frontend-service.yaml
  ```

* Run

  ```
  kubectl get service frontend
  ```

  We see that our service doesn't have an external IP. But what it do have is two ports, port 80 and a port in the range 30000-32767. The last port was set by the Kubernetes master when we created our service. This port we will use togheter with an external IP.

* The nodes in our cluster all have external IPs per default. Lets use one of those.

  ```
  kubectl get nodes -o wide
  ```

* Copy one of the external IPs from the output above along with the node port from our service:

  ```
  curl -v <EXTERNAL_IP>:<NODE_PORT>
  ```
  
  This will output `Connection failed`. This is because we haven't opened up requests on this port. Lets create a firewall rule that allows traffic on this port:
  
* Create a firewall rule. Switch `NODE_PORT` with the node port of your service:
  
  ```
  gcloud compute firewall-rules create cv-frontend --allow tcp:NODE_PORT
  ```
  
* Try the curl command from `6` again.  
   The output should also here be "Hello, I'm alive"

* Do the same, but replace the IP with the external IP from one of the other nodes. It should have the same result

How does this work? The nodes all have external IPs, so we can curl them. By default, neither services or pods in the cluster are exposed to the internet, but Kubernetes will open the port of `NodePort` services on all the nodes so that those services are available on <NODE_IP>:<NODE_PORT>.

<a name="createaningress"></a>

#### 2\. Create an ingress
An ingress is a Kubernetes resource that will allow traffic from outside the cluster to your services. We will now create such a resource to get an external IP and allow requests to our frontend service.

* Open the file [yaml/ingress.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/ingress.yaml)
  Notice that we have defined that we have configured our ingress to send requests to our `frontend` service on port `8080`.
* Create the ingress resource:
  
  ```
  kubectl apply -f ./yaml/ingress.yaml
  ```

* Wait for an external IP to be configured

  ```
  watch kubectl get ingress cv-ingress
  ```
  
  or
  
  ```
  kubectl get ingress cv-ingress -w
  ```
  It may take a few minutes for Kubernetes Engine to allocate an external IP address and set up forwarding rules until the load balancer is ready to serve your application. In the meanwhile, you may get errors such as HTTP 404 or HTTP 500 until the load balancer configuration is propagated across the globe.

* Visit the external IP in your peferred browser to make sure you see your awezome CV online. If you get an error, the ingress and load balacing setup might not be completed.

<a name="notesonexposingyourapplication"></a>

#### 3\. Notes on exposing your application
LoadBalancer type and the Ingress resource is dependent on your cloud provider. Google Cloud Platform supports these features, but other providers might not.


<a name="healthchecks"></a>

### 2\. Health checks

Kubernetes uses health checks and readiness checks to figure out the state of the pods. If you don't define any health check, Kubernetes assumes it is <INSERT>. You can define your own.
If the health check responds with an error status code, Kubernetes will asume the container is unhealthy and kill the pod. Simliary, if the readiness check is unsuccessful, Kubernetes will asume it is not ready, and wait for it.


<a name="endpoint"></a>

### 3\. Endpoint

The first way to define a health check is to define which endpoint the check should use. Our backend application contains the endpoint `/healthz`. Go ahead and define this as the health-endpoint in the backend deployment file, under the container spec:

```
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
    httpHeaders:
    - name: X-Custom-Header
      value: Awesome
  initialDelaySeconds: 3
  periodSeconds: 3
```




