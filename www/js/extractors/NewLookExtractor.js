var NewLookExtractor = function(pageDocument) {

	var MERCHANT_NAME = "New Look";
	
	this.getProductName = function() {
        return pageDocument.querySelector('.title_container').getElementsByTagName('h1')[0].innerHTML
	};

    this.getProductCode = function() {
        //TODO:
    }
	
	this.getProductPrice = function() {
        //TODO: Handle sale
		return pageDocument.querySelector('.title_container').getElementsByClassName('promovalue')[0].innerHTML
	}

    this.getProductImageThumb = function() {
        return "http:" + pageDocument.querySelector('img[id=thumb_1]').getAttribute('src');
    }

    this.getProductDescription = function() {
        //TODO: '.querySelector('span[itemprop=description]').firstChild.innerHTML' doesnt work
        return "Please refer to the product page for more information";
    }

    this.getMerchantName = function() {
        return MERCHANT_NAME;
    }
}