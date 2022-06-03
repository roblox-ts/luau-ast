import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderCallExpression(state: RenderState, node: luau.CallExpression) {
	const expStr = render(state, node.expression);
	const argStrs = renderArguments(state, node.args).join("");

	if (state.isFormattable(`${expStr}(${argStrs})`)) {
		let result = "";
		result += state.newline(`${expStr}(`);
		result += state.block(() =>
			renderArguments(state, node.args)
				.map(a => state.line(a))
				.join(""),
		);
		result += state.indented(")");

		return result;
	}
	return `${expStr}(${argStrs})`;
}
