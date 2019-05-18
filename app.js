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
            // console.log(link);
        });

        // webpage data
        webPageLinks = dataStr
        webPageText = body.html();


        // calls finder methods
        foundEmails = find.emails(webPageText);
        foundPhones = find.phones(webPageText);
        foundLinks = find.links(webPageLinks);

        // attempt to find links and put in array
        parsedLinks = []
        for (var i=0; i<foundLinks.length; i++){
            parsedLinks.push(foundLinks[i]['link'])
        }

        // Social search
        for (var i=0; i<parsedLinks.length; i++) {
            pattern = /facebook|twitter|linkedin|instagram|youtube|github/
            check = pattern.test(parsedLinks[i])
            if(check){
                console.log(parsedLinks[i]);
            }
        }

      } else {
        console.log(err);
      }
});

function getDomain(str) {
    var n = str.indexOf("@");
    return str.substring(n + 1, str.length);
}

// Finder function using Knwl
var find = {
    emails: function(data) {
        knwlInstance.init(data);
        var foundItems = knwlInstance.get('emails');
        if (foundItems.length === 0) {
          console.log("0 links found")
        } else {
            return foundItems;
        }
    },
    links: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('links');
      if (foundItems.length === 0) {
        console.log("0 links found")
      } else {
          return foundItems;
      }
    },
    phones: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('phones');
      if (foundItems.length === 0) {
        console.log("0 phone numbers found")
      } else {
          return foundItems;
      }
    }
};
