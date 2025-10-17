import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../public/css/main.css';
import '../public/js/main.js';
import Game from './game.js';
import Swal from 'sweetalert2';

// Variables globales
let player1;
let player2;
let personaje1 = "";
let personaje2 = ""; 
let victoriasJugador1 = 0;
let victoriasJugador2 = 0;
let turnoActual = 1;

// Elementos del DOM
const btn_py1 = document.getElementById("btn_py1");
const btn_py2 = document.getElementById("btn_py2");
const seleccion1 = document.getElementById("seleccion_personaje1");
const seleccion2 = document.getElementById("seleccion_personaje2");

// Función para cambiar la selección visual de personajes
const cambiarSeleccion = (botones, seleccionado) => {
    botones.forEach(btn => {
        if (seleccionado === btn.querySelector("img").title) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
};

// Event listeners para selección de personajes del jugador 1
seleccion1.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", (evento) => {
        cambiarSeleccion(
            seleccion1.querySelectorAll("button"),
            evento.target.title,
            "btn-danger"
        );
        personaje1 = evento.target.title;
        console.log(`Jugador 1 seleccionó: ${personaje1}`);
    });
});

// Event listeners para selección de personajes del jugador 2
seleccion2.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", (evento) => {
        cambiarSeleccion(
            seleccion2.querySelectorAll("button"),
            evento.target.title,
            "btn-primary"
        );
        personaje2 = evento.target.title;
        console.log(`Jugador 2 seleccionó: ${personaje2}`);
    });
});

// Función para actualizar contador de semillas
const actualizarContadorSemillas = (jugador, numeroJugador) => {
    const contadorSemillas = document.getElementById(`contador_semillas_${numeroJugador}`);
    if (contadorSemillas) {
        contadorSemillas.textContent = jugador.semillas;
        
        const btnSemilla = document.getElementById(`btn_semilla_${numeroJugador}`);
        if (btnSemilla) {
            btnSemilla.disabled = jugador.semillas <= 0;
        }
    }
};

// Función para actualizar las barras de progreso
const actualizarBarras = (jugador, numeroJugador) => {
    const vidaPorcentaje = jugador.get_porcentaje_vida();
    const energiaPorcentaje = jugador.get_porcentaje_energia();
    const kiPorcentaje = jugador.get_porcentaje_ki();
    
    const barraVida = document.querySelector(`#stats_jugador${numeroJugador} .barra-vida .progress-bar`);
    if (barraVida) {
        barraVida.style.width = `${vidaPorcentaje}%`;
        barraVida.textContent = `${Math.round(vidaPorcentaje)}%`;
        
        if (vidaPorcentaje <= 25) {
            barraVida.style.background = 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)';
        } else if (vidaPorcentaje <= 50) {
            barraVida.style.background = 'linear-gradient(90deg, #ffc107 0%, #ff9800 100%)';
        } else {
            barraVida.style.background = 'linear-gradient(90deg, #28a745 0%, #20c997 100%)';
        }
    }
    
    const barraEnergia = document.querySelector(`#stats_jugador${numeroJugador} .barra-energia .progress-bar`);
    if (barraEnergia) {
        barraEnergia.style.width = `${energiaPorcentaje}%`;
        barraEnergia.textContent = `${Math.round(energiaPorcentaje)}%`;
    }
    
    const barraKi = document.querySelector(`#stats_jugador${numeroJugador} .barra-ki .progress-bar`);
    if (barraKi) {
        barraKi.style.width = `${kiPorcentaje}%`;
        barraKi.textContent = `${Math.round(kiPorcentaje)}%`;
    }
    
    actualizarContadorSemillas(jugador, numeroJugador);
};

// Función para verificar y mostrar las estadísticas
const verificarYMostrarStats = () => {
    if (player1 && player2 && personaje1 !== "" && personaje2 !== "") {
        document.getElementById("seleccion_jugadores").classList.add("d-none");
        
        const statsSection = document.getElementById("seccion_batalla");
        if (statsSection) {
            statsSection.classList.add("mostrar-stats");
            statsSection.style.display = "flex";
            
            actualizarBarras(player1, 1);
            actualizarBarras(player2, 2);
            
            if (window.cambiarFondoAleatorio) {
                window.cambiarFondoAleatorio();
            }
            
            Swal.fire({
                icon: 'success',
                title: '¡Que comience la batalla!',
                html: `<p style="font-size: 1.2em;">${player1.username} VS ${player2.username}</p>
                       <p style="font-size: 0.9em; color: #666;">Cada jugador tiene 3 Semillas del Ermitaño 🌱</p>`,
                timer: 3000,
                showConfirmButton: false
            });
            
            inicializarBotonesAtaque();
        }
    }
};

