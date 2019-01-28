## Docker containers
To create a deployment on Kubernetes, you need to specify at least one container for your application.
Kubernetes will on a deploy pull the image specified and create pods with this container.
Docker is the most commonly used container in Kubernetes.

In this repository you will find code for both applications in the backend and frontend directories.
Each of these folders also have their own Dockerfile.
Take a look at the docker files too see how they are built up:
  - [frontend/Dockerfile](../../frontend/Dockerfile)
  - [backend/Dockerfile](../../backend/Dockerfile)
  
Notice the `.dockerignore` files as well.
This file tells the Docker daemon which files and directories to ignore, for example the `node_modules` directory.

We could create the Docker images locally from our computer by building it with the docker deamon,
but we are going to explore build triggers in Google Cloud Platform instead.

### Build triggers
1. Go to cloud console: find **Cloud Build** in the left side menu (under tools).
If you are asked to enable the Container Build API, do so.
2. Click *Create trigger*
3. Choose Github as build source. Click *Continue*
4. Select your fork as the repository and click *Continue*
5. Now its time to specify the build trigger:
    - *Name*: Backend trigger
    - *Trigger type*: `Tag`
    -  Set tag to `cv-backend-.*`
    - Leave *Included files filter (glob)* and *Ignored files filter (glob)* empty
    - *Build Configuration*: Dockerfile
    - *Dockerfile directory*: Point to the backend Dockerfile in `backend/`
    - *Dockerfile name*: `Dockerfile`
    - *Image name*: `gcr.io/$PROJECT_ID/backend:$TAG_NAME`
   
6. Click *Create trigger*

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