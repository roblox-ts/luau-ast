import luau, { renderAST, renderASTWithPositions, renderNode, RenderState } from "LuauAST";

function renderWithPositions(...statements: Array<luau.Statement>) {
	const ast = luau.list.make(...statements);
	const result = renderASTWithPositions(ast);
	expect(result.code).toBe(renderAST(ast));

	const rangesOf = (node: luau.Node) =>
		result.positions.filter(position => position.node === node).map(position => position.range);
	const rangeOf = (node: luau.Node) => {
		const ranges = rangesOf(node);
		expect(ranges).toHaveLength(1);
		return ranges[0];
	};
	return { ...result, rangesOf, rangeOf };
}

function emptyFunction() {
	return luau.create(luau.SyntaxKind.FunctionExpression, {
		parameters: luau.list.make(),
		hasDotDotDot: false,
		statements: luau.list.make(),
	});
}

describe("renderASTWithPositions", () => {
	it("excludes indentation and line breaks from ranges", () => {
		const call = luau.call(luau.id("print"), [luau.string("inside")]);
		const printStatement = luau.create(luau.SyntaxKind.CallStatement, { expression: call });
		const callback = luau.create(luau.SyntaxKind.FunctionExpression, {
			parameters: luau.list.make(),
			hasDotDotDot: false,
			statements: luau.list.make(printStatement),
		});
		const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, {
			left: luau.id("callback"),
			right: callback,
		});

		const { code, rangeOf } = renderWithPositions(declaration);

		expect(code).toBe('local callback = function()\n\tprint("inside")\nend\n');
		expect(rangeOf(declaration)).toEqual({ start: { line: 0, column: 0 }, end: { line: 2, column: 3 } });
		expect(rangeOf(callback)).toEqual({
			start: { line: 0, column: 17 },
			end: { line: 2, column: 3 },
			closing: { line: 2, column: 0 },
		});
		expect(rangeOf(printStatement)).toEqual({ start: { line: 1, column: 1 }, end: { line: 1, column: 16 } });
		expect(rangeOf(call)).toEqual({ start: { line: 1, column: 1 }, end: { line: 1, column: 16 } });
	});

	it("reports positions in order of appearance", () => {
		const left = luau.id("a");
		const right = luau.id("b");
		const binary = luau.binary(left, "+", right);
		const statement = luau.create(luau.SyntaxKind.CallStatement, { expression: luau.call(luau.id("f"), [binary]) });

		const { positions } = renderWithPositions(statement);

		const nodes = positions.map(position => position.node);
		expect(nodes.indexOf(binary)).toBeLessThan(nodes.indexOf(left));
		expect(nodes.indexOf(left)).toBeLessThan(nodes.indexOf(right));
	});

	it("reports every occurrence of a node which is rendered more than once", () => {
		const comment = luau.comment(" same node");

		const { code, rangesOf } = renderWithPositions(comment, comment);

		expect(code).toBe("-- same node\n-- same node\n");
		expect(rangesOf(comment)).toEqual([
			{ start: { line: 0, column: 0 }, end: { line: 0, column: 12 } },
			{ start: { line: 1, column: 0 }, end: { line: 1, column: 12 } },
		]);
	});

	it("counts columns in UTF-16 code units and only \\n as a line break", () => {
		const value = luau.string("😀\r\nnext\"'");
		const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("value"), right: value });
		const comment = luau.comment("a\rb");

		const { code, rangeOf } = renderWithPositions(declaration, comment);

		expect(code).toBe("local value = [[😀\r\nnext\"']]\n--a\rb\n");
		expect(rangeOf(value)).toEqual({ start: { line: 0, column: 14 }, end: { line: 1, column: 8 } });
		expect(rangeOf(comment)).toEqual({ start: { line: 2, column: 0 }, end: { line: 2, column: 5 } });
	});

	it("reports multiline comment ranges", () => {
		const comment = luau.comment("😀\r\n\nline");
		const statement = luau.create(luau.SyntaxKind.DoStatement, { statements: luau.list.make(comment) });

		const { code, rangeOf } = renderWithPositions(statement);

		expect(code).toBe("do\n\t--[[\n\t\t😀\r\n\n\t\tline\n\t]]\nend\n");
		expect(rangeOf(comment)).toEqual({ start: { line: 1, column: 1 }, end: { line: 5, column: 3 } });
	});

	it("reports ranges of single line functions and tables", () => {
		const callback = emptyFunction();
		const emptyMap = luau.map();
		const array = luau.array([luau.number(1)]);

		const { rangeOf } = renderWithPositions(
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("a"), right: callback }),
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("b"), right: emptyMap }),
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("c"), right: array }),
		);

		expect(rangeOf(callback)).toEqual({
			start: { line: 0, column: 10 },
			end: { line: 0, column: 24 },
			closing: { line: 0, column: 21 },
		});
		expect(rangeOf(emptyMap)).toEqual({ start: { line: 1, column: 10 }, end: { line: 1, column: 12 } });
		expect(rangeOf(array)).toEqual({ start: { line: 2, column: 10 }, end: { line: 2, column: 15 } });
	});

	it("reports multiline table ranges and identifier keys", () => {
		const key = luau.string("key");
		const member = luau.string("member");
		const map = luau.map([[key, luau.number(1)]]);
		const set = luau.set([member]);

		const { code, rangeOf } = renderWithPositions(
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("map"), right: map }),
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("set"), right: set }),
		);

		expect(code).toBe("local map = {\n\tkey = 1,\n}\nlocal set = {\n\tmember = true,\n}\n");
		expect(rangeOf(map)).toEqual({ start: { line: 0, column: 12 }, end: { line: 2, column: 1 } });
		expect(rangeOf(key)).toEqual({ start: { line: 1, column: 1 }, end: { line: 1, column: 4 } });
		expect(rangeOf(member)).toEqual({ start: { line: 4, column: 1 }, end: { line: 4, column: 7 } });
	});

	it("excludes spacing around long bracket strings from ranges", () => {
		const key = luau.string("a\nb");
		const map = luau.map([[key, luau.number(1)]]);

		const { code, rangeOf } = renderWithPositions(
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("map"), right: map }),
		);

		expect(code).toBe("local map = {\n\t[ [[a\nb]] ] = 1,\n}\n");
		expect(rangeOf(key)).toEqual({ start: { line: 1, column: 3 }, end: { line: 2, column: 3 } });
	});

	it("includes semicolons added between statements in ranges", () => {
		const first = luau.create(luau.SyntaxKind.CallStatement, { expression: luau.call(luau.id("f")) });
		const second = luau.create(luau.SyntaxKind.CallStatement, {
			expression: luau.call(
				luau.create(luau.SyntaxKind.ParenthesizedExpression, {
					expression: luau.binary(luau.id("a"), "or", luau.id("b")),
				}),
			),
		});

		const { code, rangeOf } = renderWithPositions(first, second);

		expect(code).toBe("f();\n(a or b)()\n");
		expect(rangeOf(first)).toEqual({ start: { line: 0, column: 0 }, end: { line: 0, column: 4 } });
	});

	it("reports closing keywords after indentation", () => {
		const doStatement = luau.create(luau.SyntaxKind.DoStatement, {
			statements: luau.list.make(luau.comment(" do body")),
		});
		const whileStatement = luau.create(luau.SyntaxKind.WhileStatement, {
			condition: luau.bool(true),
			statements: luau.list.make(luau.comment(" while body")),
		});
		const functionDeclaration = luau.create(luau.SyntaxKind.FunctionDeclaration, {
			localize: true,
			name: luau.id("declared"),
			parameters: luau.list.make(),
			hasDotDotDot: false,
			statements: luau.list.make(luau.comment(" function body")),
		});
		const repeatStatement = luau.create(luau.SyntaxKind.RepeatStatement, {
			condition: luau.bool(true),
			statements: luau.list.make(luau.comment(" repeat body")),
		});
		const outer = luau.create(luau.SyntaxKind.DoStatement, {
			statements: luau.list.make<luau.Statement>(
				doStatement,
				whileStatement,
				functionDeclaration,
				repeatStatement,
			),
		});

		const { code, rangeOf } = renderWithPositions(outer);

		expect(code).toBe(
			"do\n" +
				"\tdo\n\t\t-- do body\n\tend\n" +
				"\twhile true do\n\t\t-- while body\n\tend\n" +
				"\tlocal function declared()\n\t\t-- function body\n\tend\n" +
				"\trepeat\n\t\t-- repeat body\n\tuntil true\n" +
				"end\n",
		);
		expect(rangeOf(doStatement)).toEqual({
			start: { line: 1, column: 1 },
			end: { line: 3, column: 4 },
			closing: { line: 3, column: 1 },
		});
		expect(rangeOf(whileStatement).closing).toEqual({ line: 6, column: 1 });
		expect(rangeOf(functionDeclaration).closing).toEqual({ line: 9, column: 1 });
		expect(rangeOf(repeatStatement)).toEqual({
			start: { line: 10, column: 1 },
			end: { line: 12, column: 11 },
			closing: { line: 12, column: 1 },
		});
		expect(rangeOf(outer).closing).toEqual({ line: 13, column: 0 });
	});

	it("reports each elseif as a nested if statement", () => {
		const elseIf = luau.create(luau.SyntaxKind.IfStatement, {
			condition: luau.bool(false),
			statements: luau.list.make(luau.comment(" elseif")),
			elseBody: luau.list.make(luau.comment(" else")),
		});
		const statement = luau.create(luau.SyntaxKind.IfStatement, {
			condition: luau.bool(true),
			statements: luau.list.make(luau.comment(" then")),
			elseBody: elseIf,
		});

		const { code, rangeOf } = renderWithPositions(statement);

		expect(code).toBe("if true then\n\t-- then\nelseif false then\n\t-- elseif\nelse\n\t-- else\nend\n");
		expect(rangeOf(elseIf)).toEqual({ start: { line: 2, column: 0 }, end: { line: 5, column: 8 } });
		expect(rangeOf(statement)).toEqual({
			start: { line: 0, column: 0 },
			end: { line: 6, column: 3 },
			closing: { line: 6, column: 0 },
		});
	});

	it("reports each elseif as a nested if expression", () => {
		const elseIf = luau.create(luau.SyntaxKind.IfExpression, {
			condition: luau.bool(false),
			expression: luau.number(2),
			alternative: luau.number(3),
		});
		const expression = luau.create(luau.SyntaxKind.IfExpression, {
			condition: luau.bool(true),
			expression: luau.number(1),
			alternative: elseIf,
		});

		const { code, rangeOf } = renderWithPositions(
			luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("value"), right: expression }),
		);

		expect(code).toBe("local value = if true then 1 elseif false then 2 else 3\n");
		expect(rangeOf(elseIf)).toEqual({ start: { line: 0, column: 29 }, end: { line: 0, column: 55 } });
		expect(rangeOf(expression)).toEqual({ start: { line: 0, column: 14 }, end: { line: 0, column: 55 } });
	});

	it("gives nodes which render nothing an empty range", () => {
		const part = luau.create(luau.SyntaxKind.InterpolatedStringPart, { text: "" });
		const value = luau.create(luau.SyntaxKind.InterpolatedString, { parts: luau.list.make(part) });
		const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, { left: luau.id("value"), right: value });

		const { code, rangeOf } = renderWithPositions(declaration);

		expect(code).toBe("local value = ``\n");
		expect(rangeOf(part)).toEqual({ start: { line: 0, column: 15 }, end: { line: 0, column: 15 } });
	});

	it("keeps the final statement assertion", () => {
		const ast = luau.list.make<luau.Statement>(
			luau.create(luau.SyntaxKind.ReturnStatement, { expression: luau.number(1) }),
			luau.create(luau.SyntaxKind.CallStatement, { expression: luau.call(luau.id("unreachable")) }),
		);

		expect(() => renderASTWithPositions(ast)).toThrow("Cannot render statement after break, continue, or return!");
	});

	it("renders long statement lists and elseif chains without exhausting the stack", () => {
		const statements = Array.from({ length: 10_000 }, (_, i) => luau.comment(` line ${i}`));

		let alternative: luau.Expression = luau.nil();
		for (let i = 0; i < 1_000; i++) {
			alternative = luau.create(luau.SyntaxKind.IfExpression, {
				condition: luau.bool(false),
				expression: luau.number(i),
				alternative,
			});
		}
		const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, {
			left: luau.id("x"),
			right: alternative,
		});

		const { rangeOf } = renderWithPositions(...statements, declaration);

		expect(rangeOf(declaration).start).toEqual({ line: 10_000, column: 0 });
		expect(rangeOf(statements[9_999])).toEqual({
			start: { line: 9_999, column: 0 },
			end: { line: 9_999, column: 12 },
		});
	});
});

