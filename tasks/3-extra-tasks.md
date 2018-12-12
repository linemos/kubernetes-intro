# Extra tasks

### Different methods to expose a service
Right now we have exposed our frontend service through an ingress. We will now look into two other ways.

#### Service type NodePort
The first way is with the service type NodePort. If we look at our frontend service, we can see that it already is defined as this type. So we are good to go then? No, not yet.

1. We will change our frontend service to be a type NodePort instead. Open the file [yaml/frontend-service.yaml](../yaml/frontend-service.yaml)
2. Set the `type` to be `NodePort` and save
3. Apply the changes

  ```
  kubectl apply -f ./yaml/frontend-service.yaml
  ```

4. Run

  ```
  kubectl get service frontend
  ```

  We see that our service doesn't have an external IP. But what it do have is two ports, port 80 and a port in the range 30000-32767. The last port was set by the Kubernetes master when we created our service. This port we will use togheter with an external IP.

5. The nodes in our cluster all have external IPs per default. Lets use one of those.

  ```
  kubectl get nodes -o wide
  ```

6. Copy one of the external IPs from the output above along with the node port from our service:

  ```
  curl -v <EXTERNAL_IP>:<NODE_PORT>
  ```
  
  This will output `Connection failed`. This is because we haven't opened up requests on this port. Lets create a firewall rule that allows traffic on this port:
  
7. Create a firewall rule. Switch `NODE_PORT` with the node port of your service:
  
  ```
  gcloud compute firewall-rules create cv-frontend --allow tcp:NODE_PORT
  ```
  
8. Try the curl command from `6` again.  
   The output should also here be "Hello, I'm alive"

9. Do the same, but replace the IP with the external IP from one of the other nodes. It should have the same result

How does this work? The nodes all have external IPs, so we can curl them. By default, neither services or pods in the cluster are exposed to the internet, but Kubernetes will open the port of `NodePort` services on all the nodes so that those services are available on <NODE_IP>:<NODE_PORT>.

#### Create an ingress
An ingress is a Kubernetes resource that will allow traffic from outside the cluster to your services. We will now create such a resource to get an external IP and allow requests to our frontend service.

1. Open the file [yaml/ingress.yaml](../yaml/ingress.yaml)
  Notice that we have defined that we have configured our ingress to send requests to our `frontend` service on port `8080`.
2. Create the ingress resource:
  
  ```
  kubectl apply -f ./yaml/ingress.yaml
  ```

3. Wait for an external IP to be configured

  ```
  watch kubectl get ingress cv-ingress
  ```
  
  or
  
  ```
  kubectl get ingress cv-ingress -w
  ```
  It may take a few minutes for Kubernetes Engine to allocate an external IP address and set up forwarding rules until the load balancer is ready to serve your application. In the meanwhile, you may get errors such as HTTP 404 or HTTP 500 until the load balancer configuration is propagated across the globe.

4. Visit the external IP in your peferred browser to make sure you see your awezome CV online. If you get an error, the ingress and load balacing setup might not be completed.

#### Notes on exposing your application
LoadBalancer type and the Ingress resource is dependent on your cloud provider. Google Cloud Platform supports these features, but other providers might not.


## Health checks

Kubernetes uses health checks and readiness checks to figure out the state of the pods. If you don't define any health check, Kubernetes assumes it is <INSERT>. You can define your own.
If the health check responds with an error status code, Kubernetes will asume the container is unhealthy and kill the pod. Simliary, if the readiness check is unsuccessful, Kubernetes will asume it is not ready, and wait for it.


### Endpoint

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

## Next

Clean up all your clusters and accounts to make sure you don't have to pay for any use: 
 [Delete your cluster and clean up](./4-delete-tasks.md).

