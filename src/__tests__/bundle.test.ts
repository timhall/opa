import { expect, test } from "@jest/globals";
import { parseBundle } from "../bundle";
import { resolve } from "path";
import { readFile } from "fs/promises";

test("should extract policy and data from bundle", async () => {
	const policyPath = resolve(__dirname, "../__fixtures__/policy.wasm");
	const policy = await readFile(policyPath);
	const data = require(resolve(__dirname, "../__fixtures__/data.json"));

	const bundlePath = resolve(__dirname, "../__fixtures__/bundle.tar.gz");
	const bundleData = await readFile(bundlePath);
	const bundle = await parseBundle(bundleData);

	expect(bundle.policy).toEqual(policy);
	expect(bundle.data).toEqual(data);
});
