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

test("uses UTF-16 columns and treats CRLF as one generated line break", () => {
	const value = luau.string("😀\r\nnext\"'");
	const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, {
		left: luau.id("value"),
		right: value,
	});
	const rendered = luauModule.renderASTWithPositions(luau.list.make(declaration));
	const valueRange = rendered.positions.find(position => position.node === value).range;

	assert.equal(rendered.code, "local value = [[😀\r\nnext\"']]\n");
	assert.deepEqual(valueRange, {
		start: { line: 0, column: 14 },
		end: { line: 1, column: 8 },
	});
});

test("reports empty function closings and empty table ranges", () => {
	const callback = luau.create(luau.SyntaxKind.FunctionExpression, {
		statements: luau.list.make(),
		parameters: luau.list.make(),
		hasDotDotDot: false,
	});
	const table = luau.map();
	const rendered = luauModule.renderASTWithPositions(
		luau.list.make(
			luau.create(luau.SyntaxKind.VariableDeclaration, {
				left: luau.id("emptyFunction"),
				right: callback,
			}),
			luau.create(luau.SyntaxKind.VariableDeclaration, {
				left: luau.id("emptyMap"),
				right: table,
			}),
		),
	);
	const rangeOf = node => rendered.positions.find(position => position.node === node).range;

	assert.equal(rendered.code, "local emptyFunction = function() end\nlocal emptyMap = {}\n");
	assert.deepEqual(rangeOf(callback), {
		start: { line: 0, column: 22 },
		end: { line: 0, column: 36 },
		closing: { line: 0, column: 33 },
	});
	assert.deepEqual(rangeOf(table), {
		start: { line: 1, column: 17 },
		end: { line: 1, column: 19 },
	});
});

test("gives elseif occurrences their own range and the outer if its shared closing", () => {
	const elseifNode = luau.create(luau.SyntaxKind.IfStatement, {
		condition: luau.bool(false),
		statements: luau.list.make(luau.comment(" elseif")),
		elseBody: luau.list.make(),
	});
	const ifNode = luau.create(luau.SyntaxKind.IfStatement, {
		condition: luau.bool(true),
		statements: luau.list.make(luau.comment(" then")),
		elseBody: elseifNode,
	});
	const rendered = luauModule.renderASTWithPositions(luau.list.make(ifNode));
	const rangeOf = node => rendered.positions.find(position => position.node === node).range;

	assert.equal(rendered.code, "if true then\n\t-- then\nelseif false then\n\t-- elseif\nend\n");
	assert.deepEqual(rangeOf(elseifNode), {
		start: { line: 2, column: 0 },
		end: { line: 4, column: 0 },
	});
	assert.deepEqual(rangeOf(ifNode), {
		start: { line: 0, column: 0 },
		end: { line: 5, column: 0 },
		closing: { line: 4, column: 0 },
	});
});

test("keeps renderAST assertion behavior when positions are requested", () => {
	const ast = luau.list.make(
		luau.create(luau.SyntaxKind.ReturnStatement, { expression: luau.number(1) }),
		luau.create(luau.SyntaxKind.CallStatement, { expression: luau.call(luau.id("unreachable")) }),
	);

	assert.throws(() => luauModule.renderAST(ast), /Cannot render statement after break, continue, or return!/);
	assert.throws(
		() => luauModule.renderASTWithPositions(ast),
		/Cannot render statement after break, continue, or return!/,
	);
});

test("handles a large flat AST without exhausting the stack", () => {
	const statements = Array.from({ length: 10_000 }, (_, index) => luau.comment(` line ${index}`));
	const ast = luau.list.make(...statements);

	const plain = luauModule.renderAST(ast);
	const positioned = luauModule.renderASTWithPositions(ast);

	assert.equal(positioned.code, plain);
	assert.equal(positioned.positions.length, statements.length);
	assert.deepEqual(positioned.positions.at(-1).range, {
		start: { line: 9_999, column: 0 },
		end: { line: 10_000, column: 0 },
	});
});
