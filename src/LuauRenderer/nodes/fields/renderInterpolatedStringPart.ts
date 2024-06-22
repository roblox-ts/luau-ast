import luau from "LuauAST";
import { RenderState } from "LuauRenderer";

export function renderInterpolatedStringPart(state: RenderState, node: luau.InterpolatedStringPart) {
	// escape braces and newlines, but do not touch braces within unicode escape codes
	return node.text
		.replace(
			/(\\u\{[0-9A-Fa-f]+\})|([{}])/g,
			(_, unicodeEscape: string | undefined, brace: string | undefined) => unicodeEscape ?? "\\" + brace,
		)
		.replace(/(\r\n?|\n)/g, "\\$1");
}
