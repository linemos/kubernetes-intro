## Extra tasks

### Different methods to expose a service
Right now we have exposed our frontend service by setting the service type to `LoadBalancer`.

#### Create an ingress
Another option would be to use an ingress.

An ingress is a resource that will allow traffic from outside the cluster to your services. We will now create such a resource to get an external IP and to allow requests to our frontend service.

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

* Visit the external IP in your preferred browser to make sure that your awesome CV is available online. If you get an error, the ingress and load balancing setup might not be completed.

#### Notes on exposing your application
The LoadBalancer type is dependent on your cloud provider. Google Cloud Platform supports these features, but other providers might not.

