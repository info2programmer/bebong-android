var phonegapApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
  
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
    opneForgotPasswordModal : function(param){
      if(param){
        app.loginScreen.close("#my-login-screen");
        app.loginScreen.open("#my-forgot-password-screen");
      }
      else{

      }
    }
};
