var HomeView = function (adapter, homePage, listItem) {

    var homeView = this;

	this.initialize = function () {
	    // Define a div wrapper for the view. The div wrapper is used to attach events.
	    this.el = $('<div/>');
	    
	    this.el.on('click', '.add-button', this.clickAddButton);
        this.el.on('click', '.edit-button', this.clickEditButton);
        this.el.on('click', '.remove-button', this.clickRemoveButton);
        this.el.on('click', '.refresh-button', this.clickRefreshButton);
	};

	this.render = function() {
		this.el.html(homePage());
    	return this;
	};

    /* ---------------------------------- Button Listeners ---------------------------------- */

	this.clickAddButton = function() {
		var input = $('.url-input').val().toLowerCase();
        homeView.storeProductInfoFromUrl(input);
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

    this.clickRefreshButton = function() {
        homeView.refreshProductList();
    }

    /* ---------------------------------- HomeView Functions ---------------------------------- */

    /**
     * Stores product info from a given url into the list within the memory adaptor as well as the html list.
     * @param url
     * @returns {null}
     */
    this.storeProductInfoFromUrl = function(url) {
        //TODO: handle crappy urls
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            success: function(data) {
                var response = data.responseText;

                //Get correct extractor
                var extractor = homeView.getExtractor(response, url);
                console.log(extractor.getProductName());
                console.log(extractor.getProductPrice());
                console.log(extractor.getProductImageThumb());
                console.log(extractor.getProductDescription());

                //store in list within mem adapter
                adapter.addToProductList(extractor.getProductName(), extractor.getProductPrice(), extractor.getMerchantName(), extractor.getProductImageThumb(), url, extractor.getProductDescription());

                $('.product-list').html(listItem(adapter.getProducts()));                   //populate list within html
                document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";       //set the Edit button to 'edit' if its still in removal mode.
            }
        });
    }


    this.updateProductInfoFromUrl = function(url) {
        //TODO: handle crappy urls
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            success: function(data) {
                var response = data.responseText;
                //TODO: update product info within the DB
            }
        });
    }



    /**
     * Will return the appropriate extractor depending on the url.
     * @param htmlResponse
     * @param url
     * @returns {*}
     */
    this.getExtractor = function(htmlResponse, url) {
        var el = document.createElement( 'div' );
        el.innerHTML = htmlResponse;
        var merchantHandler = new MerchantHandler(url, el);
        return merchantHandler.getMerchantExtractor();
    }

    /**
     * Refreshes the product list info.
     */
    this.refreshProductList = function() {
        var productList = adapter.getProducts();
        for(var product in productList) {
           homeView.updateProductInfoFromUrl(productList[product]["productUrl"]);
        }
    }

    this.initialize();
}