// Función para ocultar selección del jugador 1
const ocultar_seleccion1 = () => {
    if (player1 && personaje1 !== "") {
        document.getElementById("jugador1").classList.add("d-none");
        document.getElementById("nombre_personaje1").innerText = personaje1;
        verificarYMostrarStats();
    }
};

// Función para ocultar selección del jugador 2
const ocultar_seleccion2 = () => {
    if (player2 && personaje2 !== "") {
        document.getElementById("jugador2").classList.add("d-none");
        document.getElementById("nombre_personaje2").innerText = personaje2;
        verificarYMostrarStats();
    }
};

// Función para verificar ganador
const verificarGanador = () => {
    if (!player1.esta_vivo()) {
        victoriasJugador2++;
        actualizarContadorVictorias();
        
        Swal.fire({
            icon: 'success',
            title: `¡${player2.username} gana!`,
            html: `<p style="font-size: 1.5em;">🏆 ${personaje2} es el vencedor 🏆</p>
                   <p style="font-size: 1em; margin-top: 10px;">
                       <span style="color: #dc2626;">🔴 ${player1.username}: ${victoriasJugador1}</span> - 
                       <span style="color: #2563eb;">🔵 ${player2.username}: ${victoriasJugador2}</span>
                   </p>`,
            showDenyButton: true,
            confirmButtonText: '🔄 Revancha',
            denyButtonText: '👥 Elegir Personajes',
            confirmButtonColor: '#28a745',
            denyButtonColor: '#3b82f6',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                revancha();
            } else if (result.isDenied) {
                elegirPersonajes();
            }
        });
        return true;
    }
    
    if (!player2.esta_vivo()) {
        victoriasJugador1++;
        actualizarContadorVictorias();
        
        Swal.fire({
            icon: 'success',
            title: `¡${player1.username} gana!`,
            html: `<p style="font-size: 1.5em;">🏆 ${personaje1} es el vencedor 🏆</p>
                   <p style="font-size: 1em; margin-top: 10px;">
                       <span style="color: #dc2626;">🔴 ${player1.username}: ${victoriasJugador1}</span> - 
                       <span style="color: #2563eb;">🔵 ${player2.username}: ${victoriasJugador2}</span>
                   </p>`,
            showDenyButton: true,
            confirmButtonText: '🔄 Revancha',
            denyButtonText: '👥 Elegir Personajes',
            confirmButtonColor: '#28a745',
            denyButtonColor: '#3b82f6',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                revancha();
            } else if (result.isDenied) {
                elegirPersonajes();
            }
        });
        return true;
    }
    
    return false;
};

// Función para actualizar contador de victorias
const actualizarContadorVictorias = () => {
    const contadorVictorias1 = document.getElementById("victorias_jugador1");
    if (contadorVictorias1) {
        contadorVictorias1.textContent = victoriasJugador1;
    }
    
    const contadorVictorias2 = document.getElementById("victorias_jugador2");
    if (contadorVictorias2) {
        contadorVictorias2.textContent = victoriasJugador2;
    }
};

// Función para cambiar turno
const cambiarTurno = () => {
    turnoActual = turnoActual === 1 ? 2 : 1;
    const nombreTurno = turnoActual === 1 ? player1.username : player2.username;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    Toast.fire({
        icon: 'info',
        title: `Turno de ${nombreTurno}`
    });
};

// Función para revancha
const revancha = () => {
    const username1 = player1.username;
    const username2 = player2.username;
    const personajeGuardado1 = personaje1;
    const personajeGuardado2 = personaje2;
    
    turnoActual = 1;
    
    player1 = new Game(username1);
    player2 = new Game(username2);
    
    personaje1 = personajeGuardado1;
    personaje2 = personajeGuardado2;
    
    actualizarBarras(player1, 1);
    actualizarBarras(player2, 2);
    
    inicializarBotonesAtaque();
    
    if (window.cambiarFondoAleatorio) {
        window.cambiarFondoAleatorio();
    }
    
    Swal.fire({
        icon: 'success',
        title: '¡Revancha!',
        html: `<p style="font-size: 1.2em;">${username1} (${personaje1}) VS ${username2} (${personaje2})</p>
               <p style="font-size: 0.9em; color: #666;">¡A pelear! 🔄</p>`,
        timer: 2500,
        showConfirmButton: false
    });
};

