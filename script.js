document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIG ---
    const appState = {
        widget: 'QPushButton',
        state: 'normal', // normal, hover, pressed
        styles: {
            normal: {}, hover: {}, pressed: {}
        }
    };

    // Mapping inputs to properties. Note: NO ALPHA.
    const propsMap = {
        'background-color': { type: 'color', id: 'bg' },
        'color':            { type: 'color', id: 'text' },
        'border-color':     { type: 'color', id: 'border_col' },
        'border-width':     { type: 'px',    id: 'border_width', disp: 'disp_border_width' },
        'border-radius':    { type: 'px',    id: 'border_radius', disp: 'disp_border_radius' },
        'padding':          { type: 'px',    id: 'padding', disp: 'disp_padding' },
        'font-size':        { type: 'px',    id: 'font_size', disp: 'disp_font_size' },
        'font-family':      { type: 'raw',   id: 'font_family' }
    };

    // DOM Refs
    const els = {
        widgetSel: document.getElementById('widgetSelector'),
        tabs: document.querySelectorAll('.tab'),
        previewStage: document.getElementById('previewStage'),
        qssOutput: document.getElementById('qssOutput'),
        styleTag: document.getElementById('dynamic-style'),
        themeToggle: document.getElementById('themeToggle'),
        magicBtn: document.getElementById('magicBtn'),
        copyBtn: document.getElementById('copyBtn'),
        statusMsg: document.getElementById('copyStatus'),
        previewBadge: document.getElementById('previewBadge')
    };

    // --- INITIALIZATION ---
    function init() {
        // Init state structure
        ['normal', 'hover', 'pressed'].forEach(st => {
            Object.keys(propsMap).forEach(prop => {
                // Store value as pure hex or string
                appState.styles[st][prop] = { enabled: false, value: '#000000' };
            });
        });

        renderWidget();
        setupEvents();
    }

