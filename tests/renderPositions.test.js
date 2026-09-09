const assert = require("node:assert/strict");
const test = require("node:test");

const luauModule = require("../out/LuauAST");
const luau = luauModule.default;

test("reports generated ranges from the emitted layout", () => {
	const printStatement = luau.create(luau.SyntaxKind.CallStatement, {
		expression: luau.call(luau.id("print"), [luau.string("inside")]),
	});
	const callback = luau.create(luau.SyntaxKind.FunctionExpression, {
		statements: luau.list.make(printStatement),
		parameters: luau.list.make(),
		hasDotDotDot: false,
	});
	const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, {
		left: luau.id("callback"),
		right: callback,
	});
	const ast = luau.list.make(declaration);

	const rendered = luauModule.renderASTWithPositions(ast);

	assert.equal(rendered.code, "local callback = function()\n\tprint(\"inside\")\nend\n");
	assert.equal(rendered.code, luauModule.renderAST(ast));
	const rangeOf = node => rendered.positions.find(position => position.node === node).range;
	assert.deepEqual(rangeOf(declaration), {
		start: { line: 0, column: 0 },
		end: { line: 3, column: 0 },
	});
	assert.deepEqual(rangeOf(callback), {
		start: { line: 0, column: 17 },
		end: { line: 2, column: 3 },
		closing: { line: 2, column: 0 },
	});
	assert.deepEqual(rangeOf(printStatement), {
		start: { line: 1, column: 0 },
		end: { line: 2, column: 0 },
	});
});

test("reports every occurrence when a node identity is rendered twice", () => {
	const statement = luau.comment(" same node");
	const rendered = luauModule.renderASTWithPositions(luau.list.make(statement, statement));
	const occurrences = rendered.positions.filter(position => position.node === statement);

	assert.equal(rendered.code, "-- same node\n-- same node\n");
	assert.deepEqual(
		occurrences.map(occurrence => occurrence.range),
		[
			{ start: { line: 0, column: 0 }, end: { line: 1, column: 0 } },
			{ start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
		],
	);
});
