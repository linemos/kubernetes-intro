# Frontend application

This is the frontend of our CV application. The code is based on [Create React App](https://github.com/facebookincubator/create-react-app). 

**About the frontend**
 
In addition of [react](https://facebook.github.io/react/) we have added: 
 - [Redux](http://redux.js.org/): State controlling of the application 
 - [React bootstrap](https://react-bootstrap.github.io/components.html#page-layout): Used for simple boostrap styling
 
The application is served through an express server in the cloud. 

## Run the application 

**In the cloud**

When deploying our application to the cloud, we need to know the address of our backend application. 
This can be found through environment variables. 


**Locally** 

If you want to run the code local you need to start the backend first. 
To start the backend, follow the instructions [here](./../backend/README.md). 

After you have followed the instructions, open the terminal and navigate to this folder, i.e., `cd /frontend`.

Install all packages from npm: 

```
npm i 
```

Run the application: 

```
npm start
```
Open your browser and enter the url `localhost:3000`.

## Debugging

If you want to debug the state of your application, you can install [Redux DevTools for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).

