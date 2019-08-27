import html2canvas from "html2canvas";

class ScreenShotSplit {
    constructor (userOptions = {}) {

        const defualtOptions = {
            setSlicesWidth: 5,
            setSlicesHeight: 3,
            typeElement: 'div',
            appendTo: 'body',
            whereTakeScreenshot: 'body',
            animDelay: 50,
            animDuration: 1000,
            animName: 'zoomOut', // any -> Seleccionar una animacion | RAND -> elige una de la lista en forma random
            whereStartAnim: 'ASC', //ASC -> Acendente | DESC -> Desendente | RAND -> Random
            listAnimations: ['bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flipOutX', 'flipOutY', 'lightSpeedOut', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'hinge', 'rollOut'],

            selectorSections: null
        };

        this.options = {...defualtOptions, ...userOptions};

        this.Sections = Array.prototype.slice.call(document.querySelectorAll(this.options.selectorSections));

        this.currentSection = window.location.hash.replace(/#|\//gm, '');

        // Agregar evento al boton para cambiar de pantalla
        const Elems = document.querySelectorAll('*[run-splash]');
        if (Elems.length) {
            Elems.forEach(val => {
                val.addEventListener('click', event => {
                    this.build();
                });
            });
        }

        // Llamar metodos
        this.toggleShowSections();
    }

    // Metodo para arrancar toma de screenshot y algoritomo constructor.
    async build () {
        const ContentSplash = document.createElement('div');
        
        ContentSplash.setAttribute('class', 'content-splash');
        document.body.appendChild(ContentSplash);

        await this.createScreenShot();
        this.algorithmSlices();
        this.animateSplitParts();
    }
    
    // Metodo para correr un algoritmo para contruir los espacios (rebanadas)
    algorithmSlices () {
        var arr = new Array(this.options.setSlicesWidth * this.options.setSlicesHeight),
            params = {},
            moveLeft = 0,
            moveTop = 0;

        params.elemWidth = window.innerWidth / this.options.setSlicesWidth;
        params.elemHeight = window.innerHeight / this.options.setSlicesHeight;

        for(let i = 0; i < arr.length; i += 1) {

            if (i !== 0) {
                moveLeft += params.elemWidth;
            }

            if (i % this.options.setSlicesWidth == 0 && i !== 0) {
                moveLeft = 0;
                moveTop += params.elemHeight;
            }

            arr[i] = {pxLeft: moveLeft, pxTop: moveTop};
        }
 
        arr.forEach(val => {
            params.pxTop = val.pxTop;
            params.pxLeft = val.pxLeft;

            this.createContentSlice(params);
        });


    }

    // Metodo para crear un elemento en el DOM segun los parametros pasados de la "rebanada"
    createContentSlice (params) {
        const Elem = document.createElement(this.options.typeElement);

        Elem.style.width = params.elemWidth + "px";
        Elem.style.height = params.elemHeight + "px";
        Elem.style.top = params.pxTop + "px";
        Elem.style.left = params.pxLeft + "px";
        Elem.style.backgroundPosition = `-${params.pxLeft}px -${params.pxTop}px`;

        Elem.setAttribute("class", "slice-splash");

        document.querySelector(this.options.appendTo).appendChild(Elem);
    }

    // Metodo para tomar un Screenshot de la pantalla.
    async createScreenShot () {
        const ElementScreenShot = document.querySelector(this.options.whereTakeScreenshot);
        
        await html2canvas(ElementScreenShot).then(canvas => {
            var tagStyle = document.createElement('style'),
                getImage = canvas.toDataURL();

            tagStyle.id = "screenShotStyle";
            tagStyle.type = 'text/css';
            tagStyle.innerHTML = `
                .slice-splash {
                    background-image: url(${getImage});
                }
            `;

            document.querySelector('head').appendChild(tagStyle);
        });
    }

    // Metodo para agregar animacion a las rebanadas
    animateSplitParts () {
        const ContentSplash = document.querySelector('.content-splash'),
              ContentSplashChild = Array.prototype.slice.call(ContentSplash.childNodes);
        var animDelay = 0,
            animName;

        // Saber como ordenar la lista de nodos para aplicar
        if (this.options.whereStartAnim === 'DESC') {
            ContentSplashChild.reverse();

        } else if (this.options.whereStartAnim === 'RAND') {
            for(let i = ContentSplashChild.length - 1; i > 0; i --) {
                const e = Math.floor(Math.random() * (i + 1));
                [ContentSplashChild[i], ContentSplashChild[e]] = [ContentSplashChild[e], ContentSplashChild[i]];
            }
        }

        // Definir una animacion
        if (this.options.animName === 'RAND') {
            animName = this.options.listAnimations[Math.floor(Math.random() * this.options.listAnimations.length)];
        } else {
            animName = this.options.animName;
        }
        
        ContentSplashChild.forEach(elem => {
            elem.style.animationDuration = `${this.options.animDuration}ms`;
            elem.style.animationFillMode = 'both';
            elem.style.animationDelay = `${animDelay}ms`;
            elem.classList.add(animName);
            
            animDelay += this.options.animDelay;
        });

        animDelay = animDelay + this.options.animDelay + this.options.animDuration;

        setTimeout(function () {
            ContentSplash.remove();
        }, animDelay);

        setTimeout(this.toggleShowSections.bind(this), this.options.aminDelay);
        
    }

    // Metodo para mostrar u ocultar las secciones
    toggleShowSections () {
        const getNewSection = window.location.hash.replace(/#|\//gm, '');
        
        if (this.Sections.length) {
            this.Sections.forEach(elem => {elem.style.display = 'none';});

            if (!this.currentSection) {
                this.Sections[0].style.display = 'block';

            } else {
                this.Sections.filter(elem => {
                    return elem.id === getNewSection;
                })[0].style.display = 'block';
            }
        }
    }
}

new ScreenShotSplit({
    appendTo: '.content-splash',
    setSlicesWidth: 7,
    setSlicesHeight: 4,
    animDelay: 50,
    animDuration: 1000,
    animName: 'RAND',
    whereStartAnim: 'RAND',
    listAnimations: ['bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'zoomOut'],
    selectorSections: '#main-content .sec'
});