// Función para elegir nuevos personajes
const elegirPersonajes = () => {
    const username1 = player1.username;
    const username2 = player2.username;
    
    personaje1 = "";
    personaje2 = "";
    turnoActual = 1;
    
    const statsSection = document.querySelector(".row.justify-content-around:not(#seleccion_jugadores)");
    if (statsSection) {
        statsSection.classList.remove("mostrar-stats");
        statsSection.style.display = "none";
    }
    
    const seleccionJugadores = document.getElementById("seleccion_jugadores");
    if (seleccionJugadores) {
        seleccionJugadores.classList.remove("d-none");
    }
    
    const jugador1Div = document.getElementById("jugador1");
    if (jugador1Div) {
        jugador1Div.classList.remove("d-none");
        document.getElementById("username_py1").value = username1;
    }
    
    const jugador2Div = document.getElementById("jugador2");
    if (jugador2Div) {
        jugador2Div.classList.remove("d-none");
        document.getElementById("username_py2").value = username2;
    }
    
    seleccion1.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-danger");
    });
    
    seleccion2.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-primary");
    });
    
    player1 = null;
    player2 = null;
    
    if (window.cambiarFondoAleatorio) {
        window.cambiarFondoAleatorio();
    }
    
    Swal.fire({
        icon: 'info',
        title: '¡Seleccionen nuevos guerreros!',
        html: `<p style="font-size: 1em;">${username1} y ${username2}</p>
               <p style="font-size: 0.9em; color: #666;">Elijan sus nuevos personajes 🎮</p>`,
        timer: 2500,
        showConfirmButton: false
    });
};

