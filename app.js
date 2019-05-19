const cheerio = require("cheerio"),
    request = require("request"),
    Knwl = require("knwl.js");

var knwlInstance = new Knwl("english"); //specifies language for Knwl

var scrapedData = {
    url: [],
    email: [],
    phone: [],
    address: [],
    facebook: [],
    twitter: [],
    instagram: [],
    github: [],
    linkedin: []
};

var emailAddress = "someone@canddi.com"
var url = "https://www." + getDomain(emailAddress);
scrapedData.url.push(url);

// Request web domain
request(url, function (err, res, html) {
    if (!err && res.statusCode == 200) {

        // Cheerio Scraping
        // Body
        const $ = cheerio.load(html);
        const body = $("body");
        // <a> tags html attr
        dataStr = "";
        $("a").each(function (i, el) {
            const link = $(el).attr("href");
            dataStr += " " + link + " ";
        });

        // webpage data
        webPageLinks = dataStr
        webPageHTML = body.html();
        webPageText = body.text();

        // calls finder methods
        foundEmails = find.emails(webPageHTML);
        foundPhones = find.phones(webPageText);
        foundLinks = find.links(webPageLinks);

        // extract email from knwl object and put in array
        parsedEmails = []
        for (var i=0; i<foundEmails.length; i++){
            parsedEmails.push(foundEmails[i]['address'])
        }
        scrapedData.email = remDup(parsedEmails);

        // extract links from knwl object and put in array
        parsedLinks = []
        for (var i=0; i<foundLinks.length; i++){
            parsedLinks.push(foundLinks[i]['link'])
        }

        parsedLinks = remDup(parsedLinks)

        socialSearch(parsedLinks);

      } else {
        console.log(err);
      }
      // could save to a JSON file here
      console.log(scrapedData);
  });


function getDomain(str) {
    var n = str.indexOf("@");
    return str.substring(n + 1, str.length);
}

// Removes duplication in array
function remDup(arr) {
  let uniqueItems = {};
  arr.forEach(function(i) {
    if(!uniqueItems[i]) {
      uniqueItems[i] = true;
    }
  });
  return Object.keys(uniqueItems);
}

// Searches links for popular social sites
function socialSearch(data) {
    // Social search
    for (var i=0; i<data.length; i++) {

        fbPattern = /facebook/
        twPattern = /twitter/
        liPattern = /linkedin/
        inPattern = /instagram/
        gitPattern = /github/

        fbcheck = fbPattern.test(data[i])
        twcheck = twPattern.test(data[i])
        licheck = liPattern.test(data[i])
        incheck = inPattern.test(data[i])
        gitcheck = gitPattern.test(data[i])

        if(fbcheck){
            scrapedData.facebook.push(parsedLinks[i]);
        }
        if(twcheck){
            scrapedData.twitter.push(parsedLinks[i]);
        }
        if(licheck){
            scrapedData.linkedin.push(parsedLinks[i]);
        }
        if(incheck){
            scrapedData.instagram.push(parsedLinks[i]);
        }
        if(gitcheck){
            scrapedData.github.push(parsedLinks[i]);
        }
    }
}

// Finder function using Knwl
var find = {
    emails: function(data) {
        knwlInstance.init(data);
        var foundItems = knwlInstance.get('emails');
        if (foundItems.length === 0) {
          console.log("0 emails found")
        } else {
            console.log(foundItems.length + " emails found")
            return foundItems;
        }
    },
    links: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('links');
      if (foundItems.length === 0) {
        console.log("0 links found")
      } else {
          console.log(foundItems.length + " links found")
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
          console.log(foundItems.length + " phone numbers found")
      }
    }
};
