const assert = require("assert");
const { exec } = require("child_process");
const { readFileSync } = require("fs");

describe("Basics", () => {
  it("should work", done => {
    exec(
      'sh node_modules/.bin/graphql-schema-linter -p "lib/*.js" lint-directive.gql test/schema.gql',
      (err, stdout) => {
        try {
          assert.equal(
            stdout
              .split("\n")
              .slice(1)
              .join("\n"),
            readFileSync("test/basics.stdout.txt").toString("utf-8")
          );
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});
