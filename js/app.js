Ext.application({
    name: 'FB',
    requires: ['Ext.Carousel'],
    launch: function() {
        FB.container = new Ext.Carousel({
            fullscreen: true,
            items: [{
                title: 'GET',
                style: "background-color: #ed5e7d; color: #ffffff; ",
                scrollable: true,
                html: ['<div id="bodyGet"></div>'].join(""),
                listeners: {
                    activate: function() {
                        Ext.Ajax.request({
                            url: 'js/GET.js',
                            callback: function(options, success, response) {
                                eval(response.responseText);
                            }
                        });
                    }
                }
            }, {
                title: 'POST',
                style: "background-color: #599afd; color: #ffffff; ",
                scrollable: true,
                html: ['<div id="bodyPost"></div>'].join(""),
                listeners: {
                    activate: function() {
                        Ext.Ajax.request({
                            url: 'js/POST.js',
                            callback: function(options, success, response) {
                                eval(response.responseText);
                            }
                        });
                    }
                }
            }]
        });
    }
});