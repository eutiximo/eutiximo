class navigationController {
    constructor (userOptions) {
        const defaultOptions = {
            selectorNav: '#main-nav',
            selectorSec: '#main-content .sec'
        };

        this.options = {...defaultOptions, ...userOptions};

        this.Nav = document.querySelector(this.options.selectorNav);
        this.Sections = document.querySelectorAll(this.options.selectorSec);

        // Escuchar si hay un cambio en el hash de la URL
        window.addEventListener('hashchange', event => {
            this.showTheSection();
        });
        
        // Ejecutar metodos
        this.showTheSection();
    }

    // Metodo que muestra la seccion segun el hash
    showTheSection () {
        const getCurrentHash = window.location.hash.replace('#/', ''),
              arrSections = Array.prototype.slice.call(this.Sections);

        arrSections.forEach(Elem => {
            Elem.style.display = 'none';
        });

        if (!getCurrentHash) {
            arrSections[0].style.display = 'block';
        } else {
            arrSections.filter(elem => {
                return elem.id === getCurrentHash;
            })[0].style.display = 'block';
        }
    }
}