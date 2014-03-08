var HomeView = function (adapter, homePage, listItem) {

    var homeView = this;

	this.initialize = function () {
	    // Define a div wrapper for the view. The div wrapper is used to attach events.
	    this.el = $('<div/>');
	    
	    this.el.on('click', '.add-button', this.clickAddButton);
        this.el.on('click', '.edit-button', this.clickEditButton);
        this.el.on('click', '.remove-button', this.clickRemoveButton);
        this.el.on('click', '.refresh-button', this.refreshProductList);
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

                homeView.extractProductInfo(response, input);

                $('.product-list').html(listItem(adapter.getProducts()));
                document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
		    }
		});
	}

    this.extractProductInfo = function(htmlResponse, url) {
        var extractor = this.handleUrl(htmlResponse, url);
        console.log(extractor.getProductName());
        console.log(extractor.getProductPrice());
        console.log(extractor.getProductImageThumb());
        console.log(extractor.getProductDescription());

        adapter.addToProductList(extractor.getProductName(), extractor.getProductPrice(), extractor.getMerchantName(), extractor.getProductImageThumb(), url, extractor.getProductDescription());
    }

    this.handleUrl = function(htmlResponse, url) {
        var el = document.createElement( 'div' );
        el.innerHTML = htmlResponse;
        var merchantHandler = new MerchantHandler(url, el);
        return merchantHandler.getMerchantExtractor();
    }

    this.clickEditButton = function() {
        $( ".removal" ).toggle("slow");
        if(this.innerHTML == "Edit" && adapter.getProducts().length != 0) {
            this.innerHTML = "Done";
        } else {
            this.innerHTML = "Edit";
        }
    }

    this.clickRemoveButton = function() {
        var productId = this.parentNode.parentNode.childNodes[1].hash.replace("#products/", "");
        adapter.removeProductFromList(productId);
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        if(adapter.getProducts().length == 0) {
            document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
        }
    }

    this.refreshProductList = function() {

    }

    this.initialize();
}