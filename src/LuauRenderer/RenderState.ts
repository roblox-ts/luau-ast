import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { getEnding } from "LuauRenderer/util/getEnding";
import { getOrSetDefault } from "LuauRenderer/util/getOrSetDefault";

const PRINT_WIDTH = 70;
const INDENT_CHARACTER = "\t";
const INDENT_CHARACTER_LENGTH = INDENT_CHARACTER.length;

const NON_FORMATTABLE_RHS_EXPRESSIONS = new Set<luau.SyntaxKind>([
	luau.SyntaxKind.CallExpression,
	luau.SyntaxKind.MethodCallExpression,
	luau.SyntaxKind.Array,
	luau.SyntaxKind.Map,
	luau.SyntaxKind.Set,
	luau.SyntaxKind.MixedTable,
]);

/**
 * Represents the state of a rendering process.
 */
export class RenderState {
	private indent = "";
	public seenTempNodes = new Map<number, string>();
	private readonly listNodesStack = new Array<luau.ListNode<luau.Statement>>();

	/**
	 * Pushes an indent to the current indent level.
	 */
	private pushIndent() {
		this.indent += INDENT_CHARACTER;
	}

	/**
	 * Pops an indent from the current indent level.
	 */
	private popIndent() {
		this.indent = this.indent.substring(INDENT_CHARACTER_LENGTH);
	}

	private tempIdFallback = 0;

	/**
	 * Returns an unique identifier that is unused in the current scope.
	 * `this.seenTempNodes` should already be fully populated by this point!
	 * This is a fallback mechanism for when `solveTempIds()` does not catch something properly.
	 * @param node The identifier of the node
	 */
	public getTempName(node: luau.TemporaryIdentifier) {
		const name = getOrSetDefault(this.seenTempNodes, node.id, () => `_${this.tempIdFallback++}`);
		assert(name);
		return name;
	}

	/**
	 * Pushes a LuauAST node to the top of the list node stack
	 * @param listNode The syntax node to add to the stop of the stack.
	 */
	public pushListNode(listNode: luau.ListNode<luau.Statement>) {
		this.listNodesStack.push(listNode);
	}

	/**
	 * Returns the top of the scope stack.
	 */
	public peekListNode(): luau.ListNode<luau.Statement> | undefined {
		return this.listNodesStack[this.listNodesStack.length - 1];
	}

	/**
	 * Pops the top list node off the syntax tree node stack.
	 */
	public popListNode() {
		return this.listNodesStack.pop();
	}

	/**
	 * Adds a newline to the end of the string.
	 * @param text The text.
	 */
	public newline(text: string) {
		return text + "\n";
	}

	/**
	 * Prefixes the text with the current indent.
	 * @param text The text.
	 */
	public indented(text: string) {
		return this.indent + text;
	}

	/**
	 * Renders a line, adding the current indent, a semicolon if necessary, and "\n".
	 * @param text The content of the line.
	 * @param endNode Node used to determine if a semicolon should be added. Undefined means no semi will be added.
	 */
	public line(text: string, endNode?: luau.Statement) {
		let result = this.indented(text);
		if (endNode) {
			result += getEnding(this, endNode);
		}
		result = this.newline(result);
		return result;
	}

	/**
	 * Returns a rendered code block.
	 * @param callback The function used to render the block.
	 */
	public block<T>(callback: () => T) {
		this.pushIndent();
		const result = callback();
		this.popIndent();
		return result;
	}

	/**
	 * Checks to see if `text` can be formatted.
	 *
	 * If a `expressionKind` value is passed, it will also check to see if the right-hand side expression can be formated.
	 * @param text The text.
	 * @param expressionKind The kind of the right-hand side expression.
	 * @param skipCheck If set to true, the result will be always formattable.
	 */
	public isFormattable(text: string, expressionKind?: keyof luau.ExpressionByKind, skipCheck = false) {
		if (skipCheck) return true;
		const isLongStr = text.length > PRINT_WIDTH;
		if (expressionKind !== undefined) {
			return isLongStr && !NON_FORMATTABLE_RHS_EXPRESSIONS.has(expressionKind);
		}
		return isLongStr;
	}
}
