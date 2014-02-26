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
    var products = [
        {"id": 1, "productName": "Light wash two-tone denim shirt", "price": 25.00, "store": "River Island", "imageUrl": "http://riverisland.scene7.com/is/image/RiverIsland/276846_main?$AltThumbNail$", "productUrl": "www.riverisland.com/men/shirts/denim-shirts/Light-wash-two-tone-denim-shirt-276846", "description": "Take on the denim trend in its most sophisticated form with this two-tone light wash denim shirt. Featuring grandad collar, contrast yoke and short rolled sleeves."}
    ];

}