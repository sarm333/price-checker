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
        this.el.on('click', '#remove-all-button', this.clickRemoveAllButton);
	};

	this.render = function() {
		this.el.html(homePage());
    	return this;
	};

    /* ---------------------------------- Button Listeners ---------------------------------- */

    this.clickRemoveAllButton = function() {
        adapter.removeAllProducts();
        $( ".product-list")[0].innerHTML = "";
        document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
        $( "#remove-all-button").hide("fast");
    }

	this.clickAddButton = function() {
		var input = $('.url-input').val().toLowerCase();
        homeView.storeProductInfoFromUrl(input);
        document.getElementsByClassName("url-input")[0].value = "";
	}

    this.clickEditButton = function() {
        //$( ".removal" ).toggle("fast");
        if(this.innerHTML == "Edit" && adapter.getProducts().length != 0) {
            this.innerHTML = "Done";
            $( "#remove-all-button").show("fast");
/*            $(".remove-button").each(function () {
                var style = "translate3d(0,0,0)";
                this.style.top = ((this.offsetHeight - this.offsetHeight) / 2) + "px";
                this.style.opacity = 1;
                this.style.transform = style;
                this.style.webkitTransform = style;
                this.style.mozTransform = style;
                this.style.oTransform = style;
            });*/
        } else {
            this.innerHTML = "Edit";
            $( "#remove-all-button").hide("fast");
/*            $(".remove-button").each(function () {
                var style = "translate3d(20px,0,0)";
                this.style.opacity = 0;
                this.style.transform = style;
                this.style.webkitTransform = style;
                this.style.mozTransform = style;
                this.style.oTransform = style;
            });*/
        }
    }

    this.clickRemoveButton = function() {
        var productId = this.parentNode.parentNode.childNodes[1].hash.replace("#products/", "");
        adapter.removeProductFromList(productId);
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        if(adapter.getProducts().length == 0) {
            document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
            $( "#remove-all-button").hide("fast");
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
                    $( "#remove-all-button").hide("fast");
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
            timeout: 3000,
            async: false,
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
                var currentdate = new Date();
                document.getElementById("last-updated-text").innerHTML = currentdate.getHours() + ":" + currentdate.getMinutes();
                $( "#remove-all-button").hide("fast");
            },
            error: function (request, type, thrownError) {
                var message = "There was an error with the url" + product["productUrl"] + ".\n";
                switch (type) {
                    case 'timeout':
                        message += "The request timed out.";
                        break;
                    case 'notmodified':
                        message += "The request was not modified but was not retrieved from the cache.";
                        break;
                    case 'parsererror':
                        message += "XML/Json format is bad.";
                        break;
                    default:
                        message += "HTTP Error (" + request.status + " " + request.statusText + ").";
                }
                message += "\n";
                alert("Failed to retrieve product from '" + product["productUrl"] + "'");
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
        $.when.apply($, requests).always(homeView.hideLoadSpinner);
    }

    this.populateProductList = function(productList) {
        $('.product-list').html(productList(adapter.getProducts()));
    }

    this.initialize();
}