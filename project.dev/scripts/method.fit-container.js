class fitContainer {
    constructor () {
        this.Elems = document.querySelectorAll('[fit-container]');
        
        // Ejecutar "eachElements"
        this.eachElements();

        // Aplicar un listener para saber si se cambia el tamaño del viewport
        window.addEventListener('resize', () => {
            this.eachElements();
        });
    }

    // Metodo que recorre los objetos del DOM para aplicar ajuste de altura al elemento.
    eachElements () {
        this.Elems.forEach(element => {
            this.applyFitElement(element);
        })
    }

    // Metodo para aplicar ajuste de altura al elemento
    applyFitElement (element) {
        element.style.minHeight = window.innerHeight + 'px';
    }
}

new fitContainer();