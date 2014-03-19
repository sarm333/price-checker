var ProductView = function(adapter, productPage, product) {
 
    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.buy-now-button', this.clickBuyNow);
    };
    
    this.render = function() {
	    this.el.html(productPage(product));
	    return this;
	};

    this.clickBuyNow = function() {
        var productUrl = $(".buy-now-button").attr("url");
        var ref = window.open(productUrl, '_blank', 'location=yes,transitionstyle=crossdissolve');
    }
	
    this.initialize();
 
}