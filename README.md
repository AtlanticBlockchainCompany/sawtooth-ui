# Sawtooth - UI
This repository and its respective branches are for the purpose of connecting to, and boradcasting transactions to the hyperlegder - sawtooth blockchain framework.

## Setup
This tutorial assumes that you are running a local sawtooth blockchain on your machine.

This repository was developed using node, version 8: 
```nvm use 8```

Install this repositories packages using: ```npm install```

Start the project using: ```npm start```

## Create-React-App
This project was built on the foundation of [create-react-app](https://github.com/facebook/create-react-app).

### Ejected
This project has been ejected as there was a need to create a proxy between the sawtooth rest-api and the front end posting service.

### Proxy
Viewing webpackDevServer.config.js.

```javascript
proxy = {
    '/api': {
        target: 'http://localhost:8008',
        pathRewrite: {'^/api' : ''}
    }
};
```

This proxy is necessary to avoid CORS issues between the client and the server.
