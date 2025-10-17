class Game {
    #username;
    #vida;
    #energia;
    #ki;
    #semillas;
    
    constructor(username) {
        this.#username = username;
        this.#vida = 1000;
        this.#energia = 1000;
        this.#ki = 1000;
        this.#semillas = 3; // Cada jugador comienza con 3 semillas del ermitaño
        this.mostrar_stats();
    }
    
    /* Getters para acceder a los valores privados */
    get username() {
        return this.#username;
    }
    
    get vida() {
        return this.#vida;
    }
    
    get energia() {
        return this.#energia;
    }
    
    get ki() {
        return this.#ki;
    }
    
    get semillas() {
        return this.#semillas;
    }
    
    /* Método encargado de mostrar las estadísticas del jugador */
    mostrar_stats() {
        console.log(`
            username: ${this.#username},
            vida: ${this.#vida},
            energia: ${this.#energia},
            ki: ${this.#ki},
            semillas: ${this.#semillas}
        `);
    }
    
    /* Método encargado de decrementar la vida del jugador */
    decre_vida() {
        /* Se valida que el decremento de vida sea un número positivo mayor a cero */
        this.#vida = this.#vida - 175 >= 0 ? this.#vida - 175 : 0;
        /* Al aplicar el decremento se muestran los stats actualizados */
        this.mostrar_stats();
    }
    
    decre_vida_especial() {
        /* Se valida que el decremento de vida sea un número positivo mayor a cero */
        this.#vida = this.#vida - 200 >= 0 ? this.#vida - 200 : 0;
        /* Al aplicar el decremento se muestran los stats actualizados */
        this.mostrar_stats();
    }
    
    /* Resta energía y ki del personaje que está atacando y recibe como argumento un objeto 
    correspondiente al jugador opuesto, esto para acceder al método decremento_vida y reducir sus stats */
    atk_basico(player) {
        /* Validar que tenga suficiente energía y ki para atacar */
        if (this.#energia < 150 || this.#ki < 200) {
            console.log(`${this.#username} no tiene suficiente energía o ki para realizar un ataque básico`);
            return false;
        }
        
        this.#energia = this.#energia - 150 >= 0 ? this.#energia - 150 : 0;
        this.#ki = this.#ki - 200 >= 0 ? this.#ki - 200 : 0;
        
        /* Decremento de vida del jugador opuesto */
        player.decre_vida();
        
        console.log(`${this.#username} realizó un ataque básico!`);
        return true;
    }
    
    atk_especial(player) {
        /* Validar que tenga suficiente energía y ki para atacar */
        if (this.#energia < 350 || this.#ki < 500) {
            console.log(`${this.#username} no tiene suficiente energía o ki para realizar un ataque especial`);
            return false;
        }
        
        this.#energia = this.#energia - 350 >= 0 ? this.#energia - 350 : 0;
        this.#ki = this.#ki - 500 >= 0 ? this.#ki - 500 : 0;
        
        /* Decremento de vida del jugador opuesto */
        player.decre_vida_especial();
        
        console.log(`${this.#username} realizó un ataque especial!`);
        return true;
    }
    
    /* Método para regenerar energía y ki */
    regenerar() {
        this.#energia = Math.min(this.#energia + 100, 1000);
        this.#ki = Math.min(this.#ki + 150, 1000);
        console.log(`${this.#username} se regeneró!`);
        this.mostrar_stats();
    }
    
    /* Método para usar Semilla del Ermitaño - Restaura todo al 100% */
    usar_semilla() {
        if (this.#semillas <= 0) {
            console.log(`${this.#username} no tiene semillas del ermitaño disponibles!`);
            return false;
        }
        
        // Restaurar todas las estadísticas al máximo
        this.#vida = 1000;
        this.#energia = 1000;
        this.#ki = 1000;
        this.#semillas--;
        
        console.log(`${this.#username} usó una Semilla del Ermitaño! Todo restaurado al 100%. Semillas restantes: ${this.#semillas}`);
        this.mostrar_stats();
        return true;
    }
    
    /* Método para verificar si el jugador está vivo */
    esta_vivo() {
        return this.#vida > 0;
    }
    
    /* Método para obtener porcentaje de vida */
    get_porcentaje_vida() {
        return (this.#vida / 1000) * 100;
    }
    
    /* Método para obtener porcentaje de energía */
    get_porcentaje_energia() {
        return (this.#energia / 1000) * 100;
    }
    
    /* Método para obtener porcentaje de ki */
    get_porcentaje_ki() {
        return (this.#ki / 1000) * 100;
    }
}

export default Game;