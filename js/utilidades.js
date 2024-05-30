
function populateEventTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
        for (let minute of ["00", "30"]) {
            const option = document.createElement('option')
            option.value = `${hour.toString().padStart(2, '0')}:${minute}`
            option.text = `${hour.toString().padStart(2, '0')}:${minute}`
            eventTime.appendChild(option)
        }
    }
}
const tituloC = document.getElementById('tituloCalendario')
const mostrarC = document.getElementById('calendarioPagina')
const agregarC = document.getElementById('añadirC')
const fechaEvento = document.getElementById('fechaE')
const eventTime = document.getElementById('event-time')
const DescripcionE = document.getElementById('descripcionE')
const añadirParticipantesC = document.getElementById('añadirPC')
const tituloCa = document.getElementById('ticuloCA')

let fechaActual = new Date()
let vistaActual = 'mes'
let eventos = JSON.parse(localStorage.getItem('calendarEvents')) || {}
let selectedDate

populateEventTimeOptions()

function guardarCambios() {
    mostrarC.innerHTML = ''
    if (vistaActual === 'mes') {
        actualizarVistaMes();
    } else if (vistaActual === 'yearly') {
        ActualizarVistaAño();
    } else if (vistaActual === 'daily') {
        actualizarVistaDia();
    }
}

function actualizarVistaMes() {
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth()
    const diasEnElMes = new Date(año, mes + 1, 0).getDate()
    const DiaUno = new Date(año, mes, 1).getDay()

    tituloC.innerText = `${fechaActual.toLocaleString('default', { month: 'long' })} ${año}`

    for (let i = 0; i < DiaUno; i++) {
        const emptyDiv = document.createElement('div')
        mostrarC.appendChild(emptyDiv)
    }

    for (let day = 1; day <= diasEnElMes; day++) {
        const dayElement = document.createElement('div')
        dayElement.innerText = day
        const fechaClave = `${año}-${mes + 1}-${day}`
        if (eventos[fechaClave]) {
            dayElement.classList.add('event')
            dayElement.title = `${eventos[fechaClave].description}\n${eventos[fechaClave].participants}`
        }
        if (day === fechaActual.getDate() && mes === new Date().getMonth() && año === new Date().getFullYear()) {
            dayElement.classList.add('today')
        }
        dayElement.onclick = () => AbrirAgregar(fechaClave)
        mostrarC.appendChild(dayElement)
    }
}
function mostraVistaMes() {
    vistaActual = 'mes'
    mostrarC.style.gridTemplateColumns = 'repeat(7, 1fr)'
    guardarCambios()
}

function mostraVistaAño() {
    vistaActual = 'yearly';
    mostrarC.style.gridTemplateColumns = 'repeat(3, 1fr)'
    guardarCambios()
}

function mostraVistaDia() {
    vistaActual = 'daily';
    mostrarC.style.gridTemplateColumns = '1fr'
    guardarCambios()
}

function ActualizarVistaAño() {
    const year = fechaActual.getFullYear()
    tituloC.innerText = `${year}`
    mostrarC.style.gridTemplateColumns = 'repeat(3, 1fr)'

    for (let month = 0; month < 12; month++) {
        const meses = document.createElement('div')
        meses.innerText = new Date(year, month).toLocaleString('default', { month: 'long' })
        meses.style.background = 'yellowgreen'
        meses.style.color = '#fff'
        meses.style.padding = '10px'
        meses.style.margin = '5px'
        meses.style.borderRadius = '5px'
        meses.onclick = () => {
            fechaActual.setMonth(month)
            vistaActual = 'mes'
            guardarCambios()
        }
        mostrarC.appendChild(meses)
    }
}

function actualizarVistaDia() {
    const year = fechaActual.getFullYear()
    const month = fechaActual.getMonth()
    const day = fechaActual.getDate()
    const fechaPrecisa = `${year}-${month + 1}-${day}`
    tituloC.innerText = `${day} de ${fechaActual.toLocaleString('default', { month: 'long' })}, ${year}`
    mostrarC.style.gridTemplateColumns = '1fr'

    const diaEven = document.createElement('div')
    diaEven.style.padding = '20px'
    diaEven.style.background = 'yellowgreen'
    diaEven.style.borderRadius = '10px'

    const eventText = eventos[fechaPrecisa] ? `Evento: ${eventos[fechaPrecisa].description}\nParticipantes: ${eventos[fechaPrecisa].participants}` : 'Ningun evento hasta el momento'
    const eventoR = document.createElement('div')
    eventoR.innerText = eventText
    eventoR.style.color = 'black'
    eventoR.style.marginTop = '10px'

    diaEven.appendChild(eventoR)
    mostrarC.appendChild(diaEven)
}

function AbrirAgregar(fechaExacta) {
    selectedDate = fechaExacta;
    if (eventos[fechaExacta]) {
        fechaEvento.value = fechaExacta;
        eventTime.value = eventos[fechaExacta].time
        DescripcionE.value = eventos[fechaExacta].description
        añadirParticipantesC.value = eventos[fechaExacta].participants
    } else {
        fechaEvento.value = fechaExacta
        eventTime.value = "00:00"
        DescripcionE.value = ''
        añadirParticipantesC.value = ''
    }
    agregarC.style.display = 'flex'
}
function anterior() {
    if (vistaActual === 'mes') {
        fechaActual.setMonth(fechaActual.getMonth() - 1)
    } else if (vistaActual === 'yearly') {
        fechaActual.setFullYear(fechaActual.getFullYear() - 1)
    } else if (vistaActual === 'daily') {
        fechaActual.setDate(fechaActual.getDate() - 1)
    }
    guardarCambios()
}

function siguiente() {
    if (vistaActual === 'mes') {
        fechaActual.setMonth(fechaActual.getMonth() + 1)
    } else if (vistaActual === 'yearly') {
        fechaActual.setFullYear(fechaActual.getFullYear() + 1)
    } else if (vistaActual === 'daily') {
        fechaActual.setDate(fechaActual.getDate() + 1)
    }
    guardarCambios()
}

function cerrarA() {
    agregarC.style.display = 'none'
}

function guardarEvento() {
    const event = {
        date: selectedDate,
        time: eventTime.value,
        description: DescripcionE.value.trim(),
        participants: añadirParticipantesC.value.trim()
    };
    eventos[selectedDate] = event;
    localStorage.setItem('calendarEvents', JSON.stringify(eventos))

    if (!fechaEvento.value || !eventTime.value || !DescripcionE.value || !añadirParticipantesC.value) {
        mostrarMensajeError('No puedes dejar los campos vacíos')
        return;
    } else {
        cerrarA()
        guardarCambios()
    }
}

function eliminarEvento() {
    delete eventos[selectedDate];
    localStorage.setItem('calendarEvents', JSON.stringify(eventos))
    cerrarA()
    guardarCambios()
}
guardarCambios()

function mostrarMensajeError() {
    return confirm('No puedes dejar los campos vacíos.')
}
