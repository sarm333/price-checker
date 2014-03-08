// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homePage = Handlebars.compile($("#home").html());
    var productList = Handlebars.compile($("#product-list").html());
    var productPage = Handlebars.compile($("#product").html());
    var detailsURL = /^#products\//;
    var slider = new PageSlider($('body'));
    
    var adapter = new MemoryAdapter();
    
	adapter.initialize().done(function () {
        getListFromLocal();
	    route();
	});

    /* --------------------------------- Event Registration -------------------------------- */
//    $('.help-btn').on('click', function() {
//        alert("Some help here...")
//    });
    
    document.addEventListener('deviceready', function () {
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
    }, false);
    
    $(window).on('hashchange', route);
    $(document).on('ready', populateProductList);

    /* ---------------------------------- Local Functions ---------------------------------- */

    /**
     * Transitions from the HomeView to the ProductView or vice versa
     */
    function route() {
	    var hash = window.location.hash;
	    if (!hash) {
            var homeView = new HomeView(adapter, homePage, productList);
	    	slider.slidePage(homeView.render().el);
	    	populateProductList();
            homeView.refreshProductList();
	        return;
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
        //window.localStorage.clear();
        var productList = localStorage.getItem("productList");
        if(productList != null) {
            adapter.setProductList(JSON.parse(productList));
        }
    }
}());