var MemoryAdapter = function() {

    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        var deferred = $.Deferred();
        var product = null;
        var l = products.length;
        for (var i=0; i < l; i++) {
            if (products[i].id === id) {
            	product = products[i];
                break;
            }
        }
        deferred.resolve(product);
        return deferred.promise();
    }

    this.findByName = function(searchKey) {
        var deferred = $.Deferred();
        var results = products.filter(function(element) {
            var productName = element.productName;
            return productName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        deferred.resolve(results);
        return deferred.promise();
    }
    
    this.getProducts = function() {
    	return products;
    }

    this.isItemAlreadyInList = function(newId) {
        for(var product in products) {
            if(newId == products[product]["id"]) {
                return true;
            }
        }
        return false;
    }

    this.removeProductFromList = function(productId) {
        for(var product in products) {
            if(productId == products[product]["id"]) {
                products.splice(product, 1);
                break;
            }
        }
        this.storeLocally();
    }

    this.addToProductList = function(productName, currPrice, merchantName, imageUrl, productUrl, description) {
        var id = merchantName + "_" + productName;
        id = id.replace(/ /gi, "_").toLowerCase();
        if(this.isItemAlreadyInList(id)) {
            alert("Item is already in your shopping list!");
        } else {
            var currentPrice;
            var previousPrice;
            if(currPrice.indexOf("|") != -1) {
                var split = currPrice.split("|");
                currentPrice = split[0];
                previousPrice = split[1];
            } else {
                currentPrice = currPrice;
            }
            products.push(this.getProductEntryWithSalePrice(id, productName, currentPrice, previousPrice, merchantName, imageUrl, productUrl, description));
        }
        this.storeLocally();
    }

    this.updateExistingProductInfo = function(productId, updatedPrice, updatedImageUrl, updatedDescription) {
        for(var product in products) {
            if(productId == products[product]["id"]) {
                products[product]["imageUrl"] = updatedImageUrl;
                products[product]["description"] = updatedDescription;

                if(updatedPrice.indexOf("|") != -1) {
                    updatedPrice = updatedPrice.split("|")[0];
                }

                console.log("New Price: " + this.stringToNumber(updatedPrice));
                console.log("Old Price: " + this.stringToNumber(products[product]["currentPrice"]));
                if(this.stringToNumber(updatedPrice) != this.stringToNumber(products[product]["currentPrice"])) {
                    products[product]["previousPrice"] = products[product]["currentPrice"];
                    products[product]["currentPrice"] = updatedPrice;
                    if(isMobile) {
                        window.plugin.notification.local.add({
                            id: productId,
                            title:   products[product]["productName"],
                            message: "is now " + products[product]["currentPrice"] + " from " + products[product]["previousPrice"]
                        });
                    }

                }

                this.storeLocally();
                return true;
            }
        }
        return false;
    }

    this.setProductList= function(productList) {
        products = productList;
    }

    this.getProductEntry = function(id, productName, currPrice, storeName, imageUrl, productUrl, description) {
        return {"id": id, "productName": productName, "currentPrice": currPrice, "previousPrice": "", "merchant": storeName, "imageUrl": imageUrl, "productUrl": productUrl, "description": description};
    }

    this.getProductEntryWithSalePrice = function(id, productName, currPrice, prevPrice, storeName, imageUrl, productUrl, description) {
        return {"id": id, "productName": productName, "currentPrice": currPrice, "previousPrice": prevPrice, "merchant": storeName, "imageUrl": imageUrl, "productUrl": productUrl, "description": description};
    }

    this.stringToNumber = function(strNumber) {
        return Number(strNumber.replace(/[^0-9\.]+/g,""));
    }

    /**
     * First clear local storage, then store the product list.
     */
    this.storeLocally = function() {
        localStorage.clear();
        localStorage.setItem("productList", JSON.stringify(products));
    }

    /*
     * id
     * productName
     * price
     * store
     * imageUrl (thumbnail)
     * ?fullImage? - will need to add an ImageView class
     * productUrl
     * description
     */
    var products = [];
}