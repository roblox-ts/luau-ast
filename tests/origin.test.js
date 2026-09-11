const assert = require("node:assert/strict");
const test = require("node:test");

const luauModule = require("../out/LuauAST");
const luau = luauModule.default;

test("node origins survive the package's shallow clone paths", () => {
	const origin = {
		start: { line: 4, column: 2 },
		closing: { line: 4, column: 7 },
	};
	const identifier = luauModule.setNodeOrigin(luau.id("value"), origin);
	luau.create(luau.SyntaxKind.VariableDeclaration, { left: identifier, right: undefined });
	const declarationWithClone = luau.create(luau.SyntaxKind.VariableDeclaration, {
		left: identifier,
		right: undefined,
	});

	assert.notEqual(declarationWithClone.left, identifier);
	assert.equal(declarationWithClone.left.origin, origin);

	const statement = luauModule.setNodeOrigin(luau.comment(" origin"), origin);
	const clonedList = luau.list.clone(luau.list.make(statement));
	assert.notEqual(clonedList.head.value, statement);
	assert.equal(clonedList.head.value.origin, origin);
});
