import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderPropertyAccessExpression(state: RenderState, node: luau.PropertyAccessExpression) {
	const expStr = render(state, node.expression);
	const nameStr = node.name;
	if (luau.isValidIdentifier(nameStr)) {
		const formatStr = `${expStr}.${nameStr}`;
		if (state.isFormattable(formatStr)) {
			let result = "";
			result += state.newline(expStr);
			result += state.block(() => state.indented(`.${nameStr}`));
			return result;
		}
		return formatStr;
	} else {
		return `${expStr}["${nameStr}"]`;
	}
}
