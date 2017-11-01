$(document).ready(function () {
    var calc = $('.frame');
    var numberKeys = calc.find(".number");
    var operationKeys = calc.find(".operation");
    var displayRes = calc.find("#result");
    var displayExpr = calc.find("#expression");
    var clearAll = calc.find("#clear_all");

    var opStack = [];
    var numStack = [];
    var acc = "";
    var sign = 1;
    var waitingNumber = false;

/*
Algorithm of Bauer and Zamelzon
http://algolist.manual.ru/syntax/parsear.php
*/
    var operationsDict = {
      "=": { "=": f6,
             "(": f5,
             "+": f4,
             "-": f4,
             "*": f4,
             "/": f4 },

      "(": { "=": f1,
             "(": f1,
             "+": f1,
             "-": f1,
             "*": f1,
             "/": f1 },

      "+": { "=": f1,
             "(": f1,
             "+": f2,
             "-": f2,
             "*": f4,
             "/": f4 },

      "-": { "=": f1,
             "(": f1,
             "+": f2,
             "-": f2,
             "*": f4,
             "/": f4 },

      "*": { "=": f1,
             "(": f1,
             "+": f1,
             "-": f1,
             "*": f2,
             "/": f2 },

      "/": { "=": f1,
             "(": f1,
             "+": f1,
             "-": f1,
             "*": f2,
             "/": f2 },

      ")": { "=": f5,
             "(": f3,
             "+": f4,
             "-": f4,
             "*": f4,
             "/": f4 }
    };

    function clearDisplay() {
        displayExpr.text("")
        displayRes.text("")
        acc = "";
        waitingNumber = false;
        sign = 1;
        opStack = [];
        numStack = [];
    }

    numberKeys.on("click", function() {
        var that = $(this);

        if (displayRes.text() != "") { clearDisplay(); }

        var val = that.attr("value");
        acc += val;
        txt = displayExpr.text();
        displayExpr.text(txt + val)
        waitingNumber = false;
    });

    function callTableFunc(curOperation) {
        opStackTop = "=";
        if (opStack.length) {
          opStackTop = opStack[opStack.length - 1];
        }

        func = operationsDict[curOperation][opStackTop];
        func(curOperation);
    }

    operationKeys.on("click", function() {
        var that = $(this);
        if (displayRes.text() != "") { clearDisplay(); }
        var curOperation = that.attr("value");

        txt = displayExpr.text();
        newText = txt + curOperation
        displayExpr.text(newText)
        console.log(newText);

        if (acc) {
          numStack.push(parseFloat(acc) * sign);
          sign = 1;
          acc = "";
          console.log(numStack);
        }

        var isExpressionStart = (!opStack.length && !numStack.length);

        if ((isExpressionStart || waitingNumber) && curOperation === "-") {
            sign *= -1;
            return;
        }

        if (curOperation != ")") {
            waitingNumber = true;
        }

        callTableFunc(curOperation);

        if (curOperation === "=") {
            var res = numStack.pop();
            displayRes.text(res.toFixed(2));
            opStack = [];
            numStack = [];
        }
    });

    clearAll.on("click", function() {
        clearDisplay();
    });

    function oper(operation, operand1, operand2) {
        result = 0;
        switch (operation) {
            case "+":
                result = operand1 + operand2;
                break;
            case "-":
                result = operand2 - operand1;
                break;
            case "*":
                result = operand1 * operand2;
                break;
            case "/":
                result = operand2 / operand1;
                break;
            default:
                break;
        }

        return result;
    }

    // add operation to stack of operations
    function f1(curOperation) {
        if (waitingNumber && sign === -1 && curOperation === "(") {
            opStack.push("*");
            numStack.push(-1);
            sign = 1;
            waitingNumber = false;
        }
        opStack.push(curOperation);
        console.log("operation stack: " + opStack);
    }

    function f2(curOperation) {
        opStackTop = opStack.pop();
        num1 = numStack.pop();
        num2 = numStack.pop();
        res = oper(opStackTop, num1, num2);
        numStack.push(res);
        console.log("number stack: " + numStack);
        opStack.push(curOperation);
        console.log("operation stack: " + opStack);
    }

    function f3(curOperation) {
        opStack.pop();
    }

    function f4(curOperation) {
        opStackTop = opStack.pop();
        num1 = numStack.pop();
        num2 = numStack.pop();
        res = oper(opStackTop, num1, num2);
        numStack.push(res);
        console.log("number stack: " + numStack);
        callTableFunc(curOperation);
    }

    function f5(curOperation) {
        displayRes.text("Error");
    }

    function f6(curOperation) {}
});
