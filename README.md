# Nativebridge

Standardises communication between native apps (android and ios) and web applications.

## Install

```
$ npm install git+https://github.com/agensdev/nativebridge.git

// if you need ssh

$ npm install ssh+https://github.com/agensdev/nativebridge.git
```

## Usage

```js
import {nativebridge as nb} from './nativebridge.js'

const exitButton = document.createElement("Button");
const loginButton = document.createElement("Button");

loginButton.onclick= async function(e){
    let token = await nb.requestLogin()
}

exitButton.onclick = function(e){
    nb.leaveWebApp()
}

document.body.appendChild(loginButton)
document.body.appendChild(exitButton)

nb.signalReadyState()

```
