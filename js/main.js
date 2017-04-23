/**
 * Created by Ivan on 10/04/2017.
 */

var numFichas = 0;
var puntuacion = 0;
var situados = false;
var hayMovimientos = false;
var arrayHuecos;
var arrayFichas;
var seleccionada = null;

function dibujaTablero() {
    //Se dibuja el tablero al cargarse la pagina
    var i, j;
    var tablero = "";
    document.getElementById('tablero').innerHTML = "";

    for (i = 1; i <= 7; i++) {
        for (j = 1; j <= 7; j++) {
            if (i < 3 || i > 5) {
                if (j < 3 || j > 5) {
                    tablero += "<img id='" + i + j + "' class='hueco_oculto' src='img/hueco.png' width=90 height=90>";
                } else {
                    tablero += "<img id='" + i + j + "' class='hueco' src='img/hueco.png' width=90 height=90>";
                }
            }
            else {
                tablero += "<img id='" + i + j + "' class='hueco' src='img/hueco.png' width=90 height=90>";
            }
        }
        tablero += "<br />"
    }
    document.getElementById('tablero').innerHTML = tablero;
}

function situar() {
    //Permite situar las bolas en el tablero
    dibujaTablero();
    numFichas = 0;
    document.getElementById("puntos").innerHTML = "0";
    var huecos = document.getElementsByClassName("hueco");

    for (var i = 0; i < huecos.length; i++) {
        huecos[i].removeEventListener("click", mueveFicha);
        huecos[i].removeEventListener("click", fichaSeleccionada);
        huecos[i].addEventListener("click", cambiaFicha);
    }
}

function cambiaFicha(elEvento) {
    //Cambia la imagen y la clase cuando pulsas sobre un hueco
    var evento = elEvento || window.event;
    var fuente = evento.target;

    if (fuente.className === "hueco" && numFichas < 32) {
        fuente.src = "img/batman.png";
        fuente.className = "ficha";
        numFichas++;
        situados = true;
    } else {
        if (fuente.className === "ficha") {
            fuente.src = "img/hueco.png";
            fuente.className = "hueco";
            numFichas--;
            if (numFichas <= 1) {
                situados = false;
            }
        }
    }
}

function jugar() {

    var minutos = parseInt(document.getElementById("tiempo").value);
    var total = minutos*60;

    if (total) {
        var id = setInterval(function () {
            if (total === 0) {
                clearInterval(id);
                var fichasRestantes = document.getElementsByClassName("ficha");
                puntuacion -= (fichasRestantes.length * 50);

                if (puntuacion > 0) {
                    document.getElementById("puntos").style.color = "#3af900";
                } else {
                    document.getElementById("puntos").style.color = "#ff0000";
                }

                document.getElementById("puntos").innerHTML = puntuacion;
                for (var i = 0; i < fichasRestantes.length; i++) {
                    fichasRestantes[i].removeEventListener("click", fichaSeleccionada);
                }
                alert("GAME OVER");
            } else {
                total = total - 1;
                document.getElementById('segundos').innerHTML = total.toString();
            }
        }, 1000);
    }

    document.getElementById("puntos").style.color = "black";
    var huecoCentro = document.getElementById("centro").checked;
    var huecoAleatorio = document.getElementById("aleatorio").checked;

    if (situados === true && numFichas === 1) {
        alert("Enhorabuena, tu madre tuvo un idiota");
        situados = false;
    } else if (situados === true && numFichas > 1) {
        situados = false;
    } else {
        if (huecoCentro) {
            juegaHuecoCentral();
            numFichas = 32;
        } else if (huecoAleatorio) {
            juegaHuecoAleatorio();
            numFichas = 32;
        }
    }

    arrayHuecos = document.getElementsByClassName("hueco");
    arrayFichas = document.getElementsByClassName("ficha");

    for (var i = 0; i < arrayFichas.length; i++) {
        arrayFichas[i].removeEventListener("click",cambiaFicha);
        arrayFichas[i].addEventListener("click", this.fichaSeleccionada);
    }

    for (i = 0; i < arrayHuecos.length; i++) {
        arrayHuecos[i].removeEventListener("click", cambiaFicha);
        arrayHuecos[i].addEventListener("click", this.mueveFicha);
    }

    puntuacion = 0;
    document.getElementById("puntos").innerHTML = puntuacion;
}

this.fichaSeleccionada = function (event) {
    var evento = event.target;

    if (evento.className === "ficha") {
        if (seleccionada === null) {
            evento.src = "img/batman_clicked.png";
            evento.className = "seleccionada";
            seleccionada = evento.id;
        } else {
            document.getElementById(seleccionada).src = "img/batman.png";
            document.getElementById(seleccionada).className = "ficha";
            evento.src = "img/batman_clicked.png";
            evento.className = "seleccionada";
            seleccionada = evento.id;
        }
    }
}

