# About frontend

This is the frontend of our CV application. The code is based on [Create React App](https://github.com/facebookincubator/create-react-app). 


#### About the frontend: 
Our frontend is made of:
 - [React](https://facebook.github.io/react/)
 - [Redux](http://redux.js.org/)
 - [React bootstrap](https://react-bootstrap.github.io/components.html#page-layout): used for simple styling
 
 

## Run in the cloud
When deploying our application to the cloud, we need to know the address of our backend application. 
This can be found through environment variables. 


## Run locally 
When running our code locally, we can go to this folder (`cd /frontend`) and type `npm i ` and `npm start`.
This will install all dependencies and start the development server.  

Under development, we connect the frontend to the backend through *proxy* inside *package.json*.
Since our backend runs on port 5000, we have *localhost:5000* inside our package.json. 
