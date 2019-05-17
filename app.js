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
        webPageText = body.text();
        // console.log(webPageText);

        // search and parse out contact info
        knwlInstance.init(webPageText);

        // Email
        var foundEmail = knwlInstance.get("emails");

        if (foundEmail.length === 0) {
            console.log("0 email addresses found")
        } else {
            emails = foundEmail[0].address;
            console.log("Emails:")
            console.log(emails);
        }

        // Address
        var foundAddress = knwlInstance.get('places');

        if (foundAddress.length === 0) {
            console.log("0 addresses found")
        } else {
            address = foundAddress[0]
            console.log(foundAddress);
        }

        // Phone
        var foundPhone = knwlInstance.get('phones');

        if (foundPhone.length === 0) {
            console.log("0 phone numbers found")
        } else {
            phone = foundPhone[0]
            console.log(foundPhone);
        }

    } else {
        console.log(err);
    }
});

function getDomain(str) {
    var n = str.indexOf("@");
    return str.substring(n + 1, str.length);
}
