const xml2js = require("xml2js");
const fs = require("fs");

const path = process.argv[2];

if (!path) {
  console.log("No file provided...");
  return;
}

const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
  xmldec: { version: "1.0", encoding: "UTF-8" }
});

console.log("reading file...");
fs.readFile(path, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("parsing xml...");
  parser.parseString(data, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("sorting entries...");
    const sorted = { "jcr:root": {} };

    Object.entries(result["jcr:root"])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(field => {
        const [key, obj] = field;
        sorted["jcr:root"][key] = obj;
      });

    console.log("building xml...");
    var xml = builder.buildObject(sorted);

    console.log("writing file...");
    fs.writeFile(path, xml, err => {
      console.log(err || "All done :)");
    });
  });
});
