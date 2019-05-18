// https://scotch.io/tutorials/scraping-the-web-with-node-js

const cheerio = require("cheerio"),
    request = require("request"),
    Knwl = require("knwl.js");

var knwlInstance = new Knwl("english"); //specifies language for Knwl

var emailAddress = "someone@canddi.com"

var url = "https://www." + getDomain(emailAddress);


// Request web domain
request(url, function (err, res, html) {
    if (!err && res.statusCode == 200) {

        const $ = cheerio.load(html);
        const body = $("body");

        dataStr = "";

        $("a").each(function (i, el) {
            const link = $(el).attr("href");
            dataStr += " " + link + " ";
        });

        webPageLinks = dataStr

        webPageText = body.html();
        console.log(webPageText)

        // calls scraper methods
        find.emails(webPageText);
        find.phones(webPageText);
        find.links(webPageLinks);

      } else {
        console.log(err);
      }
});

function getDomain(str) {
    var n = str.indexOf("@");
    return str.substring(n + 1, str.length);
}

var find = {
    emails: function(data) {
        knwlInstance.init(data);
        var foundItems = knwlInstance.get('emails');
        if (foundItems.length === 0) {
          console.log("0 links found")
        } else {
          console.log(foundItems);
        }
    },
    links: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('links');
      if (foundItems.length === 0) {
        console.log("0 links found")
      } else {
        console.log(foundItems);
      }
    },
    phones: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('phones');
      if (foundItems.length === 0) {
        console.log("0 phone numbers found")
      } else {
        console.log(foundItems);
      }
    }
};
