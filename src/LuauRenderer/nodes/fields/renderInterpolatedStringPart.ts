import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { stripBackslashInEscapedNewLines } from "LuauRenderer/util/stripBackslashInEscapedNewLines";

export function renderInterpolatedStringPart(state: RenderState, node: luau.InterpolatedStringPart) {
	return (
		stripBackslashInEscapedNewLines(node.text)
			// escape braces, but do not touch braces within unicode escape codes
			.replace(/(\\u{[a-fA-F0-9]+})|([{}])/g, (_, unicodeEscape, brace) => unicodeEscape ?? "\\" + brace)
			// escape newlines, captures a CR with optionally an LF after it or just an LF on its own
			.replace(/(\r\n?|\n)/g, "\\$1")
	);
}
