var RiverIslandExtractor = function(pageDocument) {
	var STORE_NAME = "River Island";
	var productDetailsTag = pageDocument.querySelectorAll('.product-details-container')[0];
	
	this.getProductName = function() {
		return productDetailsTag.getElementsByTagName("h1")[0].innerHTML;
	};
	
	this.getProductPrice = function() {
		var priceNode = productDetailsTag.getElementsByClassName("price")[0];
        if(priceNode.length == 5) {
            //TODO: Handle sale items
            return priceNode.getElementsByTagName("div")[0].innerHTML;
        } else {
            return priceNode.getElementsByTagName("span")[0].innerHTML;
        }
	}

    this.getProductImageThumb = function() {
        return productDetailsTag.getElementsByClassName("cloudzoom-gallery")[0].getAttribute("src");
    }

    this.getProductDescription = function() {
        var descriptionNode = productDetailsTag.getElementsByClassName("description-copy")[0];
        return descriptionNode.getElementsByTagName("p")[0].innerHTML;
    }
}