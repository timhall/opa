import { expect, test } from "@jest/globals";
import { OpaClient } from "../opa-client";
import { readFile } from "fs/promises";
import { resolve } from "path";

test("should evaluate with no policy or data", async () => {
	const opa = new OpaClient();
	const result = opa.evaluate();

	expect(result).toEqual({});
});

test("should load and evaluate policy and data", async () => {
	const opa = new OpaClient();

	const policy = await readFile(
		resolve(__dirname, "../__fixtures__/policy.wasm")
	);
	const data = require(resolve(__dirname, "../__fixtures__/data.json"));

	await opa.loadPolicy(policy);
	opa.setData(data);

	const result = opa.evaluate({
		subject: { principals: ["readonly"] },
		operation: "a",
	});
	expect(result).toEqual({
		allow: true,
		a: { a: true, allow: true },
		b: { allow: false },
	});
});

test("should load and evaluate bundle", async () => {
	const opa = new OpaClient();

	const bundle = await readFile(
		resolve(__dirname, "../__fixtures__/bundle.tar.gz")
	);
	await opa.loadBundle(bundle);

	const result = opa.evaluate({
		subject: { principals: ["admin"] },
		operation: "b",
	});
	expect(result).toEqual({
		allow: true,
		a: { a: true, allow: false },
		b: { b: true, allow: true },
	});
});
