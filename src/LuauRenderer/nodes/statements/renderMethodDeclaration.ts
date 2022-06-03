import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatements } from "LuauRenderer/util/renderStatements";

export function renderMethodDeclaration(state: RenderState, node: luau.MethodDeclaration) {
	const objStr = render(state, node.expression);
	const paramStrs = renderParameters(state, node);

	let result = "";

	if (state.isFormattable(paramStrs.join(""))) {
		result += state.line(`function ${objStr}:${node.name}(`);
		result += state.block(() =>
			renderParameters(state, node)
				.map(p => state.line(p))
				.join(""),
		);
		result += state.line(")");
	} else {
		result += state.line(`function ${objStr}:${node.name}(${paramStrs.join("")})`);
	}

	result += state.block(() => renderStatements(state, node.statements));
	result += state.line("end");

	return result;
}
