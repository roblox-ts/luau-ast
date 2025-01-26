import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderTypeFunction(state: RenderState, node: luau.TypeFunction) {
	let params: string;

	if (node.parameters !== undefined) {
		const rendered = luau.list.mapToArray(node.parameters, expr => render(state, expr));
		if (node.dotDotDot) {
			rendered.push(`...${render(state, node.dotDotDot)}`);
		}
		params = rendered.join(", ");
	} else {
		if (node.dotDotDot) {
			params = `...${render(state, node.dotDotDot)}`;
		} else {
			params = "...any";
		}
	}

	return `(${params}) -> ${node.returnType ? render(state, node.returnType) : "()"}`;
}
