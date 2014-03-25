var HomeView = function (adapter, homePage, listItem) {

    var homeView = this;
    var $queue = [];
    var totalNumOfProducts = 0;

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
        $( ".removal" ).toggle("fast");
        if(this.innerHTML == "Edit" && adapter.getProducts().length != 0) {
            this.innerHTML = "Done";
            $( "#remove-all-button").show("fast");
        } else {
            this.innerHTML = "Edit";
            $( "#remove-all-button").hide("fast");
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


    this.getAjaxProductUpdateObj = function(func, product, delay) {
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

                //Store new details
                adapter.updateExistingProductInfo(product["id"], newProduct.getProductPrice(), newProduct.getProductImageThumb());
                homeView.populateProductList(listItem);
                document.getElementsByClassName("edit-button")[0].innerHTML = "Edit";
                $( "#remove-all-button").hide("fast");
                func(data); // run callback
                window.setTimeout(function () {
                    runQueue(func, delay); // run the next in queue, if any
                }, delay);

            },
            error: function (request, type, thrownError) {
                var message = "There was an error with the item " + product["productName"] + ".\n";
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
                alert(message);
                func(); // run callback
                window.setTimeout(function () {
                    runQueue(func, delay); // carry on running the next url in queue
                }, delay);
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
     * Refreshes the product list info. First creates an array of products and then chucks them into a queue
     * to be used to fetch the update via an ajax call in the given order.
     */
    this.refreshProductList = function() {
        document.getElementsByClassName("refresh-button")[0].disabled = true;
        var requests = [];
        var productList = adapter.getProducts();
        for(var product in productList) {
            requests.push(productList[product]);
        }
        //$.when.apply($, requests).always(homeView.refreshDone);
        totalNumOfProducts = requests.length;
        runQueue(250, handleRefreshFinish, requests);
    }

    /**
     * Checks to see if the queue has finished, if it has then stop the spinner.
     */
    function handleRefreshFinish() {
        document.getElementById("update-progress").innerHTML = "Updating...";
        if ($queue.length != 0) {
            document.getElementById("update-progress").innerHTML = "Updating " + (totalNumOfProducts - $queue.length) + " of " + totalNumOfProducts + " items";
        } else {
            var currentDate = new Date();
            var minutes;
            if(currentDate.getMinutes() < 10) {
                minutes = "0" + currentDate.getMinutes();
            } else {
                minutes = currentDate.getMinutes();
            }
            adapter.setLastRefreshTime(currentDate.getHours() + ":" + minutes);
            document.getElementById("last-updated-text-page-one").innerHTML = adapter.getLastRefreshTime();
            document.getElementById("update-progress").innerHTML = "Updating " + (totalNumOfProducts - $queue.length) + " of " + totalNumOfProducts + " items";
            window.setTimeout(function() {
                document.getElementById("update-progress").innerHTML = "";
            }, 250);
            document.getElementsByClassName("refresh-button")[0].disabled = false;
        }
    }

    /**
     *
     */
    function runQueue() {
        var i, func = null, delay = 0, arg;

        for (i = 0; i < arguments.length; i += 1) {
            arg = arguments[i];
            if ( Array.isArray(arg) ) $queue = $queue.concat(arg);
            else if (typeof arg === 'function') func = arg;
            else if (typeof arg === 'number' && arg > 0) delay = Math.floor(arg);
        }

        if ($queue.length === 0) { return; }
        if (func === null) func = function () {};
        homeView.getAjaxProductUpdateObj(func, $queue.shift(), delay); // run an ajax request with the first product in the queue, then remove it from the queue
    }

    this.populateProductList = function(productList) {
        $('.product-list').html(productList(adapter.getProducts()));
    }

    this.initialize();
}