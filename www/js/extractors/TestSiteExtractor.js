var TestSiteExtractor = function(pageDocument) {
	var MERCHANT_NAME = "Test Merchant";

	this.getProductName = function() {
        return pageDocument.getElementsByTagName("h1")[0].innerHTML;
	};
	
	this.getProductPrice = function() {
        return pageDocument.getElementsByTagName("h2")[0].innerHTML;
	}

    this.getProductImageThumb = function() {
        return pageDocument.getElementsByTagName("h4")[0].innerHTML;
    }

    this.getProductDescription = function() {
        return pageDocument.getElementsByTagName("h3")[0].innerHTML;
    }

    this.getMerchantName = function() {
        return MERCHANT_NAME;
    }
}