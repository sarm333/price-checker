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
        for(product in products) {
            if(newId == products[product]["key"]) {
                return true;
            }
        }
        return false;
    }

    this.addToProductList = function(productName, price, storeName, imageUrl, productUrl, description) {
        localStorage.clear();
        var newId = productName + price + storeName;
        if(this.isItemAlreadyInList(newId)) {
            alert("Item is already in your shopping list!");
        } else {
            products.push({"id": products.length + 1, "key": newId, "productName": productName, "price": price, "store": storeName, "imageUrl": imageUrl, "productUrl": productUrl, "description": description});
        }
        this.storeLocally();
    }

    this.addToProductListFromDB = function(product) {
        var extractedFromDB = product.split(",");
        products.push({"id": parseInt(extractedFromDB[0]), "key": extractedFromDB[1], "productName": extractedFromDB[2], "price": extractedFromDB[3], "store": extractedFromDB[4], "imageUrl": extractedFromDB[5], "productUrl": extractedFromDB[6], "description": extractedFromDB[7]});
    }

    this.concatenateForDB = function(product) {
        strEntry = product["id"];
        strEntry += "," + product["key"];
        strEntry += "," + product["productName"];
        strEntry += "," + product["price"];
        strEntry += "," + product["store"];
        strEntry += "," + product["imageUrl"];
        strEntry += "," + product["productUrl"];
        strEntry += "," + product["description"];
        return strEntry;
    }

    this.storeLocally = function() {
        for(product in products) {
            localStorage.setItem(products[product]["id"].toString(), this.concatenateForDB(products[product]));
        }
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