this.mueveFicha = function (event) {

    var evento = event.target;
    var huecoSeleccionado = evento.id;
    var hueco = document.getElementById(huecoSeleccionado);

    var fichaSelecc = document.getElementById(seleccionada);

    var filaHueco = parseInt(huecoSeleccionado.slice(0, 1));
    var columnaHueco = parseInt(huecoSeleccionado.slice(1, 2));

    var filaFicha = parseInt(seleccionada.slice(0, 1));
    var columnaFicha = parseInt(seleccionada.slice(1, 2));

    var columnaPosible, filaPosible, posibleFicha;

    if (seleccionada !== null && (hueco.className === "hueco")) {
        if (filaHueco === filaFicha) {
            if ((columnaHueco - columnaFicha) === 2) {
                columnaPosible = columnaFicha + 1;
                posibleFicha = document.getElementById(filaFicha.toString() + columnaPosible.toString());
                if (posibleFicha.className === "ficha") {
                    efectuaMovimiento(hueco, fichaSelecc, posibleFicha);
                } else {
                    alert("Movimiento invalido");
                }
            } else if ((columnaHueco - columnaFicha) === -2) {
                columnaPosible = columnaFicha - 1;
                posibleFicha = document.getElementById(filaFicha.toString() + columnaPosible.toString());
                if (posibleFicha.className === "ficha") {
                    efectuaMovimiento(hueco, fichaSelecc, posibleFicha);
                } else {
                    alert("Movimiento invalido");
                }
            }
        } else if (columnaHueco === columnaFicha) {
            if ((filaHueco - filaFicha) === 2) {
                filaPosible = filaFicha + 1;
                posibleFicha = document.getElementById(filaPosible.toString() + columnaFicha.toString());
                if (posibleFicha.className === "ficha") {
                    efectuaMovimiento(hueco, fichaSelecc, posibleFicha);
                } else {
                    alert("Movimiento invalido");
                }
            } else if ((filaHueco - filaFicha) === -2) {
                filaPosible = filaFicha - 1;
                posibleFicha = document.getElementById(filaPosible.toString() + columnaFicha.toString());
                if (posibleFicha.className === "ficha") {
                    efectuaMovimiento(hueco, fichaSelecc, posibleFicha);
                } else {
                    alert("Movimiento invalido");
                }
            }
        }
    }

    if (numFichas === 1) {
        if (document.getElementById("44").className === "ficha") {
            puntuacion += 150;
        }

        if (puntuacion > 0) {
            document.getElementById("puntos").style.color = "#3af900";
        } else {
            document.getElementById("puntos").style.color = "#ff0000";
        }
        document.getElementById("puntos").innerHTML = puntuacion;
        alert("HAS GANADO");
    } else if (!compruebaMovPosibles()) {
        var fichasRestantes = document.getElementsByClassName("ficha");
        puntuacion -= (fichasRestantes.length*50);

        if (puntuacion > 0) {
            document.getElementById("puntos").style.color = "#3af900";
        } else {
            document.getElementById("puntos").style.color = "#ff0000";
        }

        for (var i = 0; i < fichasRestantes.length; i++) {
            fichasRestantes[i].removeEventListener("click", fichaSeleccionada);
        }

        document.getElementById("puntos").innerHTML = puntuacion;
        alert("GAME OVER");
    }

    document.getElementById("puntos").innerHTML = puntuacion;
}

function efectuaMovimiento (hueco, fichaSelecc, posibleFicha) {
    //cambia hueco por ficha
    hueco.src = "img/batman.png";
    hueco.className = "ficha";
    hueco.removeEventListener("click", mueveFicha);
    hueco.addEventListener("click", fichaSeleccionada);

    //cambia ficha en medio por hueco
    posibleFicha.src = "img/hueco.png";
    posibleFicha.className = "hueco";
    posibleFicha.removeEventListener("click", fichaSeleccionada);
    posibleFicha.addEventListener("click", mueveFicha);

    //cambia ficha por hueco
    fichaSelecc.src = "img/hueco.png";
    fichaSelecc.className = "hueco";
    fichaSelecc.removeEventListener("click",fichaSeleccionada);
    fichaSelecc.addEventListener("click", mueveFicha);

    seleccionada = null;

    puntuacion += 15;
    numFichas--;
}

