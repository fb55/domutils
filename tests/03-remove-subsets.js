var htmlparser = require('htmlparser2');
var removeSubsets = require('..').removeSubsets;
function makeDom(markup) {
	var handler = new htmlparser.DomHandler(),
		parser = new htmlparser.Parser(handler);
	parser.write(markup);
	parser.done();
	return handler.dom;
}

module.exports = function(assert) {
	var dom = makeDom("<div><p><span></span></p><p></p></div>")[0];
	var matches;

	matches = removeSubsets([dom, dom]);
	assert.equal(matches.length, 1, "Removes identical trees");

	matches = removeSubsets([dom, dom.children[0].children[0]]);
	assert.equal(matches.length, 1, "Removes subsets found first");

	matches = removeSubsets([dom.children[0], dom]);
	assert.equal(matches.length, 1, "Removes subsets found last");

	matches = removeSubsets([dom.children[0], dom.children[1]]);
	assert.equal(matches.length, 2, "Does not remove unique trees");
};
