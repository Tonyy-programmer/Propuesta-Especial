const EMAILJS_CONFIG = {
    publicKey: "",
    serviceId: "",
    templateId: "",
    toEmail: ""
};

const PROPUESTA_CONFIG = {
    nombreDestinatario: "",
    nombreRemitente: "",
    tipoRelacion: "mi pareja",
    tituloPagina: "Sorpresa Rom\u00e1ntica",
    etiquetaBienvenida: "Para {nombre}",
    tituloPrincipal: "Sorpresa para ti :3",
    preguntaFinal: "{nombre}, \u00bfquieres ser {tipoRelacion}?",
    tituloCarta: "Para {nombre}",
    carta: "Gracias por llegar a mi vida. Me haces sonre\u00edr, me haces pensar bonito y contigo todo se siente m\u00e1s especial. Esta p\u00e1gina es una mini forma de decirte lo mucho que me importas. \u2764",
    tituloFinal: "\u2764 Oficialmente juntos \u2764",
    textoFinal: "Sab\u00eda que este momento iba a llegar."
};
const FRASES = [
    "{nombre}, eres como un if-else: no importa la condici\u00f3n, siempre te elijo a ti.",
    "Contigo hasta los d\u00edas normales se sienten especiales.",
    "Si esto fuera c\u00f3digo, t\u00fa ser\u00edas mi parte favorita.",
    "Desde que llegaste, todo se ve m\u00e1s bonito.",
    "Quer\u00eda hacer algo diferente para decirte lo que siento."
];
const NOTAS = [
    "te elijo", "qu\u00e9 linda persona", "mi persona favorita", "algo m\u00e1gico", "te quiero"
];
const META_MINIJUEGO = 5;
const GALERIA_FOTOS = [
    { src: "descarga.jpg", caption: "Una foto para este momento especial" },
    { src: "RR _3.jpg", caption: "Un recuerdo bonito para esta sorpresa" },
    { src: "Background.jpg", caption: "Nuestro fondo de esta sorpresa" },
    { src: "descarga.jpg", caption: "Otra foto especial para guardar este momento" }
];

const pantallaBienvenida = document.getElementById("pantallaBienvenida");
const bienvenidaTag = document.getElementById("bienvenidaTag");
const btnIniciarSorpresa = document.getElementById("btnIniciarSorpresa");
const cuentaRegresiva = document.getElementById("cuentaRegresiva");
const fraseAleatoria = document.getElementById("fraseAleatoria");
const frasePrincipal = document.getElementById("frasePrincipal");
const tituloPrincipal = document.querySelector(".box1 h1");

const btnMostrarPregunta = document.getElementById("btnMostrarPregunta");
const mensajeFinal = document.getElementById("mensajeFinal");
const header = document.querySelector(".header");
const botonInicio = document.querySelector(".button");

const bloqueMiniJuego = document.getElementById("bloqueMiniJuego");
const bloquePregunta = document.getElementById("bloquePregunta");
const miniJuegoArea = document.getElementById("miniJuegoArea");
const corazonJuego = document.getElementById("corazonJuego");
const contadorJuego = document.getElementById("contadorJuego");
const textoMiniJuego = document.getElementById("textoMiniJuego");

const galeriaImagen = document.getElementById("galeriaImagen");
const galeriaCaption = document.getElementById("galeriaCaption");
const galPrev = document.getElementById("galPrev");
const galNext = document.getElementById("galNext");

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const preguntaFinal = document.getElementById("preguntaFinal");
const contadorNo = document.getElementById("contadorNo");
const respuestaTexto = document.getElementById("respuestaTexto");

const btnCarta = document.getElementById("btnCarta");
const sobreCarta = document.getElementById("sobreCarta");
const cartaPanel = document.getElementById("cartaPanel");
const cartaTitulo = document.getElementById("cartaTitulo");
const cartaTexto = document.querySelector("#cartaPanel p");

const pantallaFinal = document.getElementById("pantallaFinal");
const tituloFinal = document.getElementById("tituloFinal");
const textoFinal = document.getElementById("textoFinal");
const fechaOficial = document.getElementById("fechaOficial");
const diasJuntos = document.getElementById("diasJuntos");
const cerrarFinal = document.getElementById("cerrarFinal");

const lluviaCorazones = document.getElementById("lluviaCorazones");
const lluviaConfeti = document.getElementById("lluviaConfeti");
const notasFlotantes = document.getElementById("notasFlotantes");

