import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderSet(state: RenderState, node: luau.Set) {
	if (luau.list.isEmpty(node.members)) {
		return "{}";
	}

	let result = "{\n";
	state.block(() => {
		luau.list.forEach(node.members, member => {
			if (luau.isStringLiteral(member) && luau.isValidIdentifier(member.value)) {
				result += state.line(`${member.value} = true,`);
			} else {
				result += state.line(`[${render(state, member)}] = true,`);
			}
		});
	});
	result += state.indented("}");
	return result;
}
