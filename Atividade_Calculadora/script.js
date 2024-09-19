const num1 = document.getElementById("number1");
const num2 = document.getElementById("number2");
const opc = document.getElementById("opcao");
const calc = document.getElementById("calc");

function somar(num1, num2){
    return num1 + num2;
}

function sub(num1, num2){
    return num1 - num2;
}

function div(num1, num2){

    if(num1 == 0 || num2 == 0){
        alert("Impossivel dividir por 0") 
    }
    return num1 / num2;
}

function mult(num1, num2){
    return num1 * num2;
}



calc.addEventListener("click", ()=> {

    const valor1 = parseFloat(num1.value);
    const valor2 = parseFloat(num2.value);
    const operacao = opc.value;
    let result = 0;

    if(operacao === "som"){
        result = somar(valor1, valor2);
    }
    else if(operacao === "sub"){
        result = sub(valor1, valor2);
    }
    else if(operacao === "mult"){
        result = mult(valor1, valor2);
    }
    else if(operacao === "div"){
        result = div(valor1, valor2);
    }

    const resultado = document.getElementById("result");

    resultado.textContent = result;
    
    

})