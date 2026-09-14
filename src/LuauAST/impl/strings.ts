import * as luau from "LuauAST/bundle";

export const strings = {
	// metamethods
	__index: luau.string("__index"),
	__tostring: luau.string("__tostring"),
	__mode: luau.string("__mode"),
	// used for __mode
	k: luau.string("k"),
	v: luau.string("v"),

	// types
	number: luau.string("number"),
	table: luau.string("table"),

	// opcall
	success: luau.string("success"),
	value: luau.string("value"),
	error: luau.string("error"),

	// other
	", ": luau.string(", "), // used for ReadonlyArray.join()
};
