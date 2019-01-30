## Rolling updates
As you read earlier, Kubernetes can update your application without down time with a rolling-update strategy. 
You will now update the background color of the frontend application, see that the build trigger creates a new image and
update the deployment to use this in your web application.

1. Open the file [frontend/src/index.css](https://github.com/linemos/kubernetes-intro/blob/master/frontend/src/index.css) and edit the field `background-color` to your favourite color
2. Commit your changes
3. Create a *cv-frontend-2* tag like we did earlier (or a later tag version if this tag is already used). 
4. Go back to the cloud console in your browser and make sure that the build trigger finishes successfully
5. Update the image specification on the file [yaml/frontend-deployment.yaml](https://github.com/linemos/kubernetes-intro/blob/master/yaml/frontend-deployment.yaml) by adding the tag `:2`
6. Open a new terminal window to watch the deletion and creation of Pods:
      ```
      watch kubectl get pods
      ```
      If you don't have `watch` installed, you can use this command instead:
    
      ```
      kubectl get pods -w
      ```
      Don't close this window.

7. In the other terminal window, apply the updated Deployment specification
      ```
      kubectl apply -f ./yaml/frontend-deployment.yaml
      ```

Watch how the Pods are terminated and created in the other terminal window.
Notice that there are always at least one Pod running and that the last of the old Pods are first terminated when on of the new ones has the status running.
