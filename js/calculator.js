const OPERATIONS = ['+', '-', '*', '/']

let previousEquation = '';

let xNum = '';
let yNum = '';
let op = '';
let res = '';

function add(x, y){
    return x + y;
}

function subtract(x, y){
    return x - y;
}

function multiply(x, y){
    return x * y;
}

function divide(x, y){
    if(x == y && x == 0)
    {
        return 'IMPOSSIBLE';
    }
    return x / y;
}

function parseValue(value){
    let regex = /./;
    if(value.match(regex)){
        return parseFloat(value);
    }
    return +value;
}

function parseEquation(){
    let xValue = parseValue(xNum);
    let yValue = parseValue(yNum);
    let result = '';

    switch(op){
        case OPERATIONS[0]:
            result = add(xValue, yValue);
            break;
        case OPERATIONS[1]:
            result = subtract(xValue, yValue);
            break;
        case OPERATIONS[2]:
            result = multiply(xValue, yValue);
            break;
        case OPERATIONS[3]:
            result = divide(xValue, yValue);
            break;
    }

    return result;
}

function completeEquation(){
    if(xNum == '' || op == '' || yNum == ''){
        return;
    }

    res = parseEquation();

    previousEquation = xNum + op + yNum + "=" + res; 
    xNum = res == 'IMPOSSIBLE' ? 0 + '' : res + '';
    yNum = '';
    op = '';
    res = '';

    updateDisplay();
    fadeinDisplay();
    updateHistory();
}

function toggleDecimal(target){
    let targetArr = target.split('');
    let index = targetArr.indexOf(".");
    if(index == -1) return target += ".";
    targetArr.splice(index, 1);

    return targetArr.join(''); 
}

function updateDisplay(){
    let currentDisplay = document.querySelector('.display > .current-input');
    currentDisplay.textContent = xNum + op + yNum;
}

function updateHistory(){
    let historyDisplay = document.querySelector('.display > .history');
    historyDisplay.textContent = previousEquation;
    fadeinHistoryDisplay();
}

function fadeinDisplay(){
    let currentDisplay = document.querySelector('.display > .current-input');
    currentDisplay.classList.remove('fadein');
    currentDisplay.classList.add('fadein');
}

function fadeinHistoryDisplay(){
    let historyDisplay = document.querySelector('.display > .history');
    historyDisplay.classList.remove('fadein');
    historyDisplay.classList.add('fadein');
}

function numberPressed(eventInfo, button=undefined){
    let xOrY = op == '';
    let value = xOrY ? xNum:yNum;
    let pressValue = button == undefined ? eventInfo.target.value : button;

    if(eventInfo.target.value == "."){
        value = toggleDecimal(value);
    } else {
        value += pressValue;
    }

    if(xOrY){
        xNum = value;
    }else{
        yNum = value;
    }

    updateDisplay();
}

function opPressed(eventInfo, button=undefined){
    if(xNum == '' && yNum == '') return;
    let pressValue = button == undefined ? eventInfo.target.value : button;

    if(pressValue == "="){
        completeEquation();
    }else if(op == '' && yNum == ''){
        op = pressValue;
        updateDisplay();
    } else {
        completeEquation();
    }
}

function keyboardPress(buttonInfo){
    let numPad = document.querySelector(`.numbers input[data-num="${buttonInfo.keyCode}"]`);
    let numKey = document.querySelector(`.numbers input[data-key="${buttonInfo.keyCode}"]`);
    let opPad = document.querySelector(`.functions input[data-pad="${buttonInfo.keyCode}"]`);
    let opKey = document.querySelector(`.functions input[data-key="${buttonInfo.keyCode}"]`);
    let value = '';

    if(numPad != null || numKey != null){
        value = numPad == null ? numKey.value : numPad.value;
        numberPressed(buttonInfo, value);
    }
    else if(opPad != null || opKey != null){
        value = opPad == null ? opKey.value : opPad.value;
        opPressed(buttonInfo, value);
    }
}

function trimOne(stringValue){
    stringValue = stringValue + '';

    if(stringValue.length <= 1){
        return '';
    }

    let temp = '';
    temp = stringValue.split('');
    temp.splice(temp.length-1, 1);
    temp = temp.join('');

    return temp;
}

function erase(){
    if(yNum != ''){
        yNum = trimOne(yNum);
    }else if (op != ''){
        op = '';
    }else if(xNum != ''){
        xNum = trimOne(xNum);
    }
    updateDisplay();
}

function clearAll(){
    xNum = '';
    op = '';
    yNum = '';

    updateDisplay();
}

let numbers = Array.from(document.querySelectorAll('.numbers input[type="button"]'));
numbers.forEach((button)=>{
    button.addEventListener('click', numberPressed);
});

let functions = Array.from(document.querySelectorAll('.functions #op'));
functions.forEach((button)=>{
    button.addEventListener('click', opPressed);
});

let backspace = document.querySelector('.functions #erase');
backspace.addEventListener('click', erase);

let clear = document.querySelector('.functions #clear');
clear.addEventListener('click', clearAll);

let equals = document.querySelector('.functions #equals');
equals.addEventListener('click', completeEquation);

document.addEventListener('keypress', keyboardPress);