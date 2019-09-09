var url = "https://www.bebongstore.com/manage_api/"
var phonegapApp = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },

  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("offline", this.onOffline, false);
  },

  onDeviceReady: function () {
    phonegapApp.chekcLogin();
  },

  // This Function For Check Logoin
  chekcLogin: function () {
    let userDetaiils = localStorage.getItem("bebongUserLogin")
    if (userDetaiils == null) {
      app.loginScreen.open("#my-login-screen");
    }
    else {
      // This Section For Push Notification Code
      phonegapApp.homePageData()
      FCMPlugin.getToken(function (token) {
        alert(token);
        $.ajax({
          type: "post",
          url: url + "updatePushToken",
          data: { token: token, userPhone: localStorage.getItem("bebongUser") },
          dataType: "json",
          beforeSend: function () {
            app.preloader.show('multi')
          }
        }).done(rply => {
          app.preloader.hide()
        });
      });
    }
  },

  // This Section For Forgot Password Link
  opneForgotPasswordModal: function () {
    app.loginScreen.close("#my-login-screen");
    app.loginScreen.open("#my-forgot-password-screen");
  },

  // This Function For Toogle Register Modal
  toogleRegister: function (switech) {
    if (switech === 1) {
      app.loginScreen.close("#my-login-screen");
      app.loginScreen.open("#register-screen");
    }
    else {
      app.loginScreen.open("#my-login-screen");
      app.loginScreen.close("#register-screen");
    }
  },

  // On Device Offline
  onOffline: function () {
    app.loginScreen.close("#my-login-screen");
    app.loginScreen.close("#my-forgot-password-screen");
    app.loginScreen.open("#no-internet");
    app.preloader.hide();
  },

  // This Function For Register User
  handelRegister: function () {
    $.ajax({
      type: "post",
      url: url + "register",
      data: {
        fullName: $('#txtFullName').val(),
        email: $('#txtEmailAddress').val(),
        mobile: $('#txtMobileNumber').val(),
        address: $('#txtShippingAddress').val(),
        pin: $('#txtPincode').val(),
        addressType: $('#ddlAddressType').val(),
        password: $('#txtRegisterPassword').val(),
      },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi');
      }
    }).done(rply => {
      app.preloader.hide();
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      if (!rply.status) {
        return
      }
      else {
        localStorage.setItem("bebongUserLogin", 1);
        localStorage.setItem("bebongUser", $('#txtMobileNumber').val());
        mainView.app.popup.close("#register-screen")
      }
    });
  },


  // This Function For Handel Login
  handelLogin: function () {
    let userName = $('#txtMobileLogin').val();
    let password = $('#txtPassword').val();

    $.ajax({
      type: "post",
      url: url + "userAuthentication",
      data: { mobile: userName, password: password },
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

      if (!rply.status) {
        return
      }

      localStorage.setItem("bebongUserLogin", 1);
      localStorage.setItem("bebongUser", $('#txtMobileNumber').val());
      mainView.app.loginScreen.close()
    });
  },


  handelForgotPassword: function () {
    let email = $('#txtForgotEmail').val();

    $.ajax({
      type: "post",
      url: url + "forgotPassword",
      data: { txtForgotEmail: email },
      dataType: "json",
      beforeSend: function () {
        app.preloader.hide()
      }
    }).done(rply => {
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()

      if (!rply.status) {
        return
      }
    });
  },

  // This Function For Get App Home Page Data
  homePageData: function () {
    $.ajax({
      type: "post",
      url: url + "homePageData",
      data: {},
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()

      // This Section For Bind Data
      let slider = ''
      for (list in rply.category) {
        slider += `<div class="swiper-slide text-align-center">
                    <a href="/product-listing/${rply.category[list].cat_id}/" class="color-black"><img src="
                    https://www.bebongstore.com/uploads/maincategory/${rply.category[list].cat_image}" style="width:100%;"><br><span style="font-weight:900;">${rply.category[list].cat_name}</span>
                    </a>
                  </div>`
      }
      $('#categorySlider').html(slider);

      // This Section For Bind Offer Data
      let offerdata = ''
      for(list in rply.offer){
        offerdata += `<div class="block" style="margin:10px 0px 0px 0px;">
                        <a href="#"><img src="https://www.bebongstore.com/uploads/offer/${rply.offer[list].offer_image}" style="width:100%;"></a>
                      </div>`
      }
      $('#homeoffer').html(offerdata);


      // This Section For New Arivals
      let newArival = ''
      for(list in rply.newArrival){
        newArival += `<div class="swiper-slide text-align-center">
        <img src="https://www.bebongstore.com/uploads/product/${rply.newArrival[list].gallery_image}" style="width:100%;">
        <br>
        <span style="font-weight:900;">${rply.newArrival[list].name}<br>Rs. ${rply.newArrival[list].discounted_price}&nbsp;&nbsp;<span
            style="text-decoration:line-through; color:#999999; font-size:12px;">Rs. ${rply.newArrival[list].price}</span></span>
        <br>
        <div class="row">
          <div class="col-50">
            <a href="/product-details/${rply.newArrival[list].product_id}" class="button  button-outline button-small color-red">
              View Details
            </a>
          </div>
          <div class="col-50">
            <a href="/product-details/${rply.newArrival[list].product_id}" class="button  button-outline button-small color-red">
              Add to Cart
            </a>
          </div>
        </div>
      </div>`
      }

      $('#homepageNewArivals').html(newArival);

      // This Section For Bebong Exclusive
      let bebongExclusive = ''
      for(list in rply.exclusive){
        bebongExclusive += `<div class="swiper-slide text-align-center">
        <img src="https://www.bebongstore.com/uploads/product/${rply.exclusive[list].gallery_image}" style="width:100%;">
        <br>
        <span style="font-weight:900;">${rply.exclusive[list].name}<br>Rs. ${rply.exclusive[list].discounted_price}&nbsp;&nbsp;<span
            style="text-decoration:line-through; color:#999999; font-size:12px;">Rs. ${rply.exclusive[list].price}</span></span>
        <br>
        <div class="row">
          <div class="col-50">
            <a href="/product-details/${rply.exclusive[list].product_id}" class="button  button-outline button-small color-red">
              View Details
            </a>
          </div>
          <div class="col-50">
            <a href="/product-details/${rply.exclusive[list].product_id}" class="button  button-outline button-small color-red">
              Add to Cart
            </a>
          </div>
        </div>
      </div>`
      }
      $('#bebongExclusive').html(bebongExclusive);
    });
  }

};