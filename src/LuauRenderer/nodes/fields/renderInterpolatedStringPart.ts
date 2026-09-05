import luau from "LuauAST";
import { RenderState } from "LuauRenderer";

export function renderInterpolatedStringPart(state: RenderState, node: luau.InterpolatedStringPart) {
	// consume complete escapes so an escaped backslash cannot start a unicode escape
	return node.text.replace(
		/(\\(?:u\{[a-fA-F0-9]+\}|\r\n|[\s\S]))|([{}]|\r\n?|\n)/g,
		(_, escape, character) => escape ?? "\\" + character,
	);
}
