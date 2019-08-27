class fitFontSize {
    constructor () {
        this.Elements = document.querySelectorAll('[fit-fz]');

        this.eachElements();

        window.addEventListener('resize', () => {
            this.eachElements();
        });
    }

    // Metodo para recorrer los elementos encontrados
    eachElements () {
        this.Elements.forEach(element => {
            const getChild = element.childNodes;

            getChild.forEach(elem => {
                elem.style.cssText = 'display:block;width:100%;';
                this.coreFitFontSize(elem);
            });
        });
    }

    coreFitFontSize (Elem) {
        var spanRule,
            spanRuleWidth,
            getReduce = Elem.getAttribute('data-reduce') || 0,
            getLineHeight = Elem.getAttribute('data-line-height') || 0,
            elemWidth = Elem.offsetWidth;
        
        // Crear elemento interno para usar como regla que mida en contenedor padre
        Elem.innerHTML = '<span>'+ Elem.innerText +'</span>';
        spanRule = Elem.childNodes[0];
        spanRuleWidth = spanRule.offsetWidth;

        // Iniciar while que aumentara la fuente de px por px hasta exceder el ancho de la caja y reajustar para mantener en una sola linea.
        let currentFontSize = 1,
            prevWidth = 0;

        while (spanRuleWidth < elemWidth && currentFontSize < 200) {
            Elem.style.fontSize = `${currentFontSize}px`;
            Elem.style.lineHeight = `${currentFontSize}px`;

            currentFontSize += 1;
            prevWidth = spanRuleWidth;
            spanRuleWidth = spanRule.offsetWidth;

            if (spanRuleWidth < prevWidth && currentFontSize > 3) {
                spanRuleWidth = elemWidth;
                Elem.style.fontSize = (currentFontSize - 3) + 'px';
            }
        }
        
        if (getReduce) {
            let getReduceInPx = currentFontSize - (getReduce * 100 / currentFontSize);
            Elem.style.fontSize = `${getReduceInPx}px`;
            Elem.style.lineHeight = `${getReduceInPx}px`;
        }
        if (getLineHeight) {
            let addLineHeight = currentFontSize + (+getLineHeight);
            Elem.style.lineHeight = `${addLineHeight}px`;
        }

        Elem.style.display = 'block';
    }
}

new fitFontSize();