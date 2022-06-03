import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderPropertyAccessExpression(state: RenderState, node: luau.PropertyAccessExpression) {
	const expStr = render(state, node.expression);
	const nameStr = node.name;
	if (luau.isValidIdentifier(nameStr)) {
		if (state.isFormattable(`${expStr}.${nameStr}`)) {
			let result = "";
			result += state.newline(expStr);
			result += state.block(() => state.indented(`.${nameStr}`));
			return result;
		}
		return `${expStr}.${nameStr}`;
	} else {
		return `${expStr}["${nameStr}"]`;
	}
}
