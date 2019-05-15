const {
  ValidationError
} = require("graphql-schema-linter/lib/validation_error");

module.exports = { NotAllFieldsNull };

function NotAllFieldsNull(context) {
  return {
    ObjectTypeDefinition(node) {
      testNotAllFieldsNull(node, context);
    },
    InputObjectTypeDefinition(node) {
      testNotAllFieldsNull(node, context);
    }
  };
}

function testNotAllFieldsNull(node, context) {
  // ignore namespaces
  if (node.directives.filter(it => it.name.value === "namespace").length > 0) {
    return;
  }

  const nonNullableFields = node.fields.filter(field => {
    return field.type.kind === "NonNullType";
  });

  if (nonNullableFields.length === 0) {
    const kind =
      node.kind === "InputObjectTypeDefinition" ? "input object" : "object";
    context.reportError(
      new ValidationError(
        "not-all-fields-null",
        `The ${kind} type \`${
          node.name.value
        }\` should have at least one non-nullable field.`,
        [node]
      )
    );
  }
}
