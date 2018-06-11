# Extra tasks

### Different methods to expose a service
Right now we have exposed our frontend service through an ingress. We will now look into two other ways.

#### Service type NodePort
The first way is with the service type NodePort. If we look at our frontend service, we can see that it already is defined as this type. So we are good to go then? No, not yet.

1. Run

```
kubectl get service frontend
```

We see that our service doesn't have an external IP. But what it do have is two ports, port 80 and a port in the range 30000-32767. The last port was set by the Kubernetes master when we created our service. This port we will use togheter with an external IP.
2. The nodes in our cluster all have external IPs per default. Lets use one of those.

```
kubectl get nodes
```

3. Copy one of the external IPs from the output above along with the node port from our service:

```
curl -v <EXTERNAL_IP>:<NODE_PORT>
```

The output should also here be "Hello, I'm alive"
4. Do the same, but replace the IP with the external IP from one of the other nodes. It should have the same result

How does this work? The 

#### Service type LoadBalancer
Lets look at another way. The Service resource can have a different type, it can be set as a LoadBalancer.

1. Edit the service:

```
kubectl edit service frontend
```

This will open your default editor.
2. Set `type` to be `LoadBalancer`
3. Save and exit
4. Wait for an external IP:

```
watch kubectl get service frontend
```

5. Curl to get the "Hello, I'm alive" response:

```
curl -v <EXTERNAL_IP>
```

#### Notes on exposing your application
All these methods to expose your application by getting an external IP is dependent on the cloud provider you run on. G
