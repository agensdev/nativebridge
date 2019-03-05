export const nativebridge = function(){

    window.mainapp.nativebridge = this;
    
    const VERSION = "0.0.0"
    const WEBAPP_READY_ACTION_URL = 'ntmsg://webapp_booted'
    const CLOSE_ACTION_URL = 'norsktippingmainapp://back_from_webapp'
    const LOGIN_ACTION_URL = 'ntmsg://request_native_log_in'

    let isNativeContext = (() =>{
        //This function will eventually tell us if the native app is available.
        return true
    })();
   

    return {

        "version":VERSION,

        "isNativeContext": isNativeContext,

        "requestLogin":() =>{
            if(isNativeContext && window){
                window.location.href = LOGIN_ACTION_URL;
            }
        },

        "signalReadyState":() =>{
            if(isNativeContext && window){
                window.location.href = WEBAPP_READY_ACTION_URL;
            }
        },

        "leaveWebApp":() => {
            if(isNativeContext && window){
                window.location.href = CLOSE_ACTION_URL;
            }
        }

    }

}()