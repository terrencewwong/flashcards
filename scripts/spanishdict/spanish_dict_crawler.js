var Crawler = require("crawler");
var url = require('url');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            tables = $(".vtable");

            for(i = 0; i < tables.length; i++) {
                var table = tables[i];
                var rows = $('tr', table);

                for(j = 0; j < rows.length; j++) {
                    var words = $('td', rows[j]);

                    console.log(words.text());

                }

                console.log("================================== End of table");

            }

        }
        done();
    }
});

verbs = ['ir']

url_p1 = 'http://www.spanishdict.com/conjugate/'

for (i = 0; i < verbs.length; i++) {
    c.queue(url_p1.concat(verbs[i]));
}