import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderFunctionExpression(state: RenderState, node: luau.FunctionExpression) {
	const paramsStr = renderParameters(state, node).join("");
	const startStr = `function(${paramsStr})`;
	const isFormattable = state.isFormattable(startStr);

	let result = "";

	if (luau.list.isEmpty(node.statements)) {
		if (isFormattable) {
			result += state.newline("function(");
			result += state.block(() =>
				renderParameters(state, node)
					.map(param => state.line(param))
					.join(""),
			);
			result += state.indented(") end");
			return result;
		}

		return `${startStr} end`;
	}

	if (isFormattable) {
		result += state.newline("function(");
		result += state.block(() =>
			renderParameters(state, node)
				.map(p => state.line(p))
				.join(""),
		);
		result += state.line(")");
	} else {
		result += `function(${paramsStr}${state.newline(")")}`;
	}

	result += state.block(() => renderStatements(state, node.statements));
	result += state.indented("end");
	return result;
}
