var ZaraExtractor = function(pageDocument) {
	var MERCHANT_NAME = "Zara";
	
	this.getProductName = function() {
		return pageDocument.getElementsByTagName("h1")[0].innerHTML;
	};

    this.getProductCode = function() {
        return pageDocument.querySelectorAll(".reference")[0].innerHTML;
    }
	
	this.getProductPrice = function() {
        //TODO: Not working
		return pageDocument.querySelectorAll(".price")[1].getAttribute("data-price");
	}

    this.getProductImageThumb = function() {
        return "http:" + pageDocument.querySelectorAll(".colors")[0].querySelectorAll(".selected")[0].getElementsByTagName("img")[0].getAttribute("src");
    }

    this.getProductDescription = function() {
        return "Please visit the Zara website for more details";
    }

    this.getMerchantName = function() {
        return MERCHANT_NAME;
    }
}