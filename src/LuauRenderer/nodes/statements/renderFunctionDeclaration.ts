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
	const startStr = `${node.localize ? "local " : ""}function ${nameStr}(`;
	const formatStr = `${startStr}${renderParameters(state, node).join("")})`;

	let result = "";

	if (state.isFormattable(formatStr)) {
		result += state.line(startStr);
		result += state.block(() =>
			renderParameters(state, node)
				.map(param => state.line(param))
				.join(""),
		);
		result += state.line(")");
	} else {
		result += state.line(formatStr);
	}

	result += state.block(() => renderStatements(state, node.statements));
	result += state.line("end");

	return result;
}