// Función para inicializar botones de ataque
const inicializarBotonesAtaque = () => {
    const btnAtaqueBasico1 = document.getElementById("btn_ataque_basico_1");
    const btnAtaqueEspecial1 = document.getElementById("btn_ataque_especial_1");
    const btnRegenerar1 = document.getElementById("btn_regenerar_1");
    const btnSemilla1 = document.getElementById("btn_semilla_1");
    
    const btnAtaqueBasico2 = document.getElementById("btn_ataque_basico_2");
    const btnAtaqueEspecial2 = document.getElementById("btn_ataque_especial_2");
    const btnRegenerar2 = document.getElementById("btn_regenerar_2");
    const btnSemilla2 = document.getElementById("btn_semilla_2");
    
    if (btnAtaqueBasico1) {
        const nuevoBtn1 = btnAtaqueBasico1.cloneNode(true);
        btnAtaqueBasico1.parentNode.replaceChild(nuevoBtn1, btnAtaqueBasico1);
    }
    if (btnAtaqueEspecial1) {
        const nuevoBtn2 = btnAtaqueEspecial1.cloneNode(true);
        btnAtaqueEspecial1.parentNode.replaceChild(nuevoBtn2, btnAtaqueEspecial1);
    }
    if (btnRegenerar1) {
        const nuevoBtn3 = btnRegenerar1.cloneNode(true);
        btnRegenerar1.parentNode.replaceChild(nuevoBtn3, btnRegenerar1);
    }
    if (btnSemilla1) {
        const nuevoBtn4 = btnSemilla1.cloneNode(true);
        btnSemilla1.parentNode.replaceChild(nuevoBtn4, btnSemilla1);
    }
    if (btnAtaqueBasico2) {
        const nuevoBtn5 = btnAtaqueBasico2.cloneNode(true);
        btnAtaqueBasico2.parentNode.replaceChild(nuevoBtn5, btnAtaqueBasico2);
    }
    if (btnAtaqueEspecial2) {
        const nuevoBtn6 = btnAtaqueEspecial2.cloneNode(true);
        btnAtaqueEspecial2.parentNode.replaceChild(nuevoBtn6, btnAtaqueEspecial2);
    }
    if (btnRegenerar2) {
        const nuevoBtn7 = btnRegenerar2.cloneNode(true);
        btnRegenerar2.parentNode.replaceChild(nuevoBtn7, btnRegenerar2);
    }
    if (btnSemilla2) {
        const nuevoBtn8 = btnSemilla2.cloneNode(true);
        btnSemilla2.parentNode.replaceChild(nuevoBtn8, btnSemilla2);
    }
    
    const btn1 = document.getElementById("btn_ataque_basico_1");
    const btn2 = document.getElementById("btn_ataque_especial_1");
    const btn3 = document.getElementById("btn_regenerar_1");
    const btn4 = document.getElementById("btn_semilla_1");
    const btn5 = document.getElementById("btn_ataque_basico_2");
    const btn6 = document.getElementById("btn_ataque_especial_2");
    const btn7 = document.getElementById("btn_regenerar_2");
    const btn8 = document.getElementById("btn_semilla_2");
    
    if (btn1) {
        btn1.addEventListener("click", () => {
            if (turnoActual === 1) {
                if (player1.atk_basico(player2)) {
                    alertaATK(personaje1, "basico");
                    actualizarBarras(player1, 1);
                    actualizarBarras(player2, 2);
                    
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin energía suficiente',
                        text: 'No tienes suficiente energía o ki',
                        timer: 1500
                    });
                }
            }
        });
    }

    if (btn2) {
        btn2.addEventListener("click", () => {
            if (turnoActual === 1) {
                if (player1.atk_especial(player2)) {
                    alertaATK(personaje1, "especial");
                    actualizarBarras(player1, 1);
                    actualizarBarras(player2, 2);
                    
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin energía suficiente',
                        text: 'No tienes suficiente energía o ki',
                        timer: 1500
                    });
                }
            }
        });
    }

    if (btn3) {
        btn3.addEventListener("click", () => {
            if (turnoActual === 1) {
                if (player1.get_porcentaje_ki() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Ki al máximo!',
                        text: 'Tu ki ya está al 100%. No desperdicies tu turno.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                player1.regenerar();
                alertaATK(personaje1, "ki");
                actualizarBarras(player1, 1);
                setTimeout(() => {
                    if (!verificarGanador()) {
                        cambiarTurno();
                    }
                }, 1200);
            }
        });
    }

    if (btn4) {
        btn4.addEventListener("click", () => {
            if (turnoActual === 1) {
                if (player1.get_porcentaje_vida() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Vida completa!',
                        text: 'Tu vida ya está al 100%. Guarda tus semillas para después.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                if (player1.get_porcentaje_energia() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Energía completa!',
                        text: 'Tu energía ya está al 100%. Guarda tus semillas para después.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                if (player1.usar_semilla()) {
                    alertaATK(personaje1, "semilla");
                    actualizarBarras(player1, 1);
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sin semillas',
                        text: 'No tienes Semillas del Ermitaño disponibles',
                        timer: 1500
                    });
                }
            }
        });
    }

    if (btn5) {
        btn5.addEventListener("click", () => {
            if (turnoActual === 2) {
                if (player2.atk_basico(player1)) {
                    alertaATK(personaje2, "basico");
                    actualizarBarras(player1, 1);
                    actualizarBarras(player2, 2);
                    
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin energía suficiente',
                        text: 'No tienes suficiente energía o ki',
                        timer: 1500
                    });
                }
            }
        });
    }

    if (btn6) {
        btn6.addEventListener("click", () => {
            if (turnoActual === 2) {
                if (player2.atk_especial(player1)) {
                    alertaATK(personaje2, "especial");
                    actualizarBarras(player1, 1);
                    actualizarBarras(player2, 2);
                    
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin energía suficiente',
                        text: 'No tienes suficiente energía o ki',
                        timer: 1500
                    });
                }
            }
        });
    }

    if (btn7) {
        btn7.addEventListener("click", () => {
            if (turnoActual === 2) {
                if (player2.get_porcentaje_ki() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Ki al máximo!',
                        text: 'Tu ki ya está al 100%. No desperdicies tu turno.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                player2.regenerar();
                alertaATK(personaje2, "ki");
                actualizarBarras(player2, 2);
                setTimeout(() => {
                    if (!verificarGanador()) {
                        cambiarTurno();
                    }
                }, 1200);
            }
        });
    }

    if (btn8) {
        btn8.addEventListener("click", () => {
            if (turnoActual === 2) {
                if (player2.get_porcentaje_vida() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Vida completa!',
                        text: 'Tu vida ya está al 100%. Guarda tus semillas para después.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                if (player2.get_porcentaje_energia() >= 100) {
                    Swal.fire({
                        icon: 'info',
                        title: '¡Energía completa!',
                        text: 'Tu energía ya está al 100%. Guarda tus semillas para después.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                if (player2.usar_semilla()) {
                    alertaATK(personaje2, "semilla");
                    actualizarBarras(player2, 2);
                    setTimeout(() => {
                        if (!verificarGanador()) {
                            cambiarTurno();
                        }
                    }, 1200);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sin semillas',
                        text: 'No tienes Semillas del Ermitaño disponibles',
                        timer: 1500
                    });
                }
            }
        });
    }
};

