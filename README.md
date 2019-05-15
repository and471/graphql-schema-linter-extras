# GraphQL Schema Linter Extras

Additional rules for [graphql-schema-linter](https://github.com/cjoudrey/graphql-schema-linter,
including a directive to disable rules for specific nodes of a GraphQL schema.

## Installation and Usage

Install with `npm i graphql-schema-linter-extras -D`.

Enable the additional rules (see below) in your
[graphql-schema-linter-config](https://github.com/cjoudrey/graphql-schema-linter#configuration-file).

Use `graphql-schema-linter --custom-rule-paths node_modules/graphql-schema-linter-extras/lib/*.js <your schema>.gql` to lint a schema with the additional rules.

To use the `@lint`-directive (see below),
add the contents of `lint-directive.gql` to your schema.
Make sure `lint-directive` is the first rule in your
[graphql-schema-linter-config](https://github.com/cjoudrey/graphql-schema-linter#configuration-file).

## Rules

### `lint-directive`

Enables the `@lint`-Directive.

```graphql
# For this type, missing field descriptions are allowed
type MyType @lint(disable: ["fields-have-descriptions"]) {
  foo: String
  # This is not an ID, suppress the typed-ids rule
  notAnId: String @lint(disable: ["typed-ids"])
}
```

### `list-items-not-null`

Throws a validation error if a list field's items are nullable.
For example, `[String]` would allow `["foo", null, "baz"]`, which is rarely desired.

### `not-all-fields-null`

Throws a validation error if all fields of a type are nullable, which is rarely desired.

### `typed-ids`

Throws a validation error if a field with an `id` suffix (case-insensitive) is not of type `ID`.