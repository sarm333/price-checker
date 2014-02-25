// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homePage = Handlebars.compile($("#home").html());
    var productList = Handlebars.compile($("#product-list").html());
    var productPage = Handlebars.compile($("#product").html());
    var detailsURL = /^#employees\/(\d{1,})/;
    var slider = new PageSlider($('body'));
    
    var adapter = new MemoryAdapter();
    
	adapter.initialize().done(function () {
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
		            "Workshop", // title
		            'OK'        // buttonName
		        );
		    };
		}
    }, false);
    
    $(window).on('hashchange', route);


    /* ---------------------------------- Local Functions ---------------------------------- */

    /**
     * Transitions from the HomeView to the ProductView
     */
    function route() {
	    var hash = window.location.hash;
	    if (!hash) {
	    	slider.slidePage(new HomeView(adapter, homePage, productList).render().el);
	        return;
	    }
	    var match = hash.match(detailsURL);
	    if (match) {
	        adapter.findById(Number(match[1])).done(function(productListItem) {
	        	slider.slidePage(new ProductView(adapter, productPage, productListItem).render().el);
	        });
	    }
	}
}());