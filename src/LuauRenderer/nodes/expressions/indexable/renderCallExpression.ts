import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderCallExpression(state: RenderState, node: luau.CallExpression) {
	const expStr = render(state, node.expression);
	const formatStr = `${expStr}(${renderArguments(state, node.args).join("")})`;

	if (state.isFormattable(formatStr)) {
		let result = "";
		result += state.newline(`${expStr}(`);
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
