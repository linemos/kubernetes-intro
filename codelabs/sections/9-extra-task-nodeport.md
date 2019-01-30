#### Service type NodePort
Another way to expose our app is with the service type `NodePort`. If we look at our frontend service, we can see that it already is defined as this type. So we are good to go then? No, not yet.

* We will change our frontend service to be a type NodePort instead. Open the file [yaml/frontend-service.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/frontend-service.yaml)
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

#### Notes on exposing your application
The Ingress resource is dependent on your cloud provider. Google Cloud Platform supports these features, but other providers might not.
