import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderTypeDeclaration(state: RenderState, node: luau.TypeStatement) {
	return state.line(`type ${render(state, node.identifier)} = ${render(state, node.expression)}`);
}
