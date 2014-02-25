var HomeView = function (adapter, homePage, listItem) {
	
	this.initialize = function () {
	    // Define a div wrapper for the view. The div wrapper is used to attach events.
	    this.el = $('<div/>');
	    
	    //$('.search-key').on('keyup', findByName);
	    this.el.on('keyup', '.search-key', this.findByName);
	};

	this.render = function() {
		this.el.html(homePage());
    	return this;
	};
	
	this.findByName = function() {
    	adapter.findByName($('.search-key').val()).done(function (products) {
            $('.product-list').html(listItem(products));
        });
    }
    
    this.initialize();
}