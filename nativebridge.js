export const nativebridge = function(){

    if(window.nativemainapp != undefined){
        return window.nativemainapp.nativebridge
    }

    const BRIDGE_VERSION = "0.0.0"
    const COMMANDS = {
            REQUEST_LOGIN:"login",
            REQUEST_VERSION:"version",
            TEST_CONNECTIVITY:"test",
            TEST_ERROR:"testError"
    }
    
    const LEGACY_COMMANDS = {
        WEBAPP_READY_ACTION_URL = 'ntmsg://webapp_booted',
        CLOSE_ACTION_URL = 'norsktippingmainapp://back_from_webapp',
        LOGIN_ACTION_URL = 'ntmsg://request_native_log_in'
    }
     
    const ERRORS = {
        NOT_NATIVE_CONTEXT:"The application is not running in a native context",
        NOT_NATIVE_BRIDGE:"The current application dos not support nativebridge commands"
    
    }

    let isAppNativeBridgeEnabled = (() =>{
        //TODO: HVa med android?
        return window.webkit.messageHandlers.nativebridge != undefined
    })();

    let isNativeContext = (() =>{
        //TODO: Dette er ikke riktig test for dettte, trengs å utvides. 
        return window.webkit.messageHandlers.nativebridge != undefined
    })();
   
    let createHandlerId = () => { return `h_${Date.now()}${(Math.random() + 1).toString(36).substring(4)}`};
    let handlers = {}
    let appInterface = window.webkit.messageHandlers.nativebridge;

    var appVersion = null;
    var token = null;

    const bridge =  {

        "version":BRIDGE_VERSION,

        // When the native app successfully completes a request.
        "onResponse":(handlerId, data)=>{
            let handle = handlers[handlerId];
            handle.resolve(data);
            delete handlers[handlerId];
        },
        
        // When the native app is unable for what ever reason to complete a request.
        "onError":(handlerId, err)=>{
            let handle = handlers[handlerId];
            handle.reject(new Error(err));
            delete handlers[handlerId];
        },

        "app_version":() =>{    //nativebridge only 

            if(isNativeContext){
                if(appVersion){ return appVersion} // Version number is known.
                // Se if we can get the version number from the url search string
                let params = new URLSearchParams(window.location.search)
                let version = params.has("version") ? params.get("version"):null
                if(version){
                    appVersion = version;
                    return Promise.resolve(version);
                } else if(isAppNativeBridgeEnabled){
                    //We ask the app to provide the version number
                    return new Promise((resolve,reject) =>{
                        const handle = createHandlerId()
                        handlers[handle] = {resolve, reject}
                        appInterface.postMessage(JSON.stringify({callback:handle, cmd:COMMANDS.REQUEST_VERSION}))
                    })
                }
            } 
            
            return Promise.reject(new Error(ERRORS.NOT_NATIVE_BRIDGE));
        },

        "isNativeContext": isAppNativeBridgeEnabled,


        "test":() =>{   //nativebridge only 
            if(isAppNativeBridgeEnabled){
                return new Promise((resolve,reject) =>{
                    const handle = createHandlerId()
                    handlers[handle] = {resolve, reject}
                    appInterface.postMessage(JSON.stringify({callback:handle, cmd:COMMANDS.TEST_CONNECTIVITY}))
                })
            }
            return Promise.reject(new Error(ERRORS.NOT_NATIVE_BRIDGE));
        },

        "testErr":() =>{    //nativebridge only 
            if(isAppNativeBridgeEnabled){
                return new Promise((resolve,reject) =>{
                    const handle = createHandlerId()
                    handlers[handle] = {resolve, reject}
                    appInterface.postMessage(JSON.stringify({callback:handle, cmd:COMMANDS.TEST_ERROR}))
                })
            }
            return Promise.reject(new Error(ERRORS.NOT_NATIVE_BRIDGE));
        },

        "requestLogin":() =>{

            if(isAppNativeBridgeEnabled){
                return new Promise((resolve,reject) =>{
                    const handle = createHandlerId()
                    handlers[handle] = {resolve, reject}
                    appInterface.postMessage(JSON.stringify({callback:handle, cmd:COMMANDS.LOGIN}))
                })
            } else if(isNativeContext && window){
                window.location.href = LEGACY_COMMANDS.LOGIN_ACTION_URL;
            }

            return new Promise().resolve(null)
        },

        "signalReadyState":() =>{
            if(isNativeContext && window){
                window.location.href = LEGACY_COMMANDS.WEBAPP_READY_ACTION_URL;
            }
        },

        "leaveWebApp":() => {
            if(isNativeContext && window){
                window.location.href = CLOSE_ACTION_URL
            }
        }

    }

    window.nativemainapp={nativebridge : bridge}
    return bridge

}()