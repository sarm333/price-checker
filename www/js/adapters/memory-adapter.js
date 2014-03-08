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
        localStorage.clear();
        for(var product in products) {
            if(productId == products[product]["id"]) {
                products.splice(product, 1);
                break;
            }
        }
        this.storeLocally();
    }

    this.addToProductList = function(productName, price, merchantName, imageUrl, productUrl, description) {
        localStorage.clear();
        var id = merchantName + "_" + productName;
        id = id.replace(/ /gi, "_").toLowerCase();
        if(this.isItemAlreadyInList(id)) {
            alert("Item is already in your shopping list!");
        } else {
            products.push(this.getProductEntry(id, productName, price, merchantName, imageUrl, productUrl, description));
        }
        this.storeLocally();
    }

    this.setProductList= function(productList) {
        products = productList;
    }

    this.getProductEntry = function(id, productName, price, storeName, imageUrl, productUrl, description) {
        return {"id": id, "productName": productName, "price": price, "merchant": storeName, "imageUrl": imageUrl, "productUrl": productUrl, "description": description};
    }

    this.storeLocally = function() {
        localStorage.setItem("productList", JSON.stringify(products));
        //window.localStorage.clear();
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