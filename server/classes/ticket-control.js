const fs = require('fs');

//Clase para validar los tickets que se atienden
class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
};

//Clase para validar los tickets que se generan
class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        //Leer el json 
        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();
        }
    }

    siguiente() {
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);
        //Agregar tickets a ticket
        this.tickets.push(ticket);
        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    };

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    };

    getUltimos4() {
        return this.ultimos4;
    };
    //Valida tickets pendientes
    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return 'No hay tickets';
        };

        //extrae el numeroo del tiquet
        let numeroTicket = this.tickets[0].numero;
        //Eliminar la primera posicion del arreglo 
        this.tickets.shift();
        //ticket atender
        let atenderTicket = new Ticket(numeroTicket, escritorio);
        //agregar al inicio del arreglo
        this.ultimos4.unshift(atenderTicket);
        //Verificar que solo existan 4 tickets en el arreglo 
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); //borra el ultimo
        };

        console.log('Ultimos 4');
        console.log(this.ultimos4);
        //grabar el archivo
        this.grabarArchivo();
        //regresar el ticket a atender
        return atenderTicket;
    };
    reiniciarConteo() {

        this.ultimo = 0;
        //Arreglo de tickets pendientes por atender
        this.ticket = [];
        this.ultimos4 = [];
        console.log('Se ha inicialado el sistema');
        this.grabarArchivo();
    };

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }
};

module.exports = {
    TicketControl,
    Ticket
}