// --- RENDER WIDGET ---
    function renderWidget() {
        els.previewStage.innerHTML = '';
        const type = els.widgetSel.value;
        appState.widget = type;
        
        let el;
        
        // Simulación HTML de los widgets de Qt
        if (type === 'QPushButton') {
            el = document.createElement('button'); 
            el.innerText = 'Botón de Prueba';
        } 
        else if (type === 'QLabel') {
            el = document.createElement('div'); 
            el.innerText = 'Texto de etiqueta (Label)';
            el.style.display = 'inline-block';
        } 
        else if (type === 'QLineEdit') {
            el = document.createElement('input'); 
            el.value = 'Texto editable...';
        } 
        else if (type === 'QCheckBox') {
            el = createCheck('checkbox', 'Opción Checkbox');
        } 
        else if (type === 'QRadioButton') {
            el = createCheck('radio', 'Opción Radio');
        } 
        else if (type === 'QProgressBar') {
            el = document.createElement('div');
            el.style.width = '250px'; 
            el.style.height = '24px'; 
            el.style.background = 'rgba(255,255,255,0.1)'; 
            el.style.border = '1px solid #555';
            el.style.position = 'relative';
            el.innerHTML = '<div style="width:60%; height:100%; background:currentColor; opacity:0.7;"></div>';
        } 
        else if (type === 'QComboBox') {
            el = document.createElement('select'); 
            el.innerHTML = '<option>Elemento 1</option><option>Elemento 2</option><option>Elemento 3</option>';
        } 
        else if (type === 'QTextEdit') {
            el = document.createElement('textarea'); 
            el.rows = 5; 
            el.value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nEditando texto multilínea...';
        } 
        else if (type === 'QTableWidget') {
            // CREACIÓN DE LA TABLA CON LOS CAMPOS SOLICITADOS
            el = document.createElement('table');
            
            // Estilos base para que se vea bien inmediatamente (antes de aplicar QSS)
            el.style.borderCollapse = 'collapse';
            el.style.width = '100%';
            el.style.minWidth = '300px';
            el.style.textAlign = 'left';
            el.style.fontSize = '0.9rem';
            
            // Estilos para celdas internas (simulando bordes de grilla de Qt)
            const tdStyle = 'border: 1px solid #555; padding: 6px 10px;';
            const thStyle = 'border: 1px solid #555; padding: 6px 10px; background: rgba(128, 128, 128, 0.15); font-weight: bold;';

            el.innerHTML = `
                <thead>
                    <tr>
                        <th style="${thStyle}">ID</th>
                        <th style="${thStyle}">NOMBRE</th>
                        <th style="${thStyle}">CORREO</th>
                        <th style="${thStyle}">CELULAR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="${tdStyle}">1000</td>
                        <td style="${tdStyle}">Ximena Alatorre</td>
                        <td style="${tdStyle}">ximena@correo.com</td>
                        <td style="${tdStyle}">3313467985</td>
                    </tr>
                    <tr>
                        <td style="${tdStyle}">2000</td>
                        <td style="${tdStyle}">Esteban Jimenez</td>
                        <td style="${tdStyle}">esteban@correo.com</td>
                        <td style="${tdStyle}">3346851352</td>
                    </tr>
                    <tr>
                        <td style="${tdStyle}">3000</td>
                        <td style="${tdStyle}">María Valdez</td>
                        <td style="${tdStyle}">maria@correo.com</td>
                        <td style="${tdStyle}">3363968520</td>
                    </tr>
                </tbody>
            `;
        } 
        else if (type === 'QGroupBox') {
            el = document.createElement('fieldset'); 
            el.style.minWidth = '200px';
            el.innerHTML = '<legend>Título del Grupo</legend><div style="padding:10px;">Contenido del grupo...</div>';
        }
        else {
            // Fallback
            el = document.createElement('div'); 
            el.innerText = 'Widget Genérico';
        }

        // Clases y IDs necesarios para que el generador funcione
        el.classList.add('sim-widget');
        el.id = 'sim-el';
        
        els.previewStage.appendChild(el);
        updateOutput();
    }

    function createCheck(type, text) {
        const w = document.createElement('div');
        w.style.display = 'flex'; w.style.gap = '8px'; w.style.alignItems = 'center';
        w.innerHTML = `<input type="${type}" checked><span>${text}</span>`;
        return w;
    }

    // --- INPUT HANDLING ---
    function handleInput(e) {
        const target = e.target;
        const st = appState.state;

        // 1. Checkbox (Enable/Disable)
        if (target.type === 'checkbox' && target.dataset.prop) {
            appState.styles[st][target.dataset.prop].enabled = target.checked;
            updateOutput();
            return;
        }

        // 2. Determine Property Key
        // We look for the ID in our propsMap
        let key = null;
        let conf = null;

        // Helper for color inputs (picker vs hex text)
        if (target.id.includes('_picker') || target.id.includes('_hex')) {
            const coreId = target.id.replace('_picker', '').replace('_hex', '');
            // Find map entry with this id
            key = Object.keys(propsMap).find(k => propsMap[k].id === coreId);
        } else {
            key = Object.keys(propsMap).find(k => propsMap[k].id === target.id);
        }

        if (!key) return;
        conf = propsMap[key];

        // 3. Update State & UI Sync
        let val = target.value;
        
        if (conf.type === 'color') {
            // Sync picker <-> text
            const picker = document.getElementById(conf.id + '_picker');
            const text = document.getElementById(conf.id + '_hex');
            
            if (target.type === 'color') text.value = val;
            else picker.value = val; // Assuming valid hex for simplicity
            
            appState.styles[st][key].value = val;
        } else {
            appState.styles[st][key].value = val;
            // Update range label
            if (conf.disp) document.getElementById(conf.disp).innerText = val + (conf.type === 'px' ? 'px' : '');
        }

        updateOutput();
    }

    // --- LOAD UI FROM STATE ---
    function loadUI(state) {
        const styles = appState.styles[state];
        
        Object.keys(styles).forEach(prop => {
            const item = styles[prop];
            const conf = propsMap[prop];

            // Checkbox
            const cb = document.querySelector(`input[data-prop="${prop}"]`);
            if (cb) cb.checked = item.enabled;

            if (conf.type === 'color') {
                document.getElementById(conf.id + '_picker').value = item.value || '#000000';
                document.getElementById(conf.id + '_hex').value = item.value || '#000000';
            } else {
                const input = document.getElementById(conf.id);
                if (input) {
                    input.value = item.value;
                    if (conf.disp) document.getElementById(conf.disp).innerText = item.value + (conf.type === 'px' ? 'px' : '');
                }
            }
        });
        
        els.previewBadge.innerText = state.charAt(0).toUpperCase() + state.slice(1);
    }

    // --- GENERATE OUTPUT (HEX ONLY) ---
    function updateOutput() {
        let css = '';
        let qss = '';
        
        const maps = {
            normal: { css: '', qss: '' },
            hover: { css: ':hover', qss: ':hover' },
            pressed: { css: ':active', qss: ':pressed' }
        };

        ['normal', 'hover', 'pressed'].forEach(st => {
            const data = appState.styles[st];
            let props = [];
            let qssPropsList = [];

            Object.keys(data).forEach(prop => {
                if (data[prop].enabled) {
                    let val = data[prop].value;
                    let conf = propsMap[prop];

                    // Unit appending
                    if (conf.type === 'px') val += 'px';
                    
                    // Font fallback for CSS
                    let cssVal = val;
                    if (prop === 'font-family') cssVal = `${val}, sans-serif`;

                    props.push(`${prop}: ${cssVal};`);
                    qssPropsList.push(`${prop}: ${val};`);
                }
            });

            if (props.length > 0) {
                const selector = '#sim-el' + maps[st].css;
                css += `${selector} { ${props.join(' ')} }\n`;

                const qssSel = appState.widget + maps[st].qss;
                qss += `${qssSel} {\n    ${qssPropsList.join('\n    ')}\n}\n`;
            }
        });

        els.styleTag.textContent = css;
        els.qssOutput.textContent = qss || '/* Selecciona atributos para generar código... */';
    }

    // --- MAGIC WAND (HEX HARMONY) ---
    function magicWand() {
        // 1. Random Hue
        const hue = Math.floor(Math.random() * 360);
        
        // Helper: HSL to HEX
        const hslToHex = (h, s, l) => {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        };

        const baseColor = hslToHex(hue, 60, 50); // Balanced
        const hoverColor = hslToHex(hue, 60, 65); // Lighter
        const pressedColor = hslToHex(hue, 60, 40); // Darker
        const contrastText = '#ffffff'; // Simplified for dark backgrounds

        // Apply to 'normal' state in memory
        const s = appState.styles.normal;
        s['background-color'] = { enabled: true, value: baseColor };
        s['color'] = { enabled: true, value: contrastText };
        s['border-color'] = { enabled: true, value: pressedColor };
        s['border-width'] = { enabled: true, value: '1' };
        s['border-radius'] = { enabled: true, value: '4' };
        s['padding'] = { enabled: true, value: '6' };

        // Apply hover/pressed bg only
        appState.styles.hover['background-color'] = { enabled: true, value: hoverColor };
        appState.styles.pressed['background-color'] = { enabled: true, value: pressedColor };

        loadUI(appState.state);
        updateOutput();
    }

    // --- EVENTS ---
    function setupEvents() {
        els.widgetSel.addEventListener('change', () => { renderWidget(); updateOutput(); });
        
        els.tabs.forEach(t => t.addEventListener('click', () => {
            els.tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            appState.state = t.dataset.state;
            loadUI(appState.state);
        }));

        // Delegate Inputs
        document.querySelector('.sidebar').addEventListener('input', handleInput);

        els.magicBtn.addEventListener('click', magicWand);
        els.themeToggle.addEventListener('click', () => document.body.classList.toggle('light-theme'));

        els.copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(els.qssOutput.textContent);
            els.statusMsg.innerText = '¡Copiado!';
            els.statusMsg.classList.add('visible');
            setTimeout(() => els.statusMsg.classList.remove('visible'), 2000);
        });
    }

    init();
});