const btnMusica = document.getElementById("btnMusica");
const musicaFondo = document.getElementById("musicaFondo");

let musicaActiva = false;
let escalaSi = 1;
let intentosNo = 0;
let progresoJuego = 0;
let idxFoto = 0;
let typingMainTimeout = null;
let typingCartaTimeout = null;
let cartaAnimada = false;
let sorpresaIniciada = false;

function obtenerNombreDestinatario() {
    return PROPUESTA_CONFIG.nombreDestinatario.trim() || "alguien especial";
}

function formatearTexto(texto) {
    return texto
        .replaceAll("{nombre}", obtenerNombreDestinatario())
        .replaceAll("{remitente}", PROPUESTA_CONFIG.nombreRemitente.trim())
        .replaceAll("{tipoRelacion}", PROPUESTA_CONFIG.tipoRelacion.trim() || "mi pareja");
}

function aplicarConfiguracion() {
    document.title = PROPUESTA_CONFIG.tituloPagina || "Sorpresa Rom\u00e1ntica";
    if (bienvenidaTag) bienvenidaTag.textContent = formatearTexto(PROPUESTA_CONFIG.etiquetaBienvenida);
    if (tituloPrincipal) tituloPrincipal.textContent = formatearTexto(PROPUESTA_CONFIG.tituloPrincipal);
    if (preguntaFinal) preguntaFinal.textContent = `${formatearTexto(PROPUESTA_CONFIG.preguntaFinal)} \u2764`;
    if (cartaTitulo) cartaTitulo.textContent = formatearTexto(PROPUESTA_CONFIG.tituloCarta);
    if (cartaTexto) cartaTexto.textContent = formatearTexto(PROPUESTA_CONFIG.carta);
    if (tituloFinal) tituloFinal.textContent = formatearTexto(PROPUESTA_CONFIG.tituloFinal);
    if (textoFinal) textoFinal.textContent = formatearTexto(PROPUESTA_CONFIG.textoFinal);
}

function elegirFraseAleatoria() {
    const frase = formatearTexto(FRASES[Math.floor(Math.random() * FRASES.length)]);
    if (fraseAleatoria) fraseAleatoria.textContent = frase;
    if (frasePrincipal) frasePrincipal.textContent = frase;
}

function actualizarBotonMusica() {
    if (!btnMusica) return;
    btnMusica.textContent = musicaActiva ? "M\u00fasica: ON" : "M\u00fasica: OFF";
    btnMusica.classList.toggle("activa", musicaActiva);
}

async function iniciarMusicaSiSePuede() {
    if (!musicaFondo || musicaActiva) return;
    try {
        await musicaFondo.play();
        musicaActiva = true;
        actualizarBotonMusica();
    } catch (error) {
        console.error("No se pudo iniciar la musica automaticamente.", error);
    }
}

function countdownSorpresa() {
    if (!cuentaRegresiva || !pantallaBienvenida) {
        if (pantallaBienvenida) pantallaBienvenida.classList.add("oculta");
        return;
    }

    let n = 3;
    cuentaRegresiva.textContent = String(n);
    cuentaRegresiva.classList.add("activa");

    const tick = () => {
        n -= 1;
        if (n > 0) {
            cuentaRegresiva.textContent = String(n);
            setTimeout(tick, 700);
            return;
        }
        cuentaRegresiva.textContent = "Vamos";
        setTimeout(() => {
            pantallaBienvenida.classList.add("saliendo");
            document.body.classList.add("escena-principal-activa");
            lanzarCorazonesExtra();
            setTimeout(() => {
                pantallaBienvenida.classList.add("oculta");
            }, 850);
        }, 900);
    };

    setTimeout(tick, 700);
}

function iniciarSorpresa() {
    if (sorpresaIniciada) return;
    sorpresaIniciada = true;
    iniciarMusicaSiSePuede();
    countdownSorpresa();
}

function mostrarMensaje() {
    if (!header || !botonInicio || !mensajeFinal) return;

    iniciarMusicaSiSePuede();

    header.style.opacity = "0";
    botonInicio.style.opacity = "0";
    header.style.transition = "0.6s";
    botonInicio.style.transition = "0.6s";

    setTimeout(() => {
        header.style.display = "none";
        botonInicio.style.display = "none";
        mensajeFinal.style.display = "block";
        mensajeFinal.classList.add("activo");
    }, 600);
}

