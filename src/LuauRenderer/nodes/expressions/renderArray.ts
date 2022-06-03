import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { format } from "LuauRenderer/util/format";

export function renderArray(state: RenderState, node: luau.Array) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	const getMembers = () => luau.list.mapToArray(node.members, member => render(state, member)).map(format(state));
	const arrStr = getMembers().join("");
	const hasFunctionExpression = luau.list.some(
		node.members,
		member => luau.isFunctionExpression(member) && !luau.list.isEmpty(member.statements),
	);

	if (state.isFormattable(`{ ${arrStr} }`, undefined, hasFunctionExpression)) {
		let result = "";
		result += state.newline("{");
		result += state.block(() =>
			getMembers()
				.map(value => state.line(value))
				.join(""),
		);
		result += state.indented("}");
		return result;
	}

	return `{ ${arrStr} }`;
}