function juegaHuecoCentral () {

    var i,j;
    var tablero = "";
    document.getElementById('tablero').innerHTML = "";

    for (i = 1; i <= 7; i++) {
        for (j = 1; j <= 7; j++) {
            if (i < 3 || i > 5) {
                if (j < 3 || j > 5) {
                    tablero += "<img id='" + i + j + "' class='hueco_oculto' src='img/hueco.png' width=90 height=90>";
                } else {
                    tablero += "<img id='" + i + j + "' class='ficha' src='img/batman.png' width=90 height=90>";
                }
            } else {
                if (i === 4 && j === 4) {
                    tablero += "<img id='" + i + j + "' class='hueco' src='img/hueco.png' width=90 height=90>";
                } else {
                    tablero += "<img id='" + i + j + "' class='ficha' src='img/batman.png' width=90 height=90>";
                }
            }
        }
        tablero += "<br />"
    }
    document.getElementById('tablero').innerHTML = tablero;
}

function juegaHuecoAleatorio() {

    var i,j, fila, columna;
    var tablero = "";
    document.getElementById('tablero').innerHTML = "";

    fila = Math.floor((Math.random()*7) + 1);

    if (fila < 3 || fila > 5) {
        columna = Math.floor((Math.random()*3) + 3);
    } else {
        columna = Math.floor((Math.random()*7) + 1);
    }

    for (i = 1; i <= 7; i++) {
        for (j = 1; j <= 7; j++) {
            if (i < 3 || i > 5) {
                if (j < 3 || j > 5) {
                    tablero += "<img id='" + i + j + "' class='hueco_oculto' src='img/hueco.png' width=90 height=90>";
                } else {
                    if (fila === i && columna === j) {
                        tablero += "<img id='" + i + j + "' class='hueco' src='img/hueco.png' width=90 height=90>";
                    } else {
                        tablero += "<img id='" + i + j + "' class='ficha' src='img/batman.png' width=90 height=90>";
                    }
                }
            } else {
                if (i === fila && j === columna) {
                    tablero += "<img id='" + i + j + "' class='hueco' src='img/hueco.png' width=90 height=90>";
                } else {
                    tablero += "<img id='" + i + j + "' class='ficha' src='img/batman.png' width=90 height=90>";
                }
            }
        }
        tablero += "<br />"
    }
    document.getElementById('tablero').innerHTML = tablero;
}

function compruebaMovPosibles() {

    var i;
    var hueco;
    var filaHueco, columnaHueco;
    var filaArriba, filaAbajo, columnaDer, columnaIzq;
    var fichaArriba, fichaAbajo, fichaDer, fichaIzq;
    var fichaBorrarArriba, fichaBorrarAbajo, fichaBorrarDer, fichaBorrarIzq;
    arrayHuecos = document.getElementsByClassName("hueco");
    hayMovimientos = false;

    for (i = 0; i < arrayHuecos.length && !hayMovimientos; i++) {
        hueco = arrayHuecos[i].id;
        filaHueco = parseInt(hueco.slice(0, 1));
        columnaHueco = parseInt(hueco.slice(1, 2));
        filaArriba = filaHueco - 1;
        filaAbajo = filaHueco + 1;
        columnaIzq = columnaHueco - 1;
        columnaDer = columnaHueco + 1;
        fichaArriba = document.getElementById(filaArriba.toString() + columnaHueco);
        fichaAbajo = document.getElementById(filaAbajo.toString() + columnaHueco);
        fichaDer = document.getElementById(filaHueco + columnaDer.toString());
        fichaIzq = document.getElementById(filaHueco + columnaIzq.toString());

        filaArriba = filaHueco - 2;
        filaAbajo = filaHueco + 2;
        columnaIzq = columnaHueco - 2;
        columnaDer = columnaHueco + 2;
        fichaBorrarArriba = document.getElementById(filaArriba.toString() + columnaHueco);
        fichaBorrarAbajo = document.getElementById(filaAbajo.toString() + columnaHueco);
        fichaBorrarDer = document.getElementById(filaHueco + columnaDer.toString());
        fichaBorrarIzq = document.getElementById(filaHueco + columnaIzq.toString());

        if ((fichaArriba && fichaArriba.className === "ficha") && (fichaBorrarArriba && fichaBorrarArriba.className === "ficha")) {
            hayMovimientos = true;
        } else if ((fichaAbajo && fichaAbajo.className === "ficha") && (fichaBorrarAbajo && fichaBorrarAbajo.className === "ficha")) {
            hayMovimientos = true
        } else if ((fichaDer && fichaDer.className === "ficha") && (fichaBorrarDer && fichaBorrarDer.className === "ficha")) {
            hayMovimientos = true;
        } else if ((fichaIzq && fichaIzq.className === "ficha") && (fichaBorrarIzq && fichaBorrarIzq.className === "ficha")) {
            hayMovimientos = true;
        }
    }
    return hayMovimientos;
}