function posicionarCorazonJuego() {
    if (!miniJuegoArea || !corazonJuego) return;
    const areaRect = miniJuegoArea.getBoundingClientRect();
    const btnSize = 54;
    const maxX = Math.max(10, areaRect.width - btnSize - 10);
    const maxY = Math.max(10, areaRect.height - btnSize - 10);
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    corazonJuego.style.left = `${x}px`;
    corazonJuego.style.top = `${y}px`;
    corazonJuego.style.transform = "none";
}

function desbloquearPregunta() {
    if (bloqueMiniJuego) {
        bloqueMiniJuego.classList.add("saliendo");
    }
    if (contadorJuego) {
        contadorJuego.textContent = "Listo \uD83D\uDC96";
    }
    if (textoMiniJuego) {
        textoMiniJuego.textContent = "Desbloqueando sorpresa...";
    }

    setTimeout(() => {
        if (bloqueMiniJuego) bloqueMiniJuego.style.display = "none";
        if (bloquePregunta) {
            bloquePregunta.hidden = false;
            bloquePregunta.classList.remove("revelando");
            // Forzamos un frame para que la animacion se vea y no aparezca de golpe.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bloquePregunta.classList.add("revelando");
                });
            });
        }
        lanzarCorazonesExtra();
    }, 800);
}

function actualizarContadorJuego() {
    if (contadorJuego) contadorJuego.textContent = `${progresoJuego} / ${META_MINIJUEGO}`;
    if (textoMiniJuego) textoMiniJuego.textContent = `Atrapa ${META_MINIJUEGO} corazones para continuar \uD83D\uDC98`;
}

function actualizarGaleria() {
    if (!galeriaImagen || !galeriaCaption) return;
    const foto = GALERIA_FOTOS[idxFoto];
    galeriaImagen.src = foto.src;
    galeriaCaption.textContent = foto.caption;
}

function escribirConMaquina(elemento, texto, velocidad, onFinish) {
    if (!elemento) return;
    let i = 0;
    elemento.textContent = "";
    if (elemento === respuestaTexto) {
        if (typingMainTimeout) clearTimeout(typingMainTimeout);
        respuestaTexto.classList.add("mostrar");
    }
    if (elemento === cartaTexto && typingCartaTimeout) clearTimeout(typingCartaTimeout);

    const step = () => {
        elemento.textContent = texto.slice(0, i);
        i += 1;
        if (i <= texto.length) {
            const id = setTimeout(step, velocidad);
            if (elemento === respuestaTexto) typingMainTimeout = id;
            if (elemento === cartaTexto) typingCartaTimeout = id;
        } else if (onFinish) {
            onFinish();
        }
    };
    step();
}

function crearCorazon() {
    if (!lluviaCorazones) return;
    const corazon = document.createElement("span");
    corazon.className = "corazon";
    corazon.textContent = Math.random() > 0.5 ? "\u2764" : "\uD83D\uDC96";
    corazon.style.left = `${Math.random() * 100}vw`;
    corazon.style.fontSize = `${14 + Math.random() * 18}px`;
    corazon.style.animationDuration = `${4 + Math.random() * 4}s`;
    corazon.style.color = ["#ff4d6d", "#ff758f", "#ff8fab", "#ffb3c6"][Math.floor(Math.random() * 4)];
    lluviaCorazones.appendChild(corazon);
    setTimeout(() => corazon.remove(), 9000);
}

function lanzarCorazonesExtra() {
    for (let i = 0; i < 20; i += 1) {
        setTimeout(crearCorazon, i * 120);
    }
}

function crearConfeti() {
    if (!lluviaConfeti) return;
    const pieza = document.createElement("span");
    pieza.className = "confeti";
    pieza.style.left = `${Math.random() * 100}vw`;
    pieza.style.backgroundColor = ["#ff4d6d", "#ffd166", "#06d6a0", "#118ab2", "#f72585", "#ffffff"][Math.floor(Math.random() * 6)];
    pieza.style.animationDuration = `${2.5 + Math.random() * 2.2}s`;
    pieza.style.setProperty("--x-fin", `${-90 + Math.random() * 180}px`);
    lluviaConfeti.appendChild(pieza);
    setTimeout(() => pieza.remove(), 5500);
}

function lanzarConfeti() {
    for (let i = 0; i < 80; i += 1) {
        setTimeout(crearConfeti, i * 22);
    }
}

