var HomeView = function (adapter, homePage, listItem) {

    var homeView = this;
    var requests = [];

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
        $( ".removal" ).toggle("fast");
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

    this.hideLoadSpinner = function() {
        if(isMobile) {
            ActivityIndicator.hide();
        }
    }

    this.showLoadSpinner = function(message) {
        if(isMobile) {
            ActivityIndicator.show(message);
        }
    }

    /**
     * Stores product info from a given url into the list within the memory adaptor as well as the html list.
     * @param url
     */
    this.storeProductInfoFromUrl = function(url) {
        //TODO: handle crappy urls
        this.showLoadSpinner("Adding...");
        url = url.replace("//m.", "//www.");
        $.ajax({
            url: url,
            type: 'GET',
            timeout: 8000,
            dataType: 'xml',
            success: function(data) {
                var response = data.responseText;
                //Get correct extractor
                console.log(response);
                var extractor = homeView.getExtractor(response, url);
                /*console.log(extractor.getProductName());
                console.log(extractor.getProductPrice());
                console.log(extractor.getProductImageThumb());
                console.log(extractor.getProductDescription());*/
                if(extractor == false) {
                    alert("Not a supported URL");
                } else {
                    //store in list within mem adapter
                    adapter.addToProductList(extractor.getProductName(), extractor.getProductPrice(), extractor.getMerchantName(), extractor.getProductImageThumb(), url, extractor.getProductDescription());

                    homeView.populateProductList(listItem);
                    document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";       //set the Edit button to 'edit' if its still in removal mode.
                }
                homeView.hideLoadSpinner();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                homeView.hideLoadSpinner();
                alert("Failed to retrieve product from '" + url + "'");
            }
        });
    }


    this.getAjaxProductUpdateObj = function(product) {
        //TODO: handle crappy urls
        return $.ajax({
            url: product["productUrl"],
            type: 'GET',
            timeout: 8000,
            dataType: 'xml',
            success: function(data) {
                var response = data.responseText;

                //Get correct extractor
                var newProduct = homeView.getExtractor(response, product["productUrl"]);
                /*console.log(newProduct.getProductName());
                console.log(newProduct.getProductPrice());
                console.log(newProduct.getProductImageThumb());
                console.log(newProduct.getProductDescription());
                console.log();*/
                //Store new details
                adapter.updateExistingProductInfo(product["id"], newProduct.getProductPrice(), newProduct.getProductImageThumb());
                homeView.populateProductList(listItem);
                document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
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
        var merchantHandler = new MerchantHandler(url, htmlResponse);
        return merchantHandler.getMerchantExtractor();
    }

    /**
     * Refreshes the product list info.
     */
    this.refreshProductList = function() {
        homeView.showLoadSpinner("Refreshing List...");
        var productList = adapter.getProducts();
        for(var product in productList) {
            requests.push(homeView.getAjaxProductUpdateObj(productList[product]));
        }
        $.when.apply(undefined, requests).then(homeView.hideLoadSpinner, homeView.hideLoadSpinner);
    }

    this.populateProductList = function(productList) {
        $('.product-list').html(productList(adapter.getProducts()));
    }

    this.initialize();
}