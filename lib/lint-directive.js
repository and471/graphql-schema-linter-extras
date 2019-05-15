module.exports = { LintDirective };

function LintDirective(context) {
  const disabledStack = [new Set()];

  const originalReportError = context.reportError;
  context.reportError = function(err) {
    if (!disabledStack[disabledStack.length - 1].has(err.ruleName)) {
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
