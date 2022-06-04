import { RenderState } from "LuauAST";

/**
 * Utility function that takes a list of string values
 * and removes the space at the final of each string if the result is formattable.
 * @param state The render state.
 * @param renderList The renderer callback.
 * @param name The name of the function.
 */
export function renderFunction(state: RenderState, renderList: () => ReadonlyArray<string>, name?: string) {
	const list = renderList();
	if (state.isFormattable(`${name ?? ""}(${renderList().join(", ")})`)) {
		let result = "\n";
		state.block(() => {
			renderList().forEach((v, i) => (result += state.line(`${v}${i < list.length - 1 ? "," : ""}`)));
		});
		result += state.indented("");
		return result;
	}
	return list.join(", ");
}
