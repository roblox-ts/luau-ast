import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderPropertyAccessExpression(state: RenderState, node: luau.PropertyAccessExpression) {
	const expStr = render(state, node.expression);
	const nameStr = node.name;
	if (luau.isValidIdentifier(nameStr)) {
		const formatStr = `${expStr}.${nameStr}`;
		if (state.isFormattable(formatStr)) {
			return `${state.newline(expStr)}${state.block(() => state.indented(`.${nameStr}`))}`;
		}
		return formatStr;
	} else {
		return `${expStr}["${nameStr}"]`;
	}
}
