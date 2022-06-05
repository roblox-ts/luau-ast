import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderComputedIndexExpression(state: RenderState, node: luau.ComputedIndexExpression) {
	const expStr = render(state, node.expression);
	if (luau.isStringLiteral(node.index) && luau.isValidIdentifier(node.index.value)) {
		const nameStr = node.index.value;
		const formatStr = `${expStr}.${nameStr}`;
		if (state.isFormattable(formatStr)) {
			return `${state.newline(expStr)}${state.block(() => state.indented(`.${nameStr}`))}`;
		}
		return formatStr;
	} else {
		const indexStr = render(state, node.index);
		return `${expStr}[${indexStr}]`;
	}
}
