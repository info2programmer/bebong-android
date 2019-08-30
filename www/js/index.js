var phonegapApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
  
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.onOffline, false);
    },
    
    onDeviceReady: function() {
      phonegapApp.chekcLogin();
    },

    // This Function For Check Logoin
    chekcLogin : function(){
      let userDetaiils = localStorage.getItem("userId")
      if(userDetaiils == null){
        app.loginScreen.open("#my-login-screen");
      }
    },

    // This Section For Forgot Password Link
    opneForgotPasswordModal : function(){
      app.loginScreen.close("#my-login-screen");
      app.loginScreen.open("#my-forgot-password-screen");
    },

    // This Function For Toogle Register Modal
    toogleRegister : function(switech){
      if(switech === 1){
        app.loginScreen.close("#my-login-screen");
        app.loginScreen.open("#register-screen");
      }
      else{
        app.loginScreen.open("#my-login-screen");
        app.loginScreen.close("#register-screen");
      }
    },

    // On Device Offline
    onOffline: function() {
      app.loginScreen.close("#my-login-screen");
      app.loginScreen.close("#my-forgot-password-screen");
      app.loginScreen.open("#no-internet");
      app.preloader.hide();
    },
    
};
