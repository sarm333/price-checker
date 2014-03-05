var HomeView = function (adapter, homePage, listItem) {

	this.initialize = function () {
	    // Define a div wrapper for the view. The div wrapper is used to attach events.
	    this.el = $('<div/>');
	    
	    this.el.on('click', '.add-button', this.clickAddButton);
	};

	this.render = function() {
		this.el.html(homePage());
    	return this;
	};
	
//	this.findByName = function() {
//    	adapter.findByName($('.search-key').val()).done(function (products) {
//            $('.product-list').html(listItem(products));
//        });
//    }

	this.clickAddButton = function() {
		//TODO: handle crappy urls
		var input = $('.url-input').val().toLowerCase();

		$.ajax({
		    url: input,
		    type: 'GET',
		    dataType: 'xml',
		    success: function(data) {
		        var response = data.responseText;
		        var el = document.createElement( 'div' );
		        el.innerHTML = response;
		        var extractor = new RiverIslandExtractor(el);
		        console.log(extractor.getProductName());
		        console.log(extractor.getProductPrice());
                console.log(extractor.getProductImageThumb());
                console.log(extractor.getProductDescription());
                adapter.addToProductList(extractor.getProductName(), extractor.getProductPrice(), "River Island", extractor.getProductImageThumb(), input, extractor.getProductDescription);
                $('.product-list').html(listItem(adapter.getProducts()));
		    }
		});
	}

    this.initialize();
}