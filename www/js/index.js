var url = "https://www.bebongstore.com/manage_api/"
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
      let userDetaiils = localStorage.getItem("bebongUserLogin")
      if(userDetaiils == null){
        app.loginScreen.open("#my-login-screen");
      }
      else{
        // This Section For Push Notification Code
        FCMPlugin.getToken(function(token){
          alert(token);
          $.ajax({
            type: "post",
            url: url + "updatePushToken",
            data: {token : token, userPhone : localStorage.getItem("bebongUser")},
            dataType: "json",
            beforeSend: function () {
              app.preloader.show('multi')
            }
          }).done(rply=>{
            app.preloader.hide()
          });
        });
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

    // This Function For Register User
    handelRegister : function () {
      $.ajax({
        type: "post",
        url: url + "register",
        data: {
          fullName : $('#txtFullName').val(),
          email : $('#txtEmailAddress').val(),
          mobile : $('#txtMobileNumber').val(),
          address :  $('#txtShippingAddress').val(),
          pin :  $('#txtPincode').val(),
          addressType :  $('#ddlAddressType').val(),
          password : $('#txtRegisterPassword').val(),
        },
        dataType: "json",
        beforeSend: function () {
          app.preloader.show('multi');   
        }
      }).done(rply=>{
        app.preloader.hide();  
        let toastLargeMessage = app.toast.create({
          text: `${rply.msg}`,
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
        if(!rply.status){
          return
        }
        else{
          localStorage.setItem("bebongUserLogin",1);
          localStorage.setItem("bebongUser",$('#txtMobileNumber').val());
          mainView.app.popup.close("#register-screen")
        }
      });
    },


    // This Function For Handel Login
    handelLogin : function(){
      let userName = $('#txtMobileLogin').val();
      let password = $('#txtPassword').val();

      $.ajax({
        type: "post",
        url: url + "userAuthentication",
        data: {mobile : userName, password : password},
        dataType: "json",
        beforeSend: function () {
          app.preloader.show('multi')
        }
      }).done(rply => {
        app.preloader.hide();

        let toastLargeMessage = app.toast.create({
          text: `${rply.msg}`,
          closeTimeout: 2000,
        });
        toastLargeMessage.open()

        if(!rply.status){
          return
        }

        localStorage.setItem("bebongUserLogin",1);
        localStorage.setItem("bebongUser",$('#txtMobileNumber').val());
        mainView.app.loginScreen.close()
      });
    },


    handelForgotPassword : function(){
      let email = $('#txtForgotEmail').val();

      $.ajax({
        type: "post",
        url: url + "forgotPassword",
        data: {txtForgotEmail : email},
        dataType: "json",
        beforeSend: function () {
          app.preloader.hide()
        }
      }).done(rply=>{
        let toastLargeMessage = app.toast.create({
          text: `${rply.msg}`,
          closeTimeout: 2000,
        });
        toastLargeMessage.open()

        if(!rply.status){
          return
        }
      });
    }
    
};