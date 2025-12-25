# Mi Primer Programa JavaScript: Interactive Ripple
## Introducción a JavaScript a través de Efectos Visuales Interactivos

**Curso:** Introducción a JavaScript  
**Proyecto:** Sistema de Ripple Interactivo + Terminal Encryption  
**Instructor:** Claude (Lempyrλ)  
**Estudiante:** Lempyra  
**Fecha:** Diciembre 2024

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [PASO 4: Ripple Algorithm (EL CORE)](#paso-4-ripple-algorithm-el-core)
3. [Ventana Interactiva Tipo Terminal](#ventana-interactiva-tipo-terminal)
4. [Algoritmo de Encriptación de Texto](#algoritmo-de-encriptación-de-texto)
5. [Análisis de los Sitios Creados](#análisis-de-los-sitios-creados)
6. [Conceptos JavaScript Aprendidos](#conceptos-javascript-aprendidos)
7. [Ejercicios Propuestos](#ejercicios-propuestos)

---

## Introducción

### ¿Por qué NO empezar con "Hello World"?

La mayoría de cursos de programación empiezan con:
```javascript
console.log("Hello World");
```

**Problema:** Es aburrido y no enseña nada útil.

**Nuestra filosofía:** Aprender JavaScript creando algo visualmente impresionante desde el primer día.

### Lo que construimos

En este curso creamos 7 sitios web profesionales con efectos interactivos:
1. **blendStory.xyz** - Hexágonos amarillos (escritura creativa)
2. **jezabel.net** - Constelación hacker + terminal encriptado
3. **jezabel.xyz** - Hexágonos naranjas giratorios
4. **storiesbyjez.com** - Ondas horizontales + ripples
5. **ModUrWall.com** - Grid de cuadrados con wave lift
6. **ManiacGaming.Online** - Triángulos caos→orden
7. **mividacomoluna.com** - Ondas púrpuras (dark romance)

**Todos comparten el mismo algoritmo base: Distance-Based Ripple Propagation**

---

## PASO 4: Ripple Algorithm (EL CORE)

### Concepto Fundamental

**Pregunta:** ¿Cómo hacer que un click en un punto afecte elementos en toda la pantalla de manera coordinada?

**Respuesta:** Usando la **distancia** para calcular el **delay** de cada elemento.

---

### El Algoritmo Completo (Paso a Paso)

#### **Paso 4.1: Detectar el Click**

```javascript
document.addEventListener('click', (event) => {
    const clickX = event.clientX; // Posición X del mouse
    const clickY = event.clientY; // Posición Y del mouse
    
    console.log(`Click en: (${clickX}, ${clickY})`);
});
```

**¿Qué hace?**
- `addEventListener` = "escucha" por eventos (en este caso clicks)
- `event.clientX` = coordenada horizontal donde clickeaste (en píxeles desde la izquierda)
- `event.clientY` = coordenada vertical donde clickeaste (en píxeles desde arriba)

**Ejemplo:**
- Si clickeás en la esquina superior izquierda: `(0, 0)`
- Si clickeás en el centro de una pantalla 1920×1080: `(960, 540)`

---

#### **Paso 4.2: Convertir Click a Posición en Grid**

```javascript
// Configuración del grid
const squareSize = 45; // 40px cuadrado + 5px gap
const clickCol = Math.floor((clickX - 50) / squareSize);
const clickRow = Math.floor((clickY - 50) / squareSize);

console.log(`Grid position: col=${clickCol}, row=${clickRow}`);
```

**¿Por qué convertir?**

Porque nuestros elementos están organizados en un **grid** (filas y columnas), no en coordenadas arbitrarias.

**Ejemplo visual:**
```
Pantalla (píxeles):        Grid (columnas/filas):
┌─────────────────┐        ┌───┬───┬───┬───┐
│                 │        │0,0│1,0│2,0│3,0│
│   Click (123,   │   →    ├───┼───┼───┼───┤
│         67)     │        │0,1│1,1│2,1│3,1│
│                 │        ├───┼───┼───┼───┤
└─────────────────┘        │0,2│1,2│2,2│3,2│
                           └───┴───┴───┴───┘
```

**Math.floor()** redondea hacia abajo:
- `Math.floor(2.8)` = `2`
- `Math.floor(123 / 45)` = `2` (columna 2)

---

#### **Paso 4.3: Calcular Distancia (Teorema de Pitágoras)**

Este es **EL CORAZÓN** del algoritmo.

```javascript
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;  // Diferencia horizontal
    const dy = y2 - y1;  // Diferencia vertical
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
}
```

**Teorema de Pitágoras:**
```
    B (x2, y2)
    ╱│
   ╱ │ dy
  ╱  │
 ╱   │
A────┘
(x1, y1)
  dx

distancia = √(dx² + dy²)
```

**Ejemplo numérico:**
```javascript
// Click en (5, 3)
const clickCol = 5;
const clickRow = 3;

// Cuadrado en (8, 7)
const squareCol = 8;
const squareRow = 7;

// Calcular diferencias
const dx = 8 - 5 = 3;
const dy = 7 - 3 = 4;

// Aplicar Pitágoras
const distance = Math.sqrt(3*3 + 4*4)
               = Math.sqrt(9 + 16)
               = Math.sqrt(25)
               = 5

// Este cuadrado está a distancia 5 del click
```

**¿Por qué es importante la distancia?**

Porque la usaremos para calcular **cuándo** animar cada elemento:
- Elementos **cerca** del click → animan **pronto**
- Elementos **lejos** del click → animan **después**
- Resultado: **efecto de onda** visual

---

#### **Paso 4.4: Loop Through All Elements**

```javascript
squares.forEach((square) => {
    // 1. Obtener posición del cuadrado
    const squareCol = parseInt(square.dataset.col);
    const squareRow = parseInt(square.dataset.row);
    
    // 2. Calcular distancia desde el click
    const distance = calculateDistance(
        clickCol, clickRow,
        squareCol, squareRow
    );
    
    // 3. Calcular delay basado en distancia
    const delay = distance * 50; // milisegundos
    
    console.log(`Cuadrado (${squareCol}, ${squareRow}): distancia=${distance}, delay=${delay}ms`);
});
```

**¿Qué significa `forEach`?**

Es un loop que ejecuta código para cada elemento en un array:

```javascript
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num) => {
    console.log(num * 2);
});

// Output:
// 2
// 4
// 6
// 8
// 10
```

**En nuestro caso:**
- Tenemos un array `squares` con 200 cuadrados
- `forEach` ejecuta el código para cada uno
- Calculamos su distancia individual al punto de click

---

#### **Paso 4.5: Animar con Delay**

```javascript
squares.forEach((square) => {
    const squareCol = parseInt(square.dataset.col);
    const squareRow = parseInt(square.dataset.row);
    
    const distance = calculateDistance(clickCol, clickRow, squareCol, squareRow);
    const delay = distance * 50;
    
    // 4. Animar después del delay calculado
    setTimeout(() => {
        // ANIMACIÓN: cambiar color y tamaño
        square.style.background = rippleColor;
        square.style.transform = 'scale(1.3)';
        
        // RESET: volver a normal después de 400ms
        setTimeout(() => {
            square.style.background = '#1a1a1a';
            square.style.transform = 'scale(1)';
        }, 400);
        
    }, delay); // ← Delay basado en distancia
});
```

**¿Qué es setTimeout?**

Una función que ejecuta código **después** de un tiempo:

```javascript
console.log("Ahora");

setTimeout(() => {
    console.log("Después de 2 segundos");
}, 2000); // 2000 milisegundos = 2 segundos

console.log("Inmediatamente después");

// Output:
// Ahora
// Inmediatamente después
// (espera 2 segundos)
// Después de 2 segundos
```

**¿Por qué setTimeout anidado?**

```javascript
setTimeout(() => {
    // Primer cambio (animar)
    square.style.background = 'red';
    
    setTimeout(() => {
        // Segundo cambio (reset)
        square.style.background = 'black';
    }, 400);
    
}, delay);
```

**Timeline:**
```
Tiempo 0ms:     Click detectado
Tiempo 50ms:    Cuadrado cercano (dist=1) → rojo
Tiempo 100ms:   Cuadrado medio (dist=2) → rojo
Tiempo 150ms:   Cuadrado lejano (dist=3) → rojo
Tiempo 450ms:   Cuadrado cercano → negro (50+400)
Tiempo 500ms:   Cuadrado medio → negro (100+400)
Tiempo 550ms:   Cuadrado lejano → negro (150+400)
```

**Resultado visual:** Onda expandiendo y contrayendo.

---

### Visualización del Algoritmo Completo

**Estado inicial:**
```
████████████████
████████████████
████████████████  ← Todos los cuadrados normales
████████████████
████████████████
```

**Click en centro:**
```
████████████████
████████████████
████████⭕██████  ← Click position (col=8, row=2)
████████████████
████████████████
```

**Después de 50ms (distance=1 squares light up):**
```
████████████████
████████🟥██████  ← distance=1
████████🟥██████
████████🟥██████
████████████████
```

**Después de 100ms (distance=2 squares light up):**
```
████████████████
████████🟥██████
████🟥🟥🟥🟥████  ← distance=2
████████🟥██████
████████████████
```

**Después de 150ms (distance=3 squares light up):**
```
████████🟥██████
████🟥🟥🟥🟥████
🟥🟥🟥🟥🟥🟥🟥🟥  ← distance=3
████🟥🟥🟥🟥████
████████🟥██████
```

**Resultado:** Onda que expande y se contrae = **RIPPLE EFFECT** 🌊

---

## Ventana Interactiva Tipo Terminal

### Concepto: Terminal Hacker de jezabel.net

**Ubicación:** `jezabel.net` → scroll to "access the library"

**Funcionalidad:** Terminal que responde a comandos y ejecuta acciones en la página.

---

### HTML: Input Terminal

```html
<div class="access-terminal">
    <div class="terminal-line">$ <span>jezabel init</span></div>
    <div class="terminal-line">→ authenticating...</div>
    <div class="terminal-line">→ codex access: <span>granted</span></div>
    <div class="terminal-line">→ modules available: <span>101</span></div>
    <div class="terminal-line">
        $ <input type="text" 
                 id="terminal-input" 
                 placeholder="type 'jezabel init' to scramble">
    </div>
</div>
```

**Styling del input:**
```css
#terminal-input {
    background: transparent;
    border: none;
    color: #ff00ff;
    font-family: 'Courier New', monospace;
    font-size: inherit;
    outline: none;
    width: 80%;
}
```

**¿Por qué transparente?**

Para que se vea como parte del terminal, no como un campo de formulario tradicional.

---

### JavaScript: Command Listener

```javascript
const terminalInput = document.getElementById('terminal-input');

terminalInput.addEventListener('keypress', (event) => {
    // Detectar si presionó Enter
    if (event.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        
        console.log(`Comando ingresado: "${command}"`);
        
        // Ejecutar comando
        if (command === 'jezabel init') {
            scrambleText(); // Función que encripta el texto
            terminalInput.value = ''; // Limpiar input
        } else {
            console.log('Comando no reconocido');
        }
    }
});
```

**¿Qué es `event.key`?**

Propiedad que indica qué tecla fue presionada:
- `'Enter'` = tecla Enter
- `'a'` = tecla A
- `'Escape'` = tecla Escape
- `' '` = espacio

**¿Qué hace `.trim().toLowerCase()`?**

```javascript
const input = "  JEZABEL INIT  ";

input.trim();        // "JEZABEL INIT" (quita espacios)
input.toLowerCase(); // "jezabel init" (a minúsculas)

// Combinado:
input.trim().toLowerCase(); // "jezabel init"
```

**¿Por qué?** Para que el comando funcione sin importar mayúsculas o espacios extra.

---

## Algoritmo de Encriptación de Texto

### Objetivo

Transformar todo el texto de la página en caracteres random, manteniendo:
- Longitud original
- Espacios
- Puntuación
- Case (mayúsculas/minúsculas)

---

### El Algoritmo (Línea por Línea)

```javascript
const scrambled = originalText
    .split('')
    .map(char => {
        if (char === ' ') return ' ';
        if (char.match(/[a-z]/i)) {
            return String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        return char;
    })
    .join('');
```

**Paso a paso:**

#### **1. `.split('')` - Convertir string a array de caracteres**

```javascript
const text = "Hello World";
const chars = text.split('');

console.log(chars);
// ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]
```

**¿Por qué?** Porque necesitamos procesar cada letra individualmente.

---

#### **2. `.map()` - Transformar cada carácter**

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

**`.map()` crea un NUEVO array** aplicando una transformación a cada elemento.

---

#### **3. `if (char === ' ') return ' '` - Mantener espacios**

```javascript
.map(char => {
    if (char === ' ') {
        return ' '; // No cambiar espacios
    }
    // ... resto del código
})
```

**Ejemplo:**
```
Original:  "Hello World"
Scrambled: "Kxmpa Qwrtd"
            ↑
            Espacio preservado
```

---

#### **4. `char.match(/[a-z]/i)` - Detectar letras**

```javascript
'a'.match(/[a-z]/i);  // ✅ true (es letra)
'Z'.match(/[a-z]/i);  // ✅ true (es letra)
'5'.match(/[a-z]/i);  // ❌ null (no es letra)
'.'.match(/[a-z]/i);  // ❌ null (no es letra)
```

**¿Qué es `/[a-z]/i`?**

Es una **expresión regular** (regex):
- `[a-z]` = cualquier letra de a a z
- `i` = case-insensitive (ignora mayúsculas/minúsculas)

---

#### **5. `String.fromCharCode()` - Generar letra random**

```javascript
String.fromCharCode(97);  // 'a'
String.fromCharCode(98);  // 'b'
String.fromCharCode(122); // 'z'
```

**ASCII Table (parcial):**
| Código | Carácter |
|--------|----------|
| 65 | A |
| 90 | Z |
| 97 | a |
| 122 | z |

**Para generar letra minúscula random:**
```javascript
// Letras minúsculas = códigos 97-122 (26 letras)

const randomCode = 97 + Math.floor(Math.random() * 26);
const randomLetter = String.fromCharCode(randomCode);

console.log(randomLetter); // 'k', 'x', 'm', etc.
```

**Desglosando:**
```javascript
Math.random();              // 0.0 - 0.999...
Math.random() * 26;         // 0.0 - 25.999...
Math.floor(Math.random() * 26); // 0 - 25 (entero)
97 + Math.floor(Math.random() * 26); // 97 - 122
```

---

#### **6. `.join('')` - Array de vuelta a string**

```javascript
const chars = ['K', 'x', 'm', 'p', 'a'];
const text = chars.join('');

console.log(text); // "Kxmpa"
```

**Opposite de `.split()`:**
```javascript
// Split: string → array
"Hello".split(''); // ["H", "e", "l", "l", "o"]

// Join: array → string
["H", "e", "l", "l", "o"].join(''); // "Hello"
```

---

### Implementación Completa con Case Sensitivity

```javascript
let originalText = {};
let isScrambled = false;

function scrambleToggle() {
    const elements = document.querySelectorAll('p, h1, h2, h3, li');
    
    elements.forEach((element, index) => {
        if (!isScrambled) {
            // SCRAMBLE: guardar original y encriptar
            originalText[index] = element.textContent;
            
            const scrambled = element.textContent
                .split('')
                .map(char => {
                    if (char === ' ') return ' ';
                    
                    // Letras minúsculas
                    if (char.match(/[a-z]/)) {
                        return String.fromCharCode(97 + Math.floor(Math.random() * 26));
                    }
                    
                    // Letras MAYÚSCULAS
                    if (char.match(/[A-Z]/)) {
                        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    }
                    
                    return char; // Puntuación
                })
                .join('');
            
            element.textContent = scrambled;
            
        } else {
            // RESTORE: volver al original
            element.textContent = originalText[index];
        }
    });
    
    isScrambled = !isScrambled;
}
```

---

## Análisis de los Sitios Creados

### Resumen de Todos los Proyectos

| Site | Efecto | Trigger | Colores | Algoritmo |
|------|--------|---------|---------|-----------|
| **blendStory.xyz** | Hex wave | Auto + Click | Yellow #ffcc33 | Distance ripple |
| **jezabel.net** | Constellation + Terminal | Click + Command | Magenta/Green | Particle + Text scramble |
| **jezabel.xyz** | Hex rotation | Auto wave | Orange #ff6b35 | Distance ripple |
| **storiesbyjez.com** | Horizontal waves | Auto + Click | Red #ff3344 | Canvas wave lines |
| **ModUrWall.com** | Square lift | Auto + Click | Blue/RGB | Distance ripple |
| **ManiacGaming.Online** | Triangle chaos→order | Auto + Click | Red #ff3333 | Distance ripple (inverted) |
| **mividacomoluna.com** | Horizontal waves | Auto + Click | Purple #9b59d0 | Canvas wave lines |

---

### Patrón Común: Distance-Based Propagation

**TODOS los efectos usan el mismo algoritmo core:**

```javascript
elements.forEach(element => {
    const distance = calculateDistance(clickPoint, element);
    const delay = distance * speedFactor;
    
    setTimeout(() => {
        animate(element);
    }, delay);
});
```

**Variaciones:**

1. **blendStory/jezabel.xyz/storiesbyjez** - Hexágonos
2. **ModUrWall** - Cuadrados
3. **ManiacGaming** - Triángulos
4. **jezabel.net** - Partículas (estrellas)

**Misma matemática, diferentes formas.**

---

## Conceptos JavaScript Aprendidos

### 1. Variables y Tipos de Datos

```javascript
// String
const text = "Hello World";

// Number
const distance = 5.5;

// Boolean
const isScrambled = true;

// Array
const colors = ['#ff0000', '#00ff00', '#0000ff'];

// Object
const square = {
    x: 100,
    y: 200,
    color: '#ff0000'
};
```

---

### 2. Funciones

```javascript
// Function declaration
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Arrow function
const add = (a, b) => a + b;
```

---

### 3. Event Listeners

```javascript
// Click
document.addEventListener('click', (event) => {
    console.log(event.clientX, event.clientY);
});

// Keypress
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log('Enter pressed');
    }
});
```

---

### 4. Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - loop
numbers.forEach(num => console.log(num));

// map - transform
const doubled = numbers.map(num => num * 2);

// filter - select
const evens = numbers.filter(num => num % 2 === 0);
```

---

### 5. String Methods

```javascript
const text = "  Hello World  ";

text.split('');      // ["H","e","l",...,"d"]
text.trim();         // "Hello World"
text.toLowerCase();  // "hello world"
text.toUpperCase();  // "HELLO WORLD"

const chars = ['H','i'];
chars.join('');      // "Hi"
```

---

### 6. Math

```javascript
Math.random();           // 0.0 - 0.999...
Math.floor(3.8);        // 3
Math.sqrt(25);          // 5
Math.abs(-5);           // 5
```

---

### 7. DOM Manipulation

```javascript
// Select
const element = document.querySelector('.square');
const all = document.querySelectorAll('.square');

// Create
const div = document.createElement('div');
div.className = 'square';

// Style
element.style.background = 'red';
element.style.transform = 'scale(1.5)';
```

---

### 8. Timing Functions

```javascript
// setTimeout - run once
setTimeout(() => {
    console.log('After 2s');
}, 2000);

// requestAnimationFrame - animation loop
function animate() {
    draw();
    requestAnimationFrame(animate);
}
```

---

## Ejercicios Propuestos

### Ejercicio 1: Modificar Velocidad

**Task:** Hacer el ripple más rápido o más lento

```javascript
// Original
const delay = distance * 50;

// Tu código aquí:
const delay = distance * ???;
```

---

### Ejercicio 2: Agregar Nuevo Comando

**Task:** Agregar comando "reverse" que invierte el texto

```javascript
// Ejemplo: "Hello" → "olleH"
```

---

### Ejercicio 3: Color por Distancia

**Task:** Cambiar color según distancia (cerca=rojo, lejos=azul)

```javascript
const hue = distance * 10;
const color = `hsl(${hue}, 100%, 50%)`;
```

---

## Conclusión

### Lo que Aprendiste

✅ **Matemáticas aplicadas:** Teorema de Pitágoras  
✅ **Algoritmos visuales:** Distance-based propagation  
✅ **DOM Manipulation:** Crear y animar elementos  
✅ **Event handling:** Clicks, teclado, touch  
✅ **String manipulation:** Split, map, join, regex  
✅ **Terminal interactivo:** Command parsing  

### Proyectos Completados

**7 sitios web profesionales con efectos interactivos**

### Próximos Pasos

1. Canvas API avanzado
2. WebGL para GPU acceleration
3. Audio reactive visualizations
4. Particle physics systems

---

### Recursos

- **MDN Web Docs:** https://developer.mozilla.org/
- **JavaScript.info:** https://javascript.info/
- **Regex101:** https://regex101.com/

---

**Anexo:** Ver `interactive-ripple-complete.html` para código completo funcional.

---

*"El mejor momento para empezar a programar fue hace 10 años. El segundo mejor momento es ahora."*

🌊 **Happy coding, Lempyra!** 🚀
