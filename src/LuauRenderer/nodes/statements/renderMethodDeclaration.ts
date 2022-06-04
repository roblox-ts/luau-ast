import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderMethodDeclaration(state: RenderState, node: luau.MethodDeclaration) {
	const nameStr = render(state, node.expression);
	let result = "";
	result += state.line(`function ${nameStr}:${node.name}(${renderParameters(state, node, nameStr)})`);
	result += state.block(() => renderStatements(state, node.statements));
	result += state.line("end");
	return result;
}
