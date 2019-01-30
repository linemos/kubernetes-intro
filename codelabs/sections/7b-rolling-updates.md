## Rolling updates
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

