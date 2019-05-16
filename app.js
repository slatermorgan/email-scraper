const cheerio = require("cheerio"),
    request = require("request"),
    Knwl = require("knwl.js");

var knwlInstance = new Knwl("english"); //specifies language for Knwl

getDomain("slatermorgan@hotmail.com");

// Request web domain
request("https://slatermorgan.github.io/projects", function (err, res, html) {
    if (!err && res.statusCode == 200) {
        const $ = cheerio.load(html);

        const body = $("body");

        webPageText = body.text();

        // search and parse out contact info
        knwlInstance.init(webPageText);
        var findEmail = knwlInstance.get("emails");
        emails = findEmail[0].address;
        console.log(emails);

    } else {

        console.log(err);
    }
});

function getDomain(str) {
    var n = str.indexOf("@");
    domain = str.substring(n + 1, str.length);
    console.log(domain);
}
