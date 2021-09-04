# @timhall/opa-client

`@timhall/opa-client` builds on `@open-policy-agent/opa-wasm` to add support for loading Open Policy Agent policy bundles and polling for changes.

## Example

```ts
import { OpaClient } from "@timhall/opa-client";

export const opa = new OpaClient({
  // TODO
});

const input = {};
const result = await opa.evaluate(input);
```

### Building policies / bundles

Bundles are helpful for packaging a wasm policy with json data. Bundles must be generated as wasm with the `-t wasm` flag for the `opa build` command (run `opa build --help` for more information).

- Top-level "example" entrypoint with policies directory: `opa build -t wasm -e example ./policies`
- "example/allow" entrypoint with `example.rego` file: `opa build -t wasm -e example/allow example.rego`

To generate just a wasm policy, it can be extracted from the built bundle.

- Extract `policy.wasm` from bundle: `tar -xzf ./bundle.tar.gz /policy.wasm`

## API

### `new OpaClient(options)`

TODO

Options:

- TODO

### `OpaClient::loadPolicy(policy): Promise<void>`

Load wasm policy for evaluation.

```ts
import { readFile } from "fs/promises";
import { OpaClient } from "@timhall/opa-client";

const opa = new OpaClient();

const policy = await readFile("./policy.wasm");
await opa.loadPolicy(policy);

const input = {};
const result = opa.evaluate(input);
```

### `OpaClient::setData(data)`

Set [base document](https://www.openpolicyagent.org/docs/latest/philosophy/#the-opa-document-model) for use when evaluating the policy. Overrides any previously defined data, including data from bundles.

### `OpaClient::loadBundle(bundle): Promise<void>`

Load policy bundle for evaluation. Overrides any previously loaded policy and data.

```ts
import { readFile } from "fs/promises";
import { OpaClient } from "@timhall/opa-client";

const opa = new OpaClient();

const bundle = await readFile("./bundle.tar.gz");
await opa.loadBundle(bundle);

const input = {};
const result = opa.evaluate(input);
```

### `OpaClient::evaluate(input?, entrypoint?): Promise<object>`

Evaluate the given input data against the loaded policy or bundle, with an optional entrypoint to limit the evaluation.

```ts
import { readFile } from "fs/promises";
import { OpaClient } from "@timhall/opa-client";

const opa = new OpaClient();

let result = opa.evaluate();
// result = {} with no policy/bundle

const bundle = await readFile("./bundle.tar.gz");
await opa.loadBundle(bundle);

const input = {
  subject: { email: "..." },
  operation: "GET /",
};
result = opa.evaluate(input);

// Limit the evaluation to example/allow entrypoint
result = opa.evaluate(input, "example/allow");
```