function crearNotaFlotante() {
    if (!notasFlotantes) return;
    const nota = document.createElement("span");
    nota.className = "nota-flotante";
    nota.textContent = NOTAS[Math.floor(Math.random() * NOTAS.length)];
    nota.style.left = `${Math.random() * 88}vw`;
    nota.style.animationDuration = `${7 + Math.random() * 5}s`;
    notasFlotantes.appendChild(nota);
    setTimeout(() => nota.remove(), 13000);
}

function moverBotonNo() {
    if (!btnNo || btnNo.style.display === "none") return;
    const x = Math.round((Math.random() * 150) - 75);
    const y = Math.round((Math.random() * 70) - 30);
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
}

function actualizarContadorNo() {
    if (!contadorNo) return;
    const frases = [
        "",
        "Mmm... sospechoso \uD83D\uDC40",
        "Ese No se ve nervioso \uD83D\uDE05",
        "Uy, el bot\u00f3n No ya quiere escapar \uD83D\uDE02",
        "Ya casi no queda opci\u00f3n... \uD83D\uDE0C"
    ];
    contadorNo.textContent = frases[Math.min(intentosNo, frases.length - 1)];
}

function calcularDiasDesde(isoString) {
    if (!isoString) return null;
    const inicio = new Date(isoString);
    if (Number.isNaN(inicio.getTime())) return null;
    const hoy = new Date();
    inicio.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    return Math.floor((hoy - inicio) / 86400000);
}

