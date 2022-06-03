import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { render, RenderState } from "LuauRenderer";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderMethodCallExpression(state: RenderState, node: luau.MethodCallExpression) {
	assert(luau.isValidIdentifier(node.name));
	const objStr = render(state, node.expression);
	const argsStr = renderArguments(state, node.args).join("");
	const formatStr = `${objStr}:${node.name}(${argsStr})`;

	if (state.isFormattable(formatStr)) {
		let result = "";
		result += state.newline(`${objStr}:${node.name}(`);
		result += state.block(() =>
			renderArguments(state, node.args)
				.map(arg => state.line(arg))
				.join(""),
		);
		result += state.indented(")");
		return result;
	}

	return formatStr;
}
