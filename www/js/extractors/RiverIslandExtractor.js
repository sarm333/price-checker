var RiverIslandExtractor = function(pageDocument) {
	var STORE_NAME = "River Island";
	var productDetailsTag = pageDocument.querySelectorAll('.product-details-container')[0];
	
	this.getProductName = function() {
    	return pageDocument.getElementsByTagName("h1").item(0).innerHTML;
	};
	
	this.getProductPrice = function() {
		return productDetailsTag;
	}
	
	
}