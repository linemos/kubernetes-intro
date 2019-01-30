## Create services
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

### Exposing your app
Ok, so now what? With the previous command, we saw that we had two services, one for our frontend and one for our backend. But they both had internal IPs, no external. We want to be able to browse our application from our browser.
Let's look at another way. The Service resource can have a different type, it can be set as a LoadBalancer.

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

 