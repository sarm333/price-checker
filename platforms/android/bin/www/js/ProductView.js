var ProductView = function(adapter, productPage, product) {
 
    this.initialize = function() {
        this.el = $('<div/>');
    };
    
    this.render = function() {
	    this.el.html(productPage(product));
	    return this;
	};
	
    this.initialize();
 
}