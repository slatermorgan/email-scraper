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


        // Parse all links from page
        // dataStr = "";
        //
        // $("a").each(function (i, el) {
        //     const link = $(el).attr("href");
        //     dataStr += " " + link + " ";
        // });
        //
        // webPageText = dataStr
        webPageText = body.text();
        console.log(webPageText)
        knwlInstance.init(webPageText);

        // calls scraper methods
        scraper.emails();
        scraper.phones();
        scraper.links();

      } else {
        console.log(err);
      }
});

function getDomain(str) {
    var n = str.indexOf("@");
    return str.substring(n + 1, str.length);
}

var scraper = {
    emails: function() {
        var foundItems = knwlInstance.get('emails');
        if (foundItems.length === 0) {
          console.log("0 links found")
        } else {
          console.log(foundItems);
        }
    },
    links: function() {
      var foundItems = knwlInstance.get('links');
      if (foundItems.length === 0) {
        console.log("0 links found")
      } else {
        console.log(foundItems[0]);
      }
    },
    phones: function() {
      var foundItems = knwlInstance.get('phones');
      if (foundItems.length === 0) {
        console.log("0 phone numbers found")
      } else {
        console.log(foundItems);
      }
    }
};
