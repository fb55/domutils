var fs = require("fs");

var makeDom = require("../utils").makeDom;
var dom = makeDom(Array(21).join("<?xml><tag1 id='asdf'> <script>text</script> <!-- comment --> <tag2> text </tag1>"));

function compare(expected, result){
	if(typeof expected !== typeof result){
		throw Error("types didn't match");
	}
	if(typeof expected !== "object" || expected === null){
		if(expected !== result){
			throw Error("result doesn't equal expected");
		}
		return;
	}

	for(var prop in expected){
		if(!(prop in result)) throw Error("result didn't contain property " + prop);
		compare(expected[prop], result[prop]);
	}
}

describe("DomUtils", function() {
	var dir = "/../DomUtils/";

	//read files, load them, run them
	fs.readdirSync(__dirname + dir
	).filter(function(fileName) {
		return fileName[0] !== ".";
	}).map(function(fileName){
		return require(__dirname + dir + fileName);
	}).forEach(function(test){
		describe(test.name, function() {
			it("getElements", function() {
				var actual = test.getElements(dom);
				compare(test.expected, actual);
			});
			it("getByFunction", function() {
				var actual = test.getByFunction(dom);
				compare(test.expected, actual);
			});
		});
	});
});
