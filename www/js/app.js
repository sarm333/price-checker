// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homePage = Handlebars.compile($("#home").html());
    var productList = Handlebars.compile($("#product-list").html());
    var productPage = Handlebars.compile($("#product").html());
    var detailsURL = /^#products\//;
    var slider = new PageSlider($('body'));
    var adapter = new MemoryAdapter();
    var homeView = new HomeView(adapter, homePage, productList);
    
	adapter.initialize().done(function () {
        getListFromLocal();
	    var homeView = route();
        if(!window.location.hash) {
            homeView.refreshProductList();
        }
	});

    /* --------------------------------- Event Registration -------------------------------- */
//    $('.help-btn').on('click', function() {
//        alert("Some help here...")
//    });
    
    document.addEventListener('deviceready', deviceReadyMethod, false);
    document.addEventListener("pause", appToBackgroundMethod, false);

    $(window).on('hashchange', route);
    $(document).on('ready', populateProductList);

    /* ---------------------------------- Local Functions ---------------------------------- */

    function deviceReadyMethod() {
        FastClick.attach(document.body);
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Alert", // title
                    'OK'        // buttonName
                );
            };
        }
        document.addEventListener("pause", onPause, false);
        initPushwoosh();
        var backgroundMode = window.plugin.BackgroundMode;
        backgroundMode.enable();
    }

    function appToBackgroundMethod() {
        var now                  = new Date().getTime(),
            _10_seconds_from_now = new Date(now + 10*1000);

        window.plugin.notification.local.add({
            id:      1, // is converted to a string
            title:   'Alert yo!',
            message: 'Local push rocks!',
            repeat:  'weekly',
            date:    _10_seconds_from_now
        });
    }

    /**
     * Transitions from the HomeView to the ProductView or vice versa
     */
    function route() {
	    var hash = window.location.hash;
	    if (!hash) {
            homeView = new HomeView(adapter, homePage, productList);
	    	slider.slidePage(homeView.render().el);
	    	populateProductList();
	        return homeView;
	    }
	    var match = hash.match(detailsURL);
        var id = hash.replace("#products/", "");
	    if (match) {
	        adapter.findById(id).done(function(productListItem) {
	        	slider.slidePage(new ProductView(adapter, productPage, productListItem).render().el);
	        });
	    }
	}

	function populateProductList() {
		$('.product-list').html(productList(adapter.getProducts()));
	}

    function getListFromLocal() {
        var productList = localStorage.getItem("productList");
        if(productList != null) {
            adapter.setProductList(JSON.parse(productList));
        }
    }

    /**
     * Initialise the pushwoosh push services
     */
    function initPushwoosh() {
        var pushNotification = window.plugins.pushNotification;
        pushNotification.onDeviceReady();
        pushNotification.registerDevice({alert:true, badge:true, sound:true, pw_appid:"F2065-451A7", appname:"Tell Me!"},
            function(status) {
                var deviceToken = status['deviceToken'];
                console.warn('registerDevice: ' + deviceToken);
            },
            function(status) {
                console.warn('failed to register : ' + JSON.stringify(status));
                navigator.notification.alert(JSON.stringify(['failed to register ', status]));
            }
        );

        pushNotification.setApplicationIconBadgeNumber(0);
        document.addEventListener('push-notification', function(event) {
            var notification = event.notification;
            navigator.notification.alert(notification.aps.alert);
            pushNotification.setApplicationIconBadgeNumber(0);
        });
    }
}());