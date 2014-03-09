var AsosExtractor = function(pageDocument) {

	var MERCHANT_NAME = "Asos";
	
	this.getProductName = function() {
        var productName = pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductTitle"]').innerHTML.split(">")[1].split("<")[0];

		return this.clearWhiteSpacesAndLineBreaks(productName);
	};

    this.getProductCode = function() {
        //TODO:
    }
	
	this.getProductPrice = function() {
        //TODO: Handle sale
		return pageDocument.querySelector('span[id="ctl00_ContentMainPage_ctlSeparateProduct_lblProductPrice"]').innerHTML;
	}

    this.getProductImageThumb = function() {
        return pageDocument.querySelector('img[id="ctl00_ContentMainPage_imgMainImage"]').getAttribute("src");
    }

    this.getProductDescription = function() {
        var description = "";
        var infoTag = pageDocument.querySelectorAll(".single-entry")[0];

        var item = infoTag.getElementsByTagName("strong")[0].innerHTML;
        var byRetailer = infoTag.getElementsByTagName("strong")[1].innerHTML.replace("<br>", "").replace("&amp;", "and");
        description += item + " by " + byRetailer + "\n";

        var infoList = infoTag.getElementsByTagName("ul")[0].getElementsByTagName("li");
        for(var info = 0; info < infoList.length; info++) {
            //TODO: line break not working
            description += infoList[info].getElementsByTagName("p")[0].innerHTML + '\n';
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
        console.log(sentence);
        return sentence;
    }
}