describe("renderNode", () => {
	it("only creates strings when positions are not requested", () => {
		const statement = luau.create(luau.SyntaxKind.DoStatement, {
			statements: luau.list.make<luau.Statement>(
				luau.create(luau.SyntaxKind.VariableDeclaration, {
					left: luau.id("value"),
					right: luau.map([[luau.string("a\nb"), emptyFunction()]]),
				}),
				luau.comment("a\n\nb"),
			),
		});

		expect(typeof renderNode(new RenderState(), statement)).toBe("string");
	});
});

describe("luau.setNodeOrigin", () => {
	it("keeps the origin when a node is cloned", () => {
		const origin = { start: { line: 4, column: 2 }, closing: { line: 4, column: 7 } };
		const id = luau.setNodeOrigin(luau.id("value"), origin);

		// `luau.create()` clones nodes which already have a parent
		luau.create(luau.SyntaxKind.VariableDeclaration, { left: id, right: undefined });
		const declaration = luau.create(luau.SyntaxKind.VariableDeclaration, { left: id, right: undefined });
		expect(declaration.left).not.toBe(id);
		expect((declaration.left as luau.Identifier).origin).toBe(origin);

		const comment = luau.setNodeOrigin(luau.comment(" origin"), origin);
		const list = luau.list.clone(luau.list.make(comment));
		expect(list.head?.value).not.toBe(comment);
		expect(list.head?.value.origin).toBe(origin);
	});
});
