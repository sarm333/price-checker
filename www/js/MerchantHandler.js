var MerchantHandler = function(url, htmlResponse) {

    this.getMerchantExtractor = function() {

        var el = document.createElement( 'div' );
        el.innerHTML = htmlResponse;

        if(url.indexOf(".riverisland") != -1) {
            return new RiverIslandExtractor(el);
        }
        else if(url.indexOf(".thaidanceacademy") != -1) {
            return new TestSiteExtractor(el);
        }
        else if(url.indexOf(".zara") != -1) {
            return new ZaraExtractor(el);
        }
        else if(url.indexOf(".asos") != -1) {
            return new AsosExtractor(el);
        }
        else if(url.indexOf(".newlook") != -1) {
            return new NewLookExtractor(el);
        } else {
            return false;
        }
    }
}