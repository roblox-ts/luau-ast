import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderMethodDeclaration(state: RenderState, node: luau.MethodDeclaration) {
	const objStr = render(state, node.expression);
	const startStr = `function ${objStr}:${node.name}(${renderParameters(state, node).join("")})`;

	let result = "";

	if (state.isFormattable(startStr)) {
		result += state.line(`function ${objStr}:${node.name}(`);
		result += state.block(() =>
			renderParameters(state, node)
				.map(param => state.line(param))
				.join(""),
		);
		result += state.line(")");
	} else {
		result += state.line(startStr);
	}

	result += state.block(() => renderStatements(state, node.statements));
	result += state.line("end");

	return result;
}
