module.exports = {
    "extends": ["google"],
    "env": {
        "browser": true,
        "es6": true,
      },
    "rules":{
        "no-tabs": 0,
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": false,
                "MethodDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false,
                "FunctionExpression": false
            }
        }]
    }
};