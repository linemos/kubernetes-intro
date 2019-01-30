
### Health checks

Kubernetes is using health checks and readiness checks to figure out the state of the pods.
If the health check responds with an error status code, Kubernetes will asume the container is unhealthy and kill the pod. Simliary, if the readiness check is unsuccessful, Kubernetes will asume it is not ready, and wait for it.
You can define your own.

### Endpoint

The first way to define a health check is to define which endpoint the check should use. Our backend application contains the endpoint `/healthz`. Go ahead and define this as the health-endpoint in the backend deployment file, under backend container in the list `spec.containers`:

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

When applying the new deployment file, run `kubectl get pods` to see that that the deployment has created a new Pod. Describe it to see the new specification.

### Command

We can also specify a command to execute in the container. Lets do this for the frontend application:

```
livenessProbe:
  exec:
    command:
    - ls
    - /
  initialDelaySeconds: 5
  periodSeconds: 5  
```


The command can be any command available in the container. The commands available in your container depends on the base image and how you build your image.
E.g. if your container has `curl` installed, we could define that the probe is to curl the `/healtz` endpoint from the container. This wouldn't make much sence, though...