btn_py1.addEventListener("click", () => {
    const user_py1 = document.getElementById("username_py1").value.trim();
    
    if (user_py1 === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del jugador 1 no puede estar vacío'
        });
        return;
    }
    
    if (personaje1 === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El jugador 1 debe seleccionar un personaje'
        });
        return;
    }
    
    player1 = new Game(user_py1);
    document.getElementById("username1").innerText = user_py1;
    document.getElementById("img_personaje1").src = `./public/img/${personaje1}/base.png`;
    
    Swal.fire({
        icon: 'success',
        title: '¡Jugador 1 listo!',
        text: `${user_py1} ha elegido a ${personaje1}`,
        timer: 1500,
        showConfirmButton: false
    });
    
    ocultar_seleccion1();
});

btn_py2.addEventListener("click", () => {
    const user_py2 = document.getElementById("username_py2").value.trim();
    
    if (user_py2 === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del jugador 2 no puede estar vacío'
        });
        return;
    }
    
    if (personaje2 === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El jugador 2 debe seleccionar un personaje'
        });
        return;
    }
    
    player2 = new Game(user_py2);
    document.getElementById("username2").innerText = user_py2;
    document.getElementById("img_personaje2").src = `./public/img/${personaje2}/base.png`;
    
    Swal.fire({
        icon: 'success',
        title: '¡Jugador 2 listo!',
        text: `${user_py2} ha elegido a ${personaje2}`,
        timer: 1500,
        showConfirmButton: false
    });
    
    ocultar_seleccion2();
});

