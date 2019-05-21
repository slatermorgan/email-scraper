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
    github: [],
    linkedin: []
};
var emailAddress = "someone@canddi.com"
var url = "https://www." + getDomain(emailAddress);

// Request web domain
request(url, function (err, res, html) {
    if (!err && res.statusCode == 200) {

        scrapedData.url.push(url);

        // Cheerio
        const $ = cheerio.load(html);
        // Get webpage body text
        const body = $("body");
        webPageText = body.text();
        // Get webpage <a> tags html attr
        webPageHrefs = "";
        $("a").each(function (i, el) {
            const link = $(el).attr("href");
            webPageHrefs += " " + link + " ";
        });

        // calls finder methods
        foundEmails = find.emails(webPageHrefs);
        foundPhones = find.phones(webPageText);
        foundLinks = find.links(webPageHrefs);

        // parse email from knwl object and put in array
        parsedEmails = []
        if (foundEmails == null){
            console.log("ERR: cant perform parse on 0 emails");
        } else {
            for (var i=0; i<foundEmails.length; i++){
                parsedEmails.push(foundEmails[i]['address']);
            }
            parsedEmails = remDup(parsedEmails);
            scrapedData.email = parsedEmails;
        }
        // extract links from knwl object and put in array
        parsedLinks = []
        if (foundLinks == null){
            console.log("ERR: cant perform parse on 0 links");
        } else {
            for (var i=0; i<foundLinks.length; i++){
                parsedLinks.push(foundLinks[i]['link']);
            }
            parsedLinks = remDup(parsedLinks);
            socialSearch(parsedLinks);
        }

      } else {
        console.log(err);
      }
      // could save scrapedData to a JSON file here
      console.log(scrapedData);
  });

function getDomain(email) {
    var n = email.indexOf("@");
    return email.substring(n + 1, email.length);
}
// Removes duplication in array
function remDup(arr) {
    if (arr === null){
        console.log("ERR: duplication cant be perfomed on null");
    } else {
        let uniqueItems = {};
        arr.forEach(function(i) {
          if(!uniqueItems[i]) {
            uniqueItems[i] = true;
          }
        });
        return Object.keys(uniqueItems);
    }
}
// Searches links for popular social sites
function socialSearch(data) {
    for (var i=0; i<data.length; i++) {

        fbPattern = /facebook/
        twPattern = /twitter/
        liPattern = /linkedin/
        gitPattern = /github/

        fbcheck = fbPattern.test(data[i]);
        twcheck = twPattern.test(data[i]);
        licheck = liPattern.test(data[i]);
        gitcheck = gitPattern.test(data[i]);

        if(fbcheck){
            scrapedData.facebook.push(parsedLinks[i]);
        }
        if(twcheck){
            scrapedData.twitter.push(parsedLinks[i]);
        }
        if(licheck){
            scrapedData.linkedin.push(parsedLinks[i]);
        }
        if(gitcheck){
            scrapedData.github.push(parsedLinks[i]);
        }
    }
}
// Finder functions (2 knwl and 1 own)
var find = {
    emails: function(data) {
        knwlInstance.init(data);
        var foundItems = knwlInstance.get('emails');
        if (foundItems.length === 0) {
          console.log("0 emails found");
        } else {
            console.log(foundItems.length + " emails found");
            return foundItems;
        }
    },
    links: function(data) {
      knwlInstance.init(data);
      var foundItems = knwlInstance.get('links');
      if (foundItems.length === 0) {
        console.log("0 links found");
      } else {
          console.log(foundItems.length + " links found");
          return foundItems;
      }
    },
    phones: function(data) {
        phones = data.replace(/\s/g, "");
        phoneExp = /44\d[\s\d-]{8,8}\d/g
        foundItems = phones.match(phoneExp);
        countItems = phones.search(phoneExp);
        if (foundItems == null){
            console.log("0 phone numbers found");
        } else {
            console.log(countItems + " phone numbers found");
            foundItems = remDup(foundItems);
            scrapedData.phone.push(foundItems);
        }
    }
};
