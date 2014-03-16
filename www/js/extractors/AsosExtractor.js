var AsosExtractor = function(pageDocument) {

	var MERCHANT_NAME = "Asos";
	
	this.getProductName = function() {
        var productName = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductTitle"]');
        if(productName != null) {
            return this.clearWhiteSpacesAndLineBreaks(productName.innerHTML.split(">")[1].split("<")[0])
        }
        productName = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductTitle"]');
        console.log(productName);
        return productName.innerHTML.replace(/\s*\<.*?\>\s*/g, '');
	};

    this.getProductCode = function() {
        //TODO:
    }
	
	this.getProductPrice = function() {
        //TODO: Handle sale
        var currentPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductPrice"]');
        if(currentPrice != null) {
            var previousPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductPreviousPrice"]');
            if(previousPrice != null){
                return previousPrice.innerHTML.replace("NOW ", "") + "|" + currentPrice.innerHTML;
            }
            return currentPrice.innerHTML;
        }
        currentPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductPrice"]');
        var previousPrice = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparate1_lblProductPreviousPrice"]');
        if(previousPrice != null) {
            return previousPrice.innerHTML.replace("NOW ", "") + "|" + currentPrice.innerHTML;
        }
		return currentPrice.innerHTML;
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

        var item = infoTag.getElementsByTagName("strong")[0].innerHTML;
        var byRetailer = infoTag.getElementsByTagName("strong")[1].innerHTML.replace("&amp;", "and");
        description += item + " by " + byRetailer + " | ";

        var infoList = infoTag.getElementsByTagName("ul")[0].children;
        for(var info = 0; info < infoList.length; info++) {
            description += infoList[info].firstElementChild.innerHTML + ' | ';
        }
        return description;
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
}