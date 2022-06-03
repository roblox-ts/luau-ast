import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderFunctionDeclaration(state: RenderState, node: luau.FunctionDeclaration) {
	if (node.localize) {
		assert(luau.isAnyIdentifier(node.name), "local function cannot be a property");
	}
	const nameStr = render(state, node.name);
	const fnStart = `${node.localize ? "local " : ""}function ${nameStr}(`;
	const paramStrs = renderParameters(state, node);

	let result = "";

	if (state.isFormattable(`${fnStart}${paramStrs.join("")})`)) {
		result += state.line(fnStart);
		result += state.block(() =>
			renderParameters(state, node)
				.map(param => state.line(param))
				.join(""),
		);
		result += state.line(")");
	} else {
		result += state.line(`${fnStart}${paramStrs.join("")})`);
	}

	result += state.block(() => renderStatements(state, node.statements));
	result += state.line("end");

	return result;
}