function obtenerFechaLocalISO(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function parsearFechaLocalISO(yyyyMmDd) {
    if (!yyyyMmDd || !/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return null;
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function mostrarPantallaFinal() {
    if (!pantallaFinal || !fechaOficial || !diasJuntos) return;

    let fechaGuardada = localStorage.getItem("fechaOficialPropuesta");
    if (!fechaGuardada) {
        fechaGuardada = obtenerFechaLocalISO();
        localStorage.setItem("fechaOficialPropuesta", fechaGuardada);
    }

    const fecha = parsearFechaLocalISO(fechaGuardada) || new Date(fechaGuardada);
    fechaOficial.textContent = `Nuestra fecha oficial: ${fecha.toLocaleDateString("es-ES")}`;
    const dias = calcularDiasDesde(fecha);
    diasJuntos.textContent = dias === null
        ? ""
        : dias === 0
            ? "Hoy empezaron oficialmente \uD83D\uDC96"
            : `Llevamos ${dias} d\u00eda${dias === 1 ? "" : "s"} juntos desde que dijiste que s\u00ed`;

    pantallaFinal.classList.add("activa");
    pantallaFinal.setAttribute("aria-hidden", "false");
}

function enviarCorreoSi(respuestaRecibida) {
    const cfg = EMAILJS_CONFIG;
    const configurado = cfg.publicKey && cfg.serviceId && cfg.templateId && cfg.toEmail;
    if (!configurado || typeof emailjs === "undefined") return;

    emailjs.init({ publicKey: cfg.publicKey });
    emailjs.send(cfg.serviceId, cfg.templateId, {
        to_email: cfg.toEmail,
        respuesta: respuestaRecibida.respuesta,
        fecha: respuestaRecibida.fecha,
        hora: respuestaRecibida.hora
    })
        .then(() => console.log("Correo enviado con exito"))
        .catch((error) => console.error("Error al enviar correo:", error));
}

function init() {
    aplicarConfiguracion();
    elegirFraseAleatoria();
    actualizarBotonMusica();
    actualizarGaleria();
    actualizarContadorJuego();

    if (btnIniciarSorpresa) {
        btnIniciarSorpresa.addEventListener("click", iniciarSorpresa);
    }

    if (btnMusica && musicaFondo) {
        btnMusica.addEventListener("click", async () => {
            try {
                if (!musicaActiva) {
                    await musicaFondo.play();
                    musicaActiva = true;
                } else {
                    musicaFondo.pause();
                    musicaActiva = false;
                }
                actualizarBotonMusica();
            } catch (error) {
                console.error("No se pudo reproducir la musica.", error);
            }
        });
    }

    if (btnMostrarPregunta) {
        btnMostrarPregunta.addEventListener("click", mostrarMensaje);
    }

    if (corazonJuego) {
        corazonJuego.addEventListener("click", () => {
            progresoJuego += 1;
            actualizarContadorJuego();
            if (progresoJuego >= META_MINIJUEGO) {
                desbloquearPregunta();
            } else {
                posicionarCorazonJuego();
            }
        });
    }

    if (miniJuegoArea) {
        setTimeout(posicionarCorazonJuego, 300);
        window.addEventListener("resize", () => {
            if (progresoJuego < META_MINIJUEGO) posicionarCorazonJuego();
        });
    }

    if (galPrev) {
        galPrev.addEventListener("click", () => {
            idxFoto = (idxFoto - 1 + GALERIA_FOTOS.length) % GALERIA_FOTOS.length;
            actualizarGaleria();
        });
    }
    if (galNext) {
        galNext.addEventListener("click", () => {
            idxFoto = (idxFoto + 1) % GALERIA_FOTOS.length;
            actualizarGaleria();
        });
    }

    if (btnCarta && sobreCarta && cartaTexto) {
        const textoOriginalCarta = cartaTexto.textContent.trim();
        btnCarta.addEventListener("click", () => {
            sobreCarta.classList.add("visible");
            const abierta = sobreCarta.classList.toggle("abierto");
            sobreCarta.setAttribute("aria-hidden", abierta ? "false" : "true");
            btnCarta.textContent = abierta ? "Cerrar carta" : "Abrir carta";

            if (abierta) {
                if (!cartaAnimada) {
                    escribirConMaquina(cartaTexto, textoOriginalCarta, 18);
                    cartaAnimada = true;
                } else {
                    cartaTexto.textContent = textoOriginalCarta;
                }
            }
        });
    }

    if (cerrarFinal && pantallaFinal) {
        cerrarFinal.addEventListener("click", () => {
            pantallaFinal.classList.remove("activa");
            pantallaFinal.setAttribute("aria-hidden", "true");
        });
        pantallaFinal.addEventListener("click", (e) => {
            if (e.target === pantallaFinal) {
                pantallaFinal.classList.remove("activa");
                pantallaFinal.setAttribute("aria-hidden", "true");
            }
        });
    }

    if (btnNo) {
        btnNo.addEventListener("mouseenter", moverBotonNo);
        btnNo.addEventListener("touchstart", moverBotonNo, { passive: true });
    }

    if (btnSi && btnNo && respuestaTexto) {
        btnSi.addEventListener("click", () => {
            const ahora = new Date();
            const respuestaRecibida = {
                respuesta: "SI",
                fecha: ahora.toLocaleDateString(),
                hora: ahora.toLocaleTimeString()
            };

            localStorage.setItem("respuestaPropuesta", JSON.stringify(respuestaRecibida));
            const fechaLocal = obtenerFechaLocalISO(ahora);
            if (!localStorage.getItem("fechaOficialPropuesta")) {
                localStorage.setItem("fechaOficialPropuesta", fechaLocal);
            }
            enviarCorreoSi(respuestaRecibida);

            escribirConMaquina(
                respuestaTexto,
                `Sab\u00eda que ibas a decir que s\u00ed, ${obtenerNombreDestinatario()} \uD83D\uDC96\nTe quiero much\u00edsimo \u2728`,
                36
            );

            btnSi.textContent = "Siiii";
            btnSi.disabled = true;
            btnNo.style.display = "none";
            if (contadorNo) contadorNo.textContent = "La \u00fanica respuesta correcta \uD83D\uDE0E\u2764";

            lanzarCorazonesExtra();
            lanzarConfeti();
            setTimeout(mostrarPantallaFinal, 1500);
        });

        btnNo.addEventListener("click", () => {
            intentosNo += 1;
            escalaSi += 0.25;
            btnSi.style.transform = `scale(${escalaSi})`;
            btnNo.style.opacity = Math.max(0, 1 - intentosNo * 0.25);
            moverBotonNo();
            actualizarContadorNo();
            if (intentosNo >= 4) btnNo.style.display = "none";
        });
    }

    setInterval(crearCorazon, 450);
    setInterval(crearNotaFlotante, 2600);
}

window.iniciarSorpresa = iniciarSorpresa;
// Util para pruebas: reinicia la fecha oficial guardada (usar desde consola si hace falta).
window.reiniciarFechaOficial = () => {
    localStorage.removeItem("fechaOficialPropuesta");
    localStorage.removeItem("respuestaPropuesta");
    console.log("Fecha oficial reiniciada.");
};
init();
