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
      FCMPlugin.getToken(function (token) {
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
      localStorage.setItem("bebongUser", userName);
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
                    <img src="
                    https://www.bebongstore.com/uploads/maincategory/${rply.category[list].cat_image}" style="width:100%;"><br><span style="font-weight:900;"><a href="/product-listing/${rply.category[list].cat_id}/" class="color-black">${rply.category[list].cat_name}</span>
                    </a>
                  </div>`
      }
      $('#categorySlider').html(slider);

      // This Section For Bind Offer Data
      let offerdata = ''
      for (list in rply.offer) {
        offerdata += `<div class="block" style="margin:10px 0px 0px 0px;">
                        <a href="#"><img src="https://www.bebongstore.com/uploads/offer/${rply.offer[list].offer_image}" style="width:100%;"></a>
                      </div>`
      }
      $('#homeoffer').html(offerdata);


      // This Section For New Arivals
      let newArival = ''
      for (list in rply.newArrival) {
        newArival += `<div class="swiper-slide text-align-center">
        <img src="https://www.bebongstore.com/uploads/product/${rply.newArrival[list].gallery_image}" style="width:100%;">
        <br>
        <span style="font-weight:900;">${rply.newArrival[list].name}<br>Rs. ${rply.newArrival[list].discounted_price}&nbsp;&nbsp;<span
            style="text-decoration:line-through; color:#999999; font-size:12px;">Rs. ${rply.newArrival[list].price}</span></span>
        <br>
        <div class="row">
          <div class="col-50">
            <a href="/product-details/${rply.newArrival[list].product_id}/" class="button  button-outline button-small color-red">
              View Details
            </a>
          </div>
          <div class="col-50">
            <a href="/product-details/${rply.newArrival[list].product_id}/" class="button  button-outline button-small color-red">
              Add to Cart
            </a>
          </div>
        </div>
      </div>`
      }

      $('#homepageNewArivals').html(newArival);

      // This Section For Bebong Exclusive
      let bebongExclusive = ''
      for (list in rply.exclusive) {
        bebongExclusive += `<div class="swiper-slide text-align-center">
        <img src="https://www.bebongstore.com/uploads/product/${rply.exclusive[list].gallery_image}" style="width:100%;">
        <br>
        <span style="font-weight:900;">${rply.exclusive[list].name}<br>Rs. ${rply.exclusive[list].discounted_price}&nbsp;&nbsp;<span
            style="text-decoration:line-through; color:#999999; font-size:12px;">Rs. ${rply.exclusive[list].price}</span></span>
        <br>
        <div class="row">
          <div class="col-50">
            <a href="/product-details/${rply.exclusive[list].product_id}/" class="button  button-outline button-small color-red">
              View Details
            </a>
          </div>
          <div class="col-50">
            <a href="/product-details/${rply.exclusive[list].product_id}/" class="button  button-outline button-small color-red">
              Add to Cart
            </a>
          </div>
        </div>
      </div>`
      }
      $('#bebongExclusive').html(bebongExclusive);
      setTimeout(function () {
        var swiper = app.swiper.create('.swiper-container', {
          speed: 1200,
          spaceBetween: 10,
          autoplay: true,
        });
      }, 3000);
    });
  },

  // This Function For Category Product Items
  categoryProducts: function (categoryId) {
    $.ajax({
      type: "post",
      url: url + "categoryProduct",
      data: { categoryId: categoryId },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      $('#lblProductCount').html(rply.productCount);
      if (rply.product.length > 0) {
        $('#productMsg').hide();

        let productList = ''
        for (list in rply.product) {
          productList += `<div class="col-50">
          <a href="/product-details/${rply.product[list].product_id}/" class="color-black"
            ><img
              src="https://www.bebongstore.com/bebong2019/uploads/product/${rply.product[list].gallery_image}"
              style="width:100%; border-radius:4px;"
            /><br />
            <span style="font-size:12px;">${rply.product[list].name}</span><br />
            <p style="font-size:12px; font-weight:900; margin-top: -2px;">
              Rs. ${rply.product[list].discounted_price}&nbsp;&nbsp;<span
                style="text-decoration:line-through; color:#999999; font-size:12px;"
                >Rs. ${rply.product[list].price}</span
              >
            </p></a>
        </div>`
        }
        $('#productsList').html(productList);
        $('#lblCategoryName').html(rply.categoryDetails.cat_name);
        $('#txtcategoryId').val(rply.categoryDetails.cat_id);

        let size = ''
        for (list in rply.sizeLists) {
          size += `<li>
            <label class="item-checkbox item-content">
              <input type="checkbox" name="size[]" value="${rply.sizeLists[list].attribute_details_id}" />
              <i class="icon icon-checkbox"></i>
              <div class="item-inner">
                <div class="item-title">${rply.sizeLists[list].attribute_detail}</div>
              </div>
            </label>
          </li>`
        }
        $('#sizeList').html(size);

        let color = ''
        for (list in rply.colorList) {
          color += `<li>
            <label class="item-checkbox item-content">
              <input type="checkbox" name="color[]" value="${rply.colorList[list].attribute_details_id}" />
              <i class="icon icon-checkbox"></i>
              <div class="item-inner">
                <div class="item-title">${rply.colorList[list].attribute_detail}</div>
              </div>
            </label>
          </li>`
        }
        $('#colorList').html(color);

        // $('.price-value').html(`Rs.0 - Rs.${rply.maxPrice.price}`);
        // $('#price-filter').attr({'data-max' : `${rply.maxPrice.price}`, 'data-value-right' : `${rply.maxPrice.price}`});


        return
      }
      else {
        $('#productMsg').html(`No Product Found`);
      }
      app.preloader.hide()
    });
  },

  // This Function For Apply Filter Category
  categoryFilter: function () {
    let categoryId = $('#txtcategoryId').val();

    // Get All Color Element
    let color = []
    $.each($("input[name='color[]']:checked"), function () {
      color.push($(this).val());
    });

    // Get All Size
    let size = []
    $.each($("input[name='size[]']:checked"), function () {
      size.push($(this).val());
    });


    $.ajax({
      type: "post",
      url: url + "applyFilterCaterory",
      data: { cat_id: categoryId, color: color, size: size },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('milti')
      }
    }).done(rply => {
      let productList = ''
      for (list in rply.product) {
        productList += `<div class="col-50">
        <a href="/product-details/${rply.product[list].product_id}/" class="color-black"
          ><img
            src="https://www.bebongstore.com/bebong2019/uploads/product/${rply.product[list].gallery_image}"
            style="width:100%; border-radius:4px;"
          /><br />
          <span style="font-size:12px;">${rply.product[list].name}</span><br />
          <p style="font-size:12px; font-weight:900; margin-top: -2px;">
            Rs. ${rply.product[list].discounted_price}&nbsp;&nbsp;<span
              style="text-decoration:line-through; color:#999999; font-size:12px;"
              >Rs. ${rply.product[list].price}</span
            >
          </p></a>
      </div>`
      }
      $('#productsList').html(productList);
      $('#lblProductCount').html(rply.product.length);
      mainView.app.popup.close("#my-popup2")
      app.preloader.hide()
    });
  },


  // thos Section For Product Details
  productDeatils: function (productId) {
    $.ajax({
      type: "post",
      url: url + "productDetails",
      data: { productId: productId },
      dataType: "json",
      beforeSend: function (response) {
        app.preloader.show()
      }
    }).done(rply => {
      console.log(rply)
      let sizeList = ''
      sizeList += `<option value="#" selected disabled="disabled">Tap Here</option>`
      for (list in rply.sizeLists) {
        sizeList += `<option value="${rply.sizeLists[list].attribute_details_id}">${rply.sizeLists[list].attribute_detail}</option>`
      }
      $('#dvProductImage').attr('src', `https://www.bebongstore.com/uploads/product/${rply.product.gallery_image}`);
      $('#dvProductName').html(rply.product.name);
      $('#dvFinalPrice').html(rply.product.discounted_price);
      $('#dvPrice').html(rply.product.price);
      $('#ddlSizeCart').html(sizeList);
      $('#dvProductCategory').html(rply.caregoryName.cat_name);
      $('#dvProductColor').html(rply.colorDetails.attribute_detail);
      $('#dvProductSKU').html(rply.product.skucode);
      // $(selector).attr(attributeName, value);

      $('#linkShare').attr('onclick', `window.plugins.socialsharing.share('Bebong, ${rply.product.name}, https://www.bebongstore.com/product/${rply.product.seo_name}/${rply.product.product_id}', '${rply.product.name}', 'https://www.bebongstore.com/uploads/product/${rply.product.gallery_image}', 'https://www.bebongstore.com/product/${rply.product.seo_name}/${rply.product.product_id}')`);

      $('#ddlSizeCart').attr('onchange', `phonegapApp.getProductStock(${rply.product.product_id})`);
      $('#btnAddCart').attr('onclick', `phonegapApp.addToCart(${rply.product.product_id})`);

      app.preloader.hide()
    });
  },

  // This Function For Get Product Stock
  getProductStock: function (productId) {

    let size = $('#ddlSizeCart').val();
    $.ajax({
      type: "post",
      url: url + "getProductStock",
      data: { productId: productId, size: size },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show()
      }
    }).done(rply => {
      app.preloader.hide()
      let currentStock = parseInt(rply.currentStock)

      if (currentStock < 1) {
        var stepper = app.stepper.create({
          el: '.stepper'
        })
        // $('#dvProductStock').html('<span class="badge color-red">No Stock Available</span>');
        let toastLargeMessage = app.toast.create({
          text: 'No Stock Available Right Now',
          closeTimeout: 2000,
        });
        stepper.setValue(0)
        stepper.destroy()
        toastLargeMessage.open()
      }
      else {
        var stepper = app.stepper.create({
          el: '.stepper'
        })
        if (currentStock > 9) {
          stepper.setValue(1)
          stepper.max = 9
        }
        else {
          stepper.setValue(1)
          stepper.max = currentStock
        }
      }
    });
  },


  //This Function For Add Item To The Cart
  addToCart : function(productId){
    let productSize = $('#ddlSizeCart').val();
    console.log(productSize)
    if(productSize === null){
      let toastLargeMessage = app.toast.create({
        text: 'Please select size',
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      return;
    }
    var stepper = app.stepper.create({
      el: '.stepper'
    })

    $.ajax({
      type: "post",
      url: url + "addToCart",
      data: {productSize:productSize,productId : productId, qty : stepper.value, userPhone : localStorage.getItem('bebongUser')},
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply=>{
      app.preloader.hide()
      console.log(rply)
      if(!rply.status){
        let toastLargeMessage = app.toast.create({
          text: 'No Stock Available Right Now',
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
      }
      else{
        let toastLargeMessage = app.toast.create({
          text: 'Item Added To Cart Successfully',
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
      }
    });
    
  },

  // This Function For Get Cart Items 
  getCartItems : function(){
    $.ajax({
      type: "post",
      url: url + "cartItems",
      data: {userPhone : localStorage.getItem('bebongUser')},
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply=>{
      app.preloader.hide()
      console.log(rply)
    });
  },

};