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
                        <a href="/offer-listing/${rply.offer[list].id}/"><img src="https://www.bebongstore.com/uploads/offer/${rply.offer[list].offer_image}" style="width:100%;"></a>
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
  addToCart: function (productId) {
    let productSize = $('#ddlSizeCart').val();
    console.log(productSize)
    if (productSize === null) {
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
      data: { productSize: productSize, productId: productId, qty: stepper.value, userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      console.log(rply)
      if (!rply.status) {
        let toastLargeMessage = app.toast.create({
          text: 'No Stock Available Right Now',
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
      }
      else {
        let toastLargeMessage = app.toast.create({
          text: 'Item Added To Cart Successfully',
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
      }
    });

  },

  // This Function For Get Cart Items 
  getCartItems: function () {
    $.ajax({
      type: "post",
      url: url + "cartItems",
      data: { userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      console.log(rply)
      if (!rply.status) {
        $('#cartPageContent').html(`<div class="block"><img src ="img/bebong-empty-cart.gif" width="100%"></div>`);
        return;
      }
      let itemList = ``
      for (list in rply.cartItems) {
        itemList += `<div class="row" style="margin-bottom:12px;">
        <div class="col-25">
          <img src="https://www.bebongstore.com/uploads/product/${rply.cartItems[list].gallery_image}" width="100%;" />
        </div>
        <div class="col-55">
          <p style="text-transform:uppercase; font-size:12px; font-weight:900; margin-top: 0px; margin-bottom: 0px;">${rply.cartItems[list].name}</p>
          <p style="font-size:12px; margin-top: -2px; margin-bottom: 0px;">Size : ${rply.cartItems[list].attribute_detail}</p>
          <div class="stepper stepper-small stepper-outline stepper-init color-black" style="height: 24px;">
            <div class="stepper-button-minus" style="width: 26px;" onclick="swipperminus('${rply.cartItems[list].product_id}', '${rply.cartItems[list].attribute_id}')"></div>
            <div class="stepper-input-wrap">
              <input type="text" id="product-${rply.cartItems[list].product_id}-${rply.cartItems[list].attribute_id}" value="${rply.cartItems[list].quantity}" min="0" max="9" step="1" readonly style="width: 30px; color: #ff3b30;">
            </div>
            <div class="stepper-button-plus" style="width: 26px;" onclick="swipperadd('${rply.cartItems[list].product_id}', '${rply.cartItems[list].attribute_id}')"></div>
          </div>
          <p style="font-size:12px; margin-top: -2px; margin-bottom: 0px; font-weight:900;">Rs.
          ${rply.cartItems[list].discounted_price}&nbsp;&nbsp;<span style="text-decoration:line-through; color:#999999; font-size:12px;">Rs.
          ${rply.cartItems[list].price}</span></p>
        </div>
        <div class="col-20"><a class="link text-color-pink" onclick="phonegapApp.deleteCartItem('${rply.cartItems[list].product_id}', '${rply.cartItems[list].attribute_id}')"><i class="icon f7-icons">trash_fill</i></a></div>
      </div>`
      }
      $('#cartProducts').html(itemList);
      $('#lblGrandTotal').html(rply.cart_amount);
      $('#lblDiscount').html(rply.cart_coupon_amount);
      $('#lblDeliveryCharge').html(rply.cart_delivery_amount);
      $('#lblNetTotal').html(rply.grand_total);

      let couponCode = ''
      for (list in rply.offers) {

        couponCode += `<li>
        <label class="item-radio item-content">`
        if (rply.offers[list].id == rply.offerId) {
          couponCode += `<input type="radio" name="demo-radio" class="cuponCheck" value="coupon1" onclick="phonegapApp.applyCouponCode(${rply.offers[list].id})" checked />
          <i class="icon icon-radio cuponCheck-icon" checked></i>`
        }
        else {
          couponCode += `<input type="radio" name="demo-radio" class="cuponCheck" value="coupon1" onclick="phonegapApp.applyCouponCode(${rply.offers[list].id})" />
          <i class="icon icon-radio cuponCheck-icon"></i>`
        }
        couponCode += `<div class="item-inner">
            <div class="item-title" style="border: 1px #666 dashed; padding: 0px 10px;width: 100%;">${rply.offers[list].offer_name}<p
                style="font-size:10px; margin-bottom:2px; margin-top:2px;">${rply.offers[list].description}</p>
            </div>
          </div>
        </label>
      </li>`
      }
      $('#lblCouponList').html(couponCode);
    });
  },


  // This Section For Get User Details
  userDetails: function () {
    let userPhone = localStorage.getItem('bebongUser')

    $.ajax({
      type: "post",
      url: url + "getUserInfo",
      data: { userPhone: userPhone },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      $('#lblCustomerName').html(rply.userDetails.customer_name);
      $('#lblCustomerPhone').html(rply.userDetails.customer_mobile);
      $('#lblCustomerEmail').html(rply.userDetails.customer_email);

      let addressList = ''
      for (list in rply.userAddress) {
        addressList += `<div class="block block-strong" style="margin-top:0px; margin-bottom:0px; padding: 6px 15px; font-size:12px;"><strong>${rply.userAddress[list].address_type}</strong> : ${rply.userAddress[list].houseNo} ${rply.userAddress[list].localArea}  ${rply.userAddress[list].address}, ${rply.userAddress[list].landmark} Pincode - ${rply.userAddress[list].pincode}</div>`
      }
      $('#listAddress').html(addressList);

      let currentOrderList = ''

      for (list in rply.currentOrderDetailsAndItems) {
        currentOrderList += `<li class="accordion-item"><a href="#" class="item-content item-link">
                              <div class="item-inner">
                                <div class="item-title  text-color-green">
                                  Order Id : <span>${rply.currentOrderDetailsAndItems[list].order_no}</span> / <span>${rply.currentOrderDetailsAndItems[list].payment_method}</span>
                                </div>
                              </div>
                            </a>
                            <div class="accordion-item-content">`
        for (item in rply.currentOrderDetailsAndItems[list].orderDetails) {
          currentOrderList += `<div class="block">
                                <p>Order Date : <span>${rply.currentOrderDetailsAndItems[list].order_date}</span></p>
                                <p>Ordered Item : <span>${rply.currentOrderDetailsAndItems[list].orderDetails[item].name}</span> | Size :<span> ${rply.currentOrderDetailsAndItems[list].orderDetails[item].attribute_detail}</span></p>
                                <p>Price : Rs. <span>${rply.currentOrderDetailsAndItems[list].orderDetails[item].price}</span></p>
                              </div><hr>`

        }

        currentOrderList += `<div class="block"><a class="link color-red" onclick="phonegapApp.openCancelRequest(${rply.currentOrderDetailsAndItems[list].order_id})">Cancel</a></div>
                            </div>
                          </li>`
      }
      $('#currentOrder').html(currentOrderList);

      let previousOrderList = ''

      for (list in rply.previousOrederDetailsAndItems) {
        previousOrderList += `<li class="accordion-item"><a href="#" class="item-content item-link">
                              <div class="item-inner">`
        if (rply.previousOrederDetailsAndItems[list].order_status == 5) {
          previousOrderList += `<div class="item-title text-color-red">`
        }
        else {
          previousOrderList += `<div class="item-title text-color-green">`
        }
        previousOrderList += ` Order Id : <span>${rply.previousOrederDetailsAndItems[list].order_no}</span> / <span>${rply.previousOrederDetailsAndItems[list].payment_method}</span>
                                </div>
                              </div>
                            </a>
                            <div class="accordion-item-content">`
        for (item in rply.previousOrederDetailsAndItems[list].orderDetails) {
          previousOrderList += `<div class="block">
                                <p>Order Date : <span>${rply.previousOrederDetailsAndItems[list].order_date}</span></p>
                                <p>Ordered Item : <span>${rply.previousOrederDetailsAndItems[list].orderDetails[item].name}</span> | Size :<span> ${rply.previousOrederDetailsAndItems[list].orderDetails[item].attribute_detail}</span></p>
                                <p>Price : Rs. <span>${rply.previousOrederDetailsAndItems[list].orderDetails[item].price}</span></p>
                              </div><hr>`

        }

        previousOrderList += `</div> </li>`
      }
      $('#previousOrder').html(previousOrderList);
      // 
    });


  },

  // This Section For Logout
  logout: function () {
    localStorage.clear()
    window.location.href = "index.html"
  },

  // This section for Add New Address
  handelAddNewAddress: function (type = 'user') {
    let houseNo = $('#txtAddressHouseNo').val();
    let shippingAddress = $('#txtAddressShipping').val();
    let locality = $('#txtAddressLocality').val();
    let landMark = $('#txtAddressLandMark').val();
    let pincode = $('#txtAddressPincode').val();
    let addressType = $('#ddlTypeAddress').val();

    if (addressType === "" || shippingAddress === "" || pincode === "") {
      let toastLargeMessage = app.toast.create({
        text: 'Address Type, Shipping Address and Pincode are amandetory fields',
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      return
    }

    $.ajax({
      type: "post",
      url: url + "insertAddress",
      data: { houseNo: houseNo, shippingAddress: shippingAddress, locality: locality, landMark: landMark, pincode: pincode, addressType: addressType, userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      if (rply.status) {
        let toastLargeMessage = app.toast.create({
          text: 'Address added successfully',
          closeTimeout: 2000,
        });
        toastLargeMessage.open()
        if (type == 'user') {
          phonegapApp.userDetails()
        }
        app.popup.close(".address-popup")
      }
    });
  },

  // This Section For Open Cancel Module
  openCancelRequest: function (orderId) {
    app.actions.create({
      buttons: [
        {
          text: 'Size mismatch',
          onClick: function () {
            $.ajax({
              type: "post",
              url: url + "cancelOrder",
              data: { orderId: orderId, reason: 'Size mismatch' },
              dataType: "json"
            }).done(rply => {
              let toastLargeMessage = app.toast.create({
                text: 'Order canceled successfully',
                closeTimeout: 2000,
              });
              toastLargeMessage.open()
              phonegapApp.userDetails()
            });
          }
        },
        {
          text: 'Colour mismatch',
          onClick: function () {
            $.ajax({
              type: "post",
              url: url + "cancelOrder",
              data: { orderId: orderId, reason: 'Size mismatch' },
              dataType: "json"
            }).done(rply => {
              let toastLargeMessage = app.toast.create({
                text: 'Order canceled successfully',
                closeTimeout: 2000,
              });
              toastLargeMessage.open()
              phonegapApp.userDetails()
            });
          }
        },
        {
          text: 'I changed my mind',
          onClick: function () {
            $.ajax({
              type: "post",
              url: url + "cancelOrder",
              data: { orderId: orderId, reason: 'Size mismatch' },
              dataType: "json"
            }).done(rply => {
              let toastLargeMessage = app.toast.create({
                text: 'I changed my mind',
                closeTimeout: 2000,
              });
              toastLargeMessage.open()
              phonegapApp.userDetails()
            });
          }
        },
        {
          text: 'Cancel',
          color: 'red'
        },
      ]
    }).open()

  },

  // This Function For Delete Cart Item
  deleteCartItem: function (productId, attributeId) {
    if (confirm('are you sure to delete this product?')) {
      $.ajax({
        type: "post",
        url: url + "deleteCartItem",
        data: { productId: productId, attributeId: attributeId, userPhone: localStorage.getItem('bebongUser') },
        dataType: "json"
      }).done(rply => {
        phonegapApp.getCartItems()
      });
    }

  },
  // This Section For Apply Coupon Code
  applyCouponCode: function (couponId) {
    $.ajax({
      type: "post",
      url: url + "applyCouponCode",
      data: { couponId: couponId, userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show();
      }
    }).done(rply => {
      app.preloader.hide();
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      phonegapApp.getCartItems()
    });
  },

  // This Section For Open Address Section
  openAddressModal: function () {
    $.ajax({
      type: "post",
      url: url + "getAddressList",
      data: { userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      console.log(rply)
      let address = ''
      for (list in rply.addressList) {
        address += `<li>
          <label class="item-radio item-content">
            <input type="radio" name="redio-select-checkout-address" class="checkout-address" value="${rply.addressList[list].cust_detail_id}" />
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">${rply.addressList[list].address_type}</div>
              </div>
              <div class="item-subtitle">${rply.addressList[list].houseNo} ${rply.addressList[list].localArea} ${rply.addressList[list].address}</div>
              <div class="item-text">Pincode -  ${rply.addressList[list].pincode}</div>
            </div>
          </label>  
        </li>`

      }
      $('#checkoutAddressList').html(address);
      app.popup.open('.checkout-address-popup')
    });
  },

  // This Section For Open Create Modal Section
  openManageAddressModal: function () {
    app.popup.close('.checkout-address-popup')
    app.popup.open('.address-popup')
  },

  // This Function For Continue Order
  openPaymentGatewayModal: function () {
    // let selectedAddress = $('.checkout-address').val();
    let selectedAddress = $("input[name='redio-select-checkout-address']:checked").val();
    if (selectedAddress == undefined) {
      let toastLargeMessage = app.toast.create({
        text: `Select Address First`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      return
    }

    // Check Coupon Applyed Or Not
    $.ajax({
      type: "post",
      url: url + "checkCouponStatus",
      data: { userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      app.preloader.hide()
      console.log(rply)
      let paymentList = ''
      if (rply.status == "1") {
        paymentList = `<li>
          <label class="item-radio item-content">
            <input type="radio" name="redio-select-payment-option" class="checkout-address" value="1" checked />
            <i class="icon icon-radio" checked></i>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">Online</div>
              </div>
            </div>
          </label>  
        </li>`
      }
      else {
        paymentList = `<li>
          <label class="item-radio item-content">
            <input type="radio" name="redio-select-payment-option" class="checkout-address" value="1" checked />
            <i class="icon icon-radio" checked></i>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">Online</div>
              </div>
            </div>
          </label>  
        </li><li>
        <label class="item-radio item-content">
          <input type="radio" name="redio-select-payment-option" class="checkout-address" value="2" />
          <i class="icon icon-radio"></i>
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title">Cash On Delivery</div>
            </div>
          </div>
        </label>  
      </li>`
      }
      $('#paymentOptionList').html(paymentList);
      $("#btnCheckout").html(`Pay Online | ${rply.cart_total}`)
      app.popup.open('.checkout-payment-option-popup')
    });
  },

  // This Function For Get Final Amount
  getFinalAmount: function () {
    let paymentMode = $("input[name='redio-select-payment-option']:checked").val();
    $.ajax({
      type: "post",
      url: url + "getFinalAmount",
      data: { userPhone: localStorage.getItem('bebongUser'), paymentMode: paymentMode },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show('multi')
      }
    }).done(rply => {
      console.log(rply)
      if(paymentMode == 1){
        $("#btnCheckout").html(`Pay Online | ${rply.cart_total}`)
      }
      else{
        $("#btnCheckout").html(`Cash On Delivery | ${rply.cart_total}`)
      }
      
      app.preloader.hide()
    });
  },

  // This Section For Payment Option
  sendPayment: function () {
    let selectedAddress = $("input[name='redio-select-checkout-address']:checked").val();
    let paymentMode = $("input[name='redio-select-payment-option']:checked").val();

    // If paymentMode == 1 Then This is a online order else This is a Cash On Delivery Order

    $.ajax({
      type: "post",
      url: url + "confirmOrder",
      data: { address: selectedAddress, paymentMode: paymentMode, userPhone: localStorage.getItem('bebongUser') },
      dataType: "json",
      beforeSend: function () {
        app.preloader.show("multi")
      }
    }).done(rply => {
      app.preloader.hide()
      console.log(rply)
      if (rply.pMode == "ONLINE") {
        let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');

        ref.addEventListener('loadstop', function (event) {
          let urlSuccessPage = "https://bebongstore.com/manage_api/OnlineSuccessPay";
          let urlErrorPage = "https://bebongstore.com/manage_api/OnlineFailurePay";
          if (event.url == urlSuccessPage) {
            ref.close()
            phonegapApp.getCartItems()
            app.dialog.alert('Order Placed Successfully')
            app.popup.open('.success-order-popup')
            // cartView.router.navigate('/payment-success/' + rply.oid + '/');

          }
          else if (event.url == urlErrorPage) {
            ref.close()
            phonegapApp.getCartItems()
            app.dialog.alert('Payment Not Done')
            app.popup.open('.cancel-order-popup')
          }
        });
      }
      else{
        phonegapApp.getCartItems()
        app.dialog.alert('Order Placed Successfully')
        app.popup.open('.success-order-popup')
      }
    });
  },
  
  // This Function For Gte Offer Items
  OfferProducts : function(offerId){
    $.ajax({
      type: "post",
      url: url + "offerProduct",
      data: {offerId : offerId},
      dataType: "json",
      beforeSend: function () {
        app.preloader.show()
      }
    }).done(rply => {
      $('#lblProductCount').html(rply.productCount);
      if (rply.product.length > 0) {
        $('#productMsgOffer').hide();

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
        $('#productsListOffer').html(productList);
        $('#lblOfferName').html(rply.categoryDetails.description);
        $('#txtOfferId').val(rply.categoryDetails.id);

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
  }


};

function swipperminus(productId, attributeId) {
  let curretn_value = $('#product-' + productId + "-" + attributeId).val();
  if (curretn_value != 1) {
    curretn_value = parseInt(curretn_value) - 1;
  }
  else {
    curretn_value = 1
  }

  $.ajax({
    type: "post",
    url: url + "addToCart",
    data: { productSize: attributeId, productId: productId, qty: curretn_value, userPhone: localStorage.getItem('bebongUser') },
    dataType: "json",
    beforeSend: function () {
      app.preloader.show("multi")
    }
  }).done(rply => {
    app.preloader.hide()
    if (rply.status) {
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      $('#product-' + productId + "-" + attributeId).val(curretn_value);
      phonegapApp.getCartItems()
    }
    else {
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
    }

  });

}

function swipperadd(productId, attributeId) {

  let curretn_value = $('#product-' + productId + "-" + attributeId).val();
  curretn_value = parseInt(curretn_value) + 1;


  $.ajax({
    type: "post",
    url: url + "addToCart",
    data: { productSize: attributeId, productId: productId, qty: curretn_value, userPhone: localStorage.getItem('bebongUser') },
    dataType: "json",
    beforeSend: function () {
      app.preloader.show("multi")
    }
  }).done(rply => {
    app.preloader.hide()
    if (rply.status) {
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
      $('#product-' + productId + "-" + attributeId).val(curretn_value);
      phonegapApp.getCartItems()
    }
    else {
      let toastLargeMessage = app.toast.create({
        text: `${rply.msg}`,
        closeTimeout: 2000,
      });
      toastLargeMessage.open()
    }

  });
}