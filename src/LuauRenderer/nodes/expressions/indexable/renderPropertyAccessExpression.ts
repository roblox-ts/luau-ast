import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { isFormattable } from "LuauRenderer/util/isFormattable";

export function renderPropertyAccessExpression(state: RenderState, node: luau.PropertyAccessExpression) {
	const expStr = render(state, node.expression);
	const nameStr = node.name;
	if (luau.isValidIdentifier(nameStr)) {
		const formatStr = `${expStr}.${nameStr}`;
		if (isFormattable(formatStr)) {
			return `${state.newline(expStr)}${state.block(() => state.indented(`.${nameStr}`))}`;
		}
		return formatStr;
	} else {
		return `${expStr}["${nameStr}"]`;
	}
}
