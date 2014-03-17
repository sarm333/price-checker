var AsosExtractor = function(pageDocument) {

	var MERCHANT_NAME = "Asos";
	
	this.getProductName = function() {
        var productName = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductTitle"]');
        if(productName != null) {
            return this.clearWhiteSpacesAndLineBreaks(productName.innerHTML.split(">")[1].split("<")[0])
        }
        productName = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductTitle"]');
        return this.removeTags(productName.innerHTML);
	};

    this.getProductCode = function() {
        //TODO:
    }
	
	this.getProductPrice = function() {
        //TODO: Handle sale
        var currentPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductPrice"]');
        if(currentPrice != null) {
            var previousPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductPreviousPrice"]');
            if(previousPrice != null && previousPrice.innerHTML.indexOf('<span') == -1){
                return previousPrice.innerHTML.replace("NOW ", "") + "|" + currentPrice.innerHTML;
            } else if(previousPrice != null && previousPrice.innerHTML.indexOf('<span') != -1) {
                previousPrice =  pageDocument.querySelector('span[id=ctl00_ContentMainPage_ctlSeparateProduct_lblRRP]');
                return currentPrice.innerHTML + "|" + this.removeTags(previousPrice.innerHTML.replace("RRP ", ""));
            }
            return this.removeTags(currentPrice.innerHTML);
        }
        currentPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductPrice"]');
        var previousPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductPreviousPrice"]');
        if(previousPrice != null) {
            return previousPrice.innerHTML.replace("NOW ", "") + "|" + currentPrice.innerHTML;
        }
		return this.removeTags(currentPrice.innerHTML);
	}

    this.getProductImageThumb = function() {
        return pageDocument.querySelector('img[id="ctl00_ContentMainPage_imgMainImage"]').getAttribute("src");
    }

    this.getProductDescription = function() {
        var description = "";
        var infoTag = pageDocument.querySelectorAll(".single-entry")[0];
        if(infoTag == null) {
            return "No product description";
        }

        return this.clearWhiteSpacesAndLineBreaks(infoTag.textContent);
    }

    this.getMerchantName = function() {
        return MERCHANT_NAME;
    }

    this.clearWhiteSpacesAndLineBreaks = function(sentence) {
        sentence = sentence.replace("&amp;", "and");
        sentence = sentence.replace("\n", "");
        var sentenceArr = sentence.split(" ");

        var newString = "";
        for(var word in sentenceArr) {
            if(sentenceArr[word] != "") {
                newString += sentenceArr[word] + " ";
            }
        }
        sentence = newString.substring(0, newString.length - 1);
        sentence = sentence.replace("\n", "");
        return sentence;
    }

    this.removeTags = function(htmlString) {
        return htmlString.replace(/\s*\<.*?\>\s*/g, '');
    }
}