// Objeto con las acciones de todos los personajes
const accionesPersonaje = { 
    "Cell": {
        "basico": { img: "./public/img/Cell/basico.png", msj: "¡Hora de probar tu poder!", color: "#a3e635" },
        "especial": { img: "./public/img/Cell/especial.png", msj: "¡Perfectamente perfeccionado!", color: "#84cc16" },
        "semilla": { img: "./public/img/Cell/curar.png", msj: "¡No pueden detenerme!", color: "#bef264" },
        "ki": { img: "./public/img/Cell/energia.png", msj: "¡Ponte verga!", color: "#4d7c0f" }
    },
    "Veguito": {
        "basico": { img: "./public/img/Veguito/basico.png", msj: "¡Vegito al ataque!", color: "#facc15" },
        "especial": { img: "./public/img/Veguito/especial.png", msj: "¡Final Kamehameha!", color: "#f59e0b" },
        "semilla": { img: "./public/img/Veguito/curar.png", msj: "¡Recargando fuerzas!", color: "#fde68a" },
        "ki": { img: "./public/img/Veguito/energia.png", msj: "¡Poder del Saiyan fusionado!", color: "#b45309" }
    },
    "Veguetta": {
        "basico": { img: "./public/img/Veguetta/basico.png", msj: "¡Insecto miserable!", color: "#dc2626" },
        "especial": { img: "./public/img/Veguetta/especial.png", msj: "¡Big Bang Attack!", color: "#b91c1c" },
        "semilla": { img: "./public/img/Veguetta/curar.png", msj: "¡No te librarás de mí!", color: "#fca5a5" },
        "ki": { img: "./public/img/Veguetta/energia.png", msj: "¡Poder del príncipe Saiyan!", color: "#991b1b" }
    },
    "Trunks": {
        "basico": { img: "./public/img/Trunks/basico.png", msj: "¡Espada del futuro!", color: "#3b82f6" },
        "especial": { img: "./public/img/Trunks/especial.png", msj: "¡Burning Attack!", color: "#2563eb" },
        "semilla": { img: "./public/img/Trunks/curar.png", msj: "¡Gracias Bulma!", color: "#93c5fd" },
        "ki": { img: "./public/img/Trunks/energia.png", msj: "¡Energía del futuro!", color: "#1d4ed8" }
    },
    "Pikoro": {
        "basico": { img: "./public/img/Pikoro/basico.png", msj: "¡Golpe Namekiano!", color: "#065f46" },
        "especial": { img: "./public/img/Pikoro/especial.png", msj: "¡Makankosappo!", color: "#047857" },
        "semilla": { img: "./public/img/Pikoro/curar.png", msj: "¡Regeneración Namek!", color: "#6ee7b7" },
        "ki": { img: "./public/img/Pikoro/energia.png", msj: "¡Concentración máxima!", color: "#064e3b" }
    },
    "Goku": {
        "basico": { img: "./public/img/Goku/basico.png", msj: "¡Ka-me-ha-me-ha!", color: "#f97316" },
        "especial": { img: "./public/img/Goku/especial.png", msj: "¡Este es el verdadero poder de un Super Saiyan!", color: "#f59e0b" },
        "semilla": { img: "./public/img/Goku/curar.png", msj: "¡Una semilla del ermitaño y listo!", color: "#fdba74" },
        "ki": { img: "./public/img/Goku/energia.png", msj: "¡Este es mi verdadero poder Saiyan!", color: "#b45309" }
    },
    "Gohan": {
        "basico": { img: "./public/img/Gohan/basico.png", msj: "¡No dejaré que lastimen a nadie!", color: "#facc15" },
        "especial": { img: "./public/img/Gohan/especial.png", msj: "¡Masenko!", color: "#eab308" },
        "semilla": { img: "./public/img/Gohan/curar.png", msj: "¡Aún puedo pelear!", color: "#fde68a" },
        "ki": { img: "./public/img/Gohan/energia.png", msj: "¡Furia liberada!", color: "#b45309" }
    },
    "Gogueta": {
        "basico": { img: "./public/img/Gogueta/basico.png", msj: "¡Fusión imbatible!", color: "#a78bfa" },
        "especial": { img: "./public/img/Gogueta/especial.png", msj: "¡Big Bang Kamehameha!", color: "#7c3aed" },
        "semilla": { img: "./public/img/Gogueta/curar.png", msj: "¡Recuperando doble energía!", color: "#c4b5fd" },
        "ki": { img: "./public/img/Gogueta/energia.png", msj: "¡Energía combinada!", color: "#5b21b6" }
    },
    "Bills": {
        "basico": { img: "./public/img/Bills/basico.png", msj: "¡El poder de un Dios!", color: "#8b5cf6" },
        "especial": { img: "./public/img/Bills/especial.png", msj: "¡Esfera de la Destrucción!", color: "#6d28d9" },
        "semilla": { img: "./public/img/Bills/curar.png", msj: "¡Ni siquiera he usado el 10%!", color: "#c4b5fd" },
        "ki": { img: "./public/img/Bills/energia.png", msj: "¡Energía divina!", color: "#4c1d95" }
    },
    "GokuBlack": {
    "basico": { img: "./public/img/GokuBlack/basico.png", msj: "¡La justicia de los mortales es una farsa!", color: "#e879f9" },
    "especial": {  img: "./public/img/GokuBlack/especial.png", msj: "¡Rosé Kamehameha!", color: "#c026d3" },
    "semilla": { img: "./public/img/GokuBlack/curar.png", msj: "¡La divinidad no puede ser destruida!", color: "#f5d0fe" },
    "ki": { img: "./public/img/GokuBlack/energia.png", msj: "¡Siente el poder del dios verdadero!", color: "#86198f" }
}

};

// Función para mostrar alertas con imágenes personalizadas
const alertaATK = (personaje, accion) => {
    setTimeout(() => {
        let timerInterval;
        Swal.fire({
            title: accionesPersonaje[personaje][accion].msj,
            imageUrl: accionesPersonaje[personaje][accion].img,
            imageWidth: 300,
            imageHeight: 300,
            background: accionesPersonaje[personaje][accion].color,
            backdrop: `rgba(0,0,0,0.5)`,
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                if (timer) {
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                }
            },
            willClose: () => {
                if (timerInterval) clearInterval(timerInterval);
            }
        });
    });
};