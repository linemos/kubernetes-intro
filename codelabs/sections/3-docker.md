## Docker containers
To create a deployment on Kubernetes, you need to specify at least one container for your application.
Kubernetes will on a deploy pull the image specified and create pods with this container.
Docker is the most commonly used container service in Kubernetes.

In this repository you will find code for both applications in the backend and frontend directories.
Each of these folders also have their own Dockerfile.
Take a look at the docker files too see how they are built up:
  - [frontend/Dockerfile](https://github.com/linemos/kubernetes-intro/blob/master/frontend/Dockerfile)
  - [backend/Dockerfile](https://github.com/linemos/kubernetes-intro/blob/master/backend/Dockerfile)
  
Notice the `.dockerignore` files inside both the [frontend directory](https://github.com/linemos/kubernetes-intro/tree/master/frontend) and the [backend directory](https://github.com/linemos/kubernetes-intro/tree/master/backend) as well.
This file tells the Docker daemon which files and directories to ignore, for example the `node_modules` directory.

One way to create Docker images is to manually create ands build images on your own computer with the Docker daemon. Instead, we are going to automatically build images by using build triggers in Google Cloud Platform.

### Build triggers
1. Go to cloud console: find **Cloud Build** in the left side menu (under tools). 
If you are asked to enable the Container Build API, do so.
_Tips: If you have problems finding the Google Cloud functionality you are looking for, try searching for it instead_ 😊
2. Choose _Triggers_ in the left-side menu. 
3. Click *Create trigger*
4. Choose Github as build source. Click *Continue*
You will have to authenticate Github with Google Cloud Platform. This lets Google Cloud Platform listen to changes in your code so that it can start building new Docker images when you have pushed new code. 
5. Select the fork as the repository and click *Continue*
6. Now its time to add the specifications for the build trigger:
    - *Name*: Backend trigger
    - *Trigger type*: `Tag`.
    - Set tag to `cv-backend-.*`
    - Leave *Included files filter (glob)* and *Ignored files filter (glob)* empty
    - *Build Configuration*: Dockerfile
    - *Dockerfile directory*: Point to the backend Dockerfile in `backend/`
    - *Dockerfile name*: `Dockerfile`
    - *Image name*: `gcr.io/$PROJECT_ID/backend:$TAG_NAME`
   
7. Click *Create trigger*

Now, do the same thing for the frontend application.
Name it `Frontend trigger`, set tag to `cv-frontend-.*`, set the directory to be `/frontend/` and
set the Docker image to be `gcr.io/$PROJECT_ID/frontend:$TAG_NAME`.

This sets up a build trigger that listens to new commits on the master branch of your repository.
If the commit is tagged with `cv-frontend-1`, it will use the Dockerfile in the frontend directory to create a new Docker image.

7. Click on the small menu on the trigger and select *Run trigger* to test it
8. Once it is finished building, you can find the image under the *Builder Images* in the menu point.

### Test the build trigger
You tried to run the build trigger manually in the previous step.
Now you will test how it works on new commits on your GitHub repository.