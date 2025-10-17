class Morse {
    constructor() {
        // Diccionario de Morse
        this.morseCode = {
            'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
            'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
            'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
            'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
            'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
            'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
            '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
            '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
            '$': '...-..-', '@': '.--.-.'
        };

        // Crear diccionario inverso para decodificar
        this.reverseMorseCode = {};
        for (let key in this.morseCode) {
            this.reverseMorseCode[this.morseCode[key]] = key;
        }
    }

    // Convertir texto a código Morse
    textToMorse(text) {
        if (!text) return '';
        
        text = text.toUpperCase();
        let result = [];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === ' ') {
                // Si ya hay un separador de palabra, no agregar otro
                if (result[result.length - 1] !== '/') {
                    result.push('/');
                }
            } else if (this.morseCode[char]) {
                result.push(this.morseCode[char]);
            } else {
                // Carácter no reconocido, lo ignoramos o podemos agregar un marcador
                console.warn(`Carácter no reconocido: ${char}`);
            }
        }

        return result.join(' ');
    }

    // Convertir código Morse a texto
    morseToText(morse) {
        if (!morse) return '';

        // Separar por palabras (usando / o múltiples espacios)
        const words = morse.split(/\s*\/\s*|\s{3,}/);
        let result = [];

        for (let word of words) {
            // Separar letras dentro de cada palabra
            const letters = word.trim().split(/\s+/);
            let decodedWord = '';

            for (let letter of letters) {
                if (letter && this.reverseMorseCode[letter]) {
                    decodedWord += this.reverseMorseCode[letter];
                } else if (letter) {
                    console.warn(`Código Morse no reconocido: ${letter}`);
                    decodedWord += 'Que quisiste decir?';
                }
            }

            if (decodedWord) {
                result.push(decodedWord);
            }
        }

        return result.join(' ');
    }

    // Método auxiliar para obtener el diccionario completo
    getMorseTable() {
        return this.morseCode;
    }
}

export default Morse;