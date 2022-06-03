import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderComputedIndexExpression(state: RenderState, node: luau.ComputedIndexExpression) {
	const expStr = render(state, node.expression);
	if (luau.isStringLiteral(node.index) && luau.isValidIdentifier(node.index.value)) {
		const nameStr = node.index.value;
		if (state.isFormattable(`${expStr}.${nameStr}`)) {
			let result = "";
			result += state.newline(expStr);
			result += state.block(() => state.indented(`.${nameStr}`));
			return result;
		}
		return `${expStr}.${nameStr}`;
	} else {
		const indexStr = render(state, node.index);
		return `${expStr}[${indexStr}]`;
	}
}
