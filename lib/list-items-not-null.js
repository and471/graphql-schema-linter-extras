const {
  ValidationError
} = require("graphql-schema-linter/lib/validation_error");

module.exports = { ListItemsNotNull };

function ListItemsNotNull(context) {
  return {
    ListType(node, key, parent, path, ancestors) {
      if (node.type.kind !== "NonNullType") {
        const ancestorNames = ancestors
          .concat([parent])
          .filter(it => !!it.name)
          .map(it => it.name.value);

        const p = ancestorNames.slice(ancestorNames.length - 2).join(".");

        context.reportError(
          new ValidationError(
            "list-items-not-null",
            `The list field \`${p}\` should not have nullable items.`,
            [node]
          )
        );
      }
    }
  };
}
