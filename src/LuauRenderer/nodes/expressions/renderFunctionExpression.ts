import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderFunctionExpression(state: RenderState, node: luau.FunctionExpression) {
	const nameStr = "function";
	if (luau.list.isEmpty(node.statements)) {
		return `${nameStr}(${renderParameters(state, node, nameStr)}) end`;
	}

	let result = "";
	result += state.newline(`${nameStr}(${renderParameters(state, node, nameStr)})`);
	result += state.block(() => renderStatements(state, node.statements));
	result += state.indented("end");
	return result;
}
