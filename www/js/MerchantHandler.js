var MerchantHandler = function(url, htmlResponse) {



    this.getMerchantExtractor = function() {

        var el = document.createElement( 'div' );
        el.innerHTML = htmlResponse;

        if(url.indexOf("www.riverisland") != -1) {
            return new RiverIslandExtractor(el);
        }
        else if(url.indexOf("www.thaidanceacademy") != -1) {
            return new TestSiteExtractor(el);
        }
        else if(url.indexOf("www.zara") != -1) {
            return new ZaraExtractor(el);
        }
        else if(url.indexOf("www.asos") != -1) {
            return new AsosExtractor(el);
        }
    }
}