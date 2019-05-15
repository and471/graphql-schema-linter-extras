const {
  ValidationError
} = require("graphql-schema-linter/lib/validation_error");

module.exports = { TypedIds };

function TypedIds(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      testTypedIds(node, key, parent, path, ancestors, context);
    },
    InputValueDefinition(node, key, parent, path, ancestors) {
      testTypedIds(node, key, parent, path, ancestors, context);
    }
  };
}

function testTypedIds(node, key, parent, path, ancestors, context) {
  const name = node.name.value;

  let type = node.type;
  while (type.type) {
    type = type.type;
  }

  if (
    !name.match(/valid$/i) &&
    name.match(/ids?$/i) &&
    type.name.value !== "ID"
  ) {
    const ancestorNames = ancestors
      .concat([parent])
      .filter(it => !!it.name)
      .map(it => it.name.value);

    const p = ancestorNames.concat([name]).join(".");

    if (node.kind === "FieldDefinition") {
      context.reportError(
        new ValidationError(
          "typed-ids",
          `The field \`${p}\` should be of type ID.`,
          [node]
        )
      );
    } else if (node.kind === "InputValueDefinition") {
      context.reportError(
        new ValidationError(
          "typed-ids",
          `The input field \`${p}\` should be of type ID.`,
          [node]
        )
      );
    }
  }
}
