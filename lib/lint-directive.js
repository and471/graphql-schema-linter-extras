module.exports = { LintDirective };

function LintDirective(context) {
  const disabledStack = [new Set()];

  /** 
   * Because the "defined-types-are-used" rule's error is thrown on the 
   * GraphQL document, the rule won't be present in the disabledStack. 
   * Hence we have to look at the node that caused the error and check that
   * it contains the disable rule
  **/
  const definedTypesAreUsedIsDisabled = function(err) {
    // Find the lint directive
    const lintDirective = err.nodes[0].directives.find(
      directive => directive.name.value === 'lint'
    );

    if (!lintDirective) return false;

    // Find the disable argument
    const disableArgument = lintDirective.arguments.find(
      argument => argument.name && argument.name.value === 'disable'
    );

    if (!disableArgument) return false;

    // Return true if the 'defined-types-are-used' rule is present
    return disableArgument.value.values && disableArgument.value.values.find(
      stringValue => stringValue.value === 'defined-types-are-used'
    );
  };

  const originalReportError = context.reportError;
  context.reportError = function(err) {
    if (!(disabledStack[disabledStack.length - 1].has(err.ruleName) || 
        err.ruleName === "defined-types-are-used" && definedTypesAreUsedIsDisabled(err))) 
    {
      return originalReportError.apply(this, arguments);
    }
  };

  return {
    enter(node) {
      const directives = node.directives || [];
      const lint = directives.find(it => it.name.value === "lint") || {
        arguments: []
      };
      const disable = lint.arguments.find(
        it => it.name.value === "disable"
      ) || { value: { values: [] } };
      const enable = lint.arguments.find(it => it.name.value === "enable") || {
        value: { values: [] }
      };
      const next = new Set(disabledStack[disabledStack.length - 1]);
      for (const rule of disable.value.values) {
        next.add(rule.value);
      }
      for (const rule of enable.value.values) {
        next.delete(rule.value);
      }
      disabledStack.push(next);
    },
    leave() {
      disabledStack.pop();
    }
  };
}
