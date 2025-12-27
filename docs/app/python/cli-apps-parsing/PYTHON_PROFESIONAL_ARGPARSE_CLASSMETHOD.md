# Mi Primer Programa Python Profesional
## De Scripts a Herramientas CLI con argparse y @classmethod

**Curso:** Python Intermedio - Arquitectura de Código  
**Proyecto:** Sistema Multi-Configuración con Patrones Factory  
**Instructor:** Claude (Lempyrλ)  
**Estudiante:** Lempyra  
**Fecha:** Diciembre 2024

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [¿Por Qué NO "Hello World"?](#por-qué-no-hello-world)
3. [argparse: De Script a CLI Tool](#argparse-de-script-a-cli-tool)
4. [classmethod: Múltiples Constructores](#classmethod-múltiples-constructores)
5. [Ejemplo Básico: Sistema de Laptops](#ejemplo-básico-sistema-de-laptops)
6. [Ejemplo Intermedio: Servidor Web](#ejemplo-intermedio-servidor-web)
7. [Ejemplo Avanzado: Orquestador](#ejemplo-avanzado-orquestador)
8. [Patrones de Diseño Aplicados](#patrones-de-diseño-aplicados)
9. [Conceptos Python Aprendidos](#conceptos-python-aprendidos)
10. [Ejercicios Propuestos](#ejercicios-propuestos)

---

## Introducción

### Filosofía Lempyrλ: Código Como LEGO

**Principio fundamental:** El mejor código es aquel que se puede reutilizar, combinar y evolucionar sin romper lo que ya funciona.

**Analogía:**
```
Código Malo (Monolito):
    └── Un bloque gigante e inamovible

Código Bueno (LEGO):
    ├── Pieza 1 (argparse) - CLI parsing
    ├── Pieza 2 (@classmethod) - Multiple constructors
    └── Pieza 3 (Config) - Data structures
        → Se combinan de infinitas formas
```

---

## ¿Por Qué NO "Hello World"?

La mayoría de tutoriales empiezan con:
```python
print("Hello World")
```

**Problemas:**
1. No enseña nada útil
2. No se usa en código real
3. Es aburrido

**Nuestra aproximación:**

```python
# Nivel 1: Script básico
puerto = 8080  # ¿Quieres cambiar? Edita código

# Nivel 2: Script con argparse (HOY)
python servidor.py --puerto 9000  # No editas código

# Nivel 3: Múltiples formas (HOY)
servidor = Servidor.desarrollo()      # @classmethod
servidor = Servidor.desde_json(...)   # @classmethod
servidor = Servidor.desde_ambiente()  # @classmethod
```

**Resultado:** Aprendes creando herramientas que usarás mañana.

---

## argparse: De Script a CLI Tool

### El Problema

```python
# version_mala.py
puerto = 8080
host = 'localhost'

# Para cambiar el puerto:
# 1. Abrir archivo
# 2. Editar línea 2
# 3. Guardar
# 4. Ejecutar
```

**Consecuencias:**
- Cada usuario necesita editar código
- Errores de sintaxis al editar
- No hay validación
- No hay ayuda

---

### La Solución: argparse

```python
# version_buena.py
import argparse

parser = argparse.ArgumentParser(description='Mi Servidor')
parser.add_argument('--puerto', type=int, default=8080)
parser.add_argument('--host', default='localhost')

args = parser.parse_args()

# Uso:
# python version_buena.py --puerto 9000 --host 0.0.0.0
# python version_buena.py --help  # ← Automático!
```

**Ventajas:**
- ✅ No se edita código
- ✅ Validación automática (type=int)
- ✅ Ayuda generada (--help)
- ✅ Valores por defecto
- ✅ Aspecto profesional

---

### Anatomía de argparse

```python
import argparse

# 1. Crear parser
parser = argparse.ArgumentParser(
    description='Descripción de tu programa',
    epilog='Texto al final del --help'
)

# 2. Agregar argumentos
parser.add_argument(
    '--puerto',              # Nombre del argumento
    type=int,               # Tipo de dato
    default=8080,           # Valor por defecto
    help='Puerto TCP'       # Texto de ayuda
)

parser.add_argument(
    '-v', '--verbose',      # Forma corta y larga
    action='store_true',    # Flag booleano
    help='Modo verbose'
)

parser.add_argument(
    '--config',
    required=True,          # Obligatorio
    help='Archivo de configuración'
)

# 3. Parsear
args = parser.parse_args()

# 4. Usar
print(f"Puerto: {args.puerto}")
print(f"Verbose: {args.verbose}")
```

**Output del --help (automático):**
```
usage: programa.py [-h] --config CONFIG [--puerto PUERTO] [-v]

Descripción de tu programa

optional arguments:
  -h, --help            show this help message and exit
  --config CONFIG       Archivo de configuración
  --puerto PUERTO       Puerto TCP
  -v, --verbose         Modo verbose

Texto al final del --help
```

---

## classmethod: Múltiples Constructores

### El Problema

```python
class Servidor:
    def __init__(self, host, puerto, ssl, workers, timeout, ...):
        # 10+ parámetros
        pass

# Crear servidor de desarrollo
servidor = Servidor('localhost', 8080, False, 4, 30, ...)
#                   ↑ ¿Qué era esto?  ↑ ¿Y esto?

# Crear servidor de producción
servidor = Servidor('0.0.0.0', 443, True, 100, 60, ...)
#                   ↑ Fácil equivocarse
```

**Problemas:**
- Muchos parámetros confusos
- Fácil equivocarse en el orden
- Duplicar configuraciones comunes
- No autodocumentado

---

### La Solución: @classmethod

```python
class Servidor:
    def __init__(self, host, puerto, ssl, workers):
        self.host = host
        self.puerto = puerto
        self.ssl = ssl
        self.workers = workers
    
    @classmethod
    def desarrollo(cls):
        """Preset para desarrollo local"""
        return cls(
            host='localhost',
            puerto=8080,
            ssl=False,
            workers=4
        )
    
    @classmethod
    def produccion(cls):
        """Preset para producción"""
        return cls(
            host='0.0.0.0',
            puerto=443,
            ssl=True,
            workers=100
        )
    
    @classmethod
    def desde_json(cls, archivo):
        """Carga desde archivo JSON"""
        import json
        with open(archivo) as f:
            config = json.load(f)
        return cls(**config)

# USO - Mucho más claro:
srv_dev = Servidor.desarrollo()
srv_prod = Servidor.produccion()
srv_custom = Servidor.desde_json('config.json')
```

**Ventajas:**
- ✅ Nombres descriptivos
- ✅ Configuraciones reusables
- ✅ Múltiples fuentes (JSON, ENV, presets)
- ✅ Autodocumentado

---

### ¿Qué Significa @classmethod?

```python
class MiClase:
    
    # Método NORMAL - recibe self (la instancia)
    def metodo_normal(self):
        print(f"Instancia: {self}")
    
    # Método de CLASE - recibe cls (la clase)
    @classmethod
    def metodo_clase(cls):
        print(f"Clase: {cls}")
        return cls()  # Puede crear instancias

# Uso:
obj = MiClase()
obj.metodo_normal()        # Necesita instancia
MiClase.metodo_clase()     # NO necesita instancia
```

**Diferencia clave:**

```
MÉTODO NORMAL:
    objeto = MiClase()
    objeto.hacer_algo()    ← Necesitas crear objeto primero

@CLASSMETHOD:
    objeto = MiClase.crear_algo()  ← Crea objeto desde la clase
```

---

## Ejemplo Básico: Sistema de Laptops

### Código Completo

```python
import argparse

class Laptop:
    def __init__(self, cpu, ram, disco, pantalla):
        self.cpu = cpu
        self.ram = ram
        self.disco = disco
        self.pantalla = pantalla
    
    @classmethod
    def para_gaming(cls):
        return cls(
            cpu="Intel i9",
            ram="32GB",
            disco="1TB SSD",
            pantalla="17 pulgadas 144Hz"
        )
    
    @classmethod
    def para_oficina(cls):
        return cls(
            cpu="Intel i5",
            ram="16GB",
            disco="512GB SSD",
            pantalla="15 pulgadas"
        )
    
    @classmethod
    def desde_argumentos(cls, args):
        return cls(
            cpu=args.cpu,
            ram=args.ram,
            disco=args.disco,
            pantalla=args.pantalla
        )
    
    def mostrar_specs(self):
        print(f"CPU:      {self.cpu}")
        print(f"RAM:      {self.ram}")
        print(f"Disco:    {self.disco}")
        print(f"Pantalla: {self.pantalla}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cpu', default='Intel i5')
    parser.add_argument('--ram', default='8GB')
    parser.add_argument('--disco', default='256GB SSD')
    parser.add_argument('--pantalla', default='14 pulgadas')
    parser.add_argument('--paquete', choices=['gaming', 'oficina'])
    
    args = parser.parse_args()
    
    if args.paquete == 'gaming':
        laptop = Laptop.para_gaming()
    elif args.paquete == 'oficina':
        laptop = Laptop.para_oficina()
    else:
        laptop = Laptop.desde_argumentos(args)
    
    laptop.mostrar_specs()

if __name__ == '__main__':
    main()
```

### Formas de Uso

```bash
# 1. Preset gaming
python laptops.py --paquete gaming

# 2. Preset oficina
python laptops.py --paquete oficina

# 3. Personalizada
python laptops.py --cpu "AMD Ryzen 9" --ram "64GB"

# 4. Desde Python
from laptops import Laptop
laptop = Laptop.para_gaming()
```

---

## Ejemplo Intermedio: Servidor Web

### Múltiples Fuentes de Configuración

```python
import argparse
import json
import os

class ServidorWeb:
    def __init__(self, host='localhost', puerto=8080, ssl=False):
        self.host = host
        self.puerto = puerto
        self.ssl = ssl
    
    # PRESET 1: Desarrollo
    @classmethod
    def desarrollo(cls):
        return cls(host='localhost', puerto=8080, ssl=False)
    
    # PRESET 2: Producción
    @classmethod
    def produccion(cls):
        return cls(host='0.0.0.0', puerto=443, ssl=True)
    
    # DESDE JSON
    @classmethod
    def desde_json(cls, archivo):
        with open(archivo) as f:
            config = json.load(f)
        return cls(**config)
    
    # DESDE VARIABLES DE ENTORNO
    @classmethod
    def desde_ambiente(cls):
        return cls(
            host=os.getenv('WEB_HOST', 'localhost'),
            puerto=int(os.getenv('WEB_PORT', '8080')),
            ssl=os.getenv('WEB_SSL', 'false') == 'true'
        )
    
    # DESDE ARGPARSE
    @classmethod
    def desde_argumentos(cls, args):
        return cls(
            host=args.host,
            puerto=args.puerto,
            ssl=args.ssl
        )
```

### Casos de Uso

```bash
# Desarrollo rápido
python servidor.py --preset desarrollo

# Producción
python servidor.py --preset produccion

# Desde JSON
python servidor.py --config config.json

# Desde variables de entorno
export WEB_HOST=0.0.0.0
export WEB_PORT=8080
python servidor.py --preset ambiente

# Personalizado
python servidor.py --host 192.168.1.100 --puerto 9000 --ssl
```

---

## Ejemplo Avanzado: Orquestador

### Arquitectura Lempyrλ - 16 Servidores Oracle

```python
from dataclasses import dataclass
import threading

@dataclass
class ConfiguracionServidor:
    nombre: str
    puerto: int
    host: str = '0.0.0.0'
    workers: int = 4

class OrquestadorInfraestructura:
    def __init__(self):
        self.servidores = []
    
    @classmethod
    def oracle_cloud_fleet(cls):
        """16 servidores Oracle con RTX 3080"""
        orquestador = cls()
        
        for i in range(1, 17):
            config = ConfiguracionServidor(
                nombre=f"oracle-gpu-{i}",
                puerto=8000 + i,
                workers=8  # RTX 3080 puede más
            )
            orquestador.agregar_servidor(config)
        
        return orquestador
    
    @classmethod
    def desde_directorio(cls, directorio):
        """Auto-descubre configs en directorio"""
        orquestador = cls()
        
        for archivo in Path(directorio).glob('server_*.json'):
            config = ConfiguracionServidor.from_json(archivo)
            orquestador.agregar_servidor(config)
        
        return orquestador

# USO
fleet = OrquestadorInfraestructura.oracle_cloud_fleet()
fleet.iniciar_todos()  # Levanta 16 servidores en paralelo
```

---

## Patrones de Diseño Aplicados

### 1. Factory Pattern (@classmethod)

```python
# En lugar de:
servidor = Servidor(host, puerto, ssl, workers, ...)

# Usas:
servidor = Servidor.desarrollo()
servidor = Servidor.produccion()
servidor = Servidor.desde_json('config.json')
```

**Ventaja:** La clase actúa como su propia fábrica.

---

### 2. Builder Pattern (argparse)

```python
parser = argparse.ArgumentParser()
parser.add_argument('--host', default='localhost')
parser.add_argument('--puerto', type=int, default=8080)
parser.add_argument('--ssl', action='store_true')
args = parser.parse_args()
```

**Ventaja:** Construyes configuración paso a paso.

---

### 3. Strategy Pattern (múltiples classmethods)

```python
# Diferentes estrategias de creación:
class Servidor:
    @classmethod
    def desarrollo(cls): ...    # Estrategia 1
    
    @classmethod
    def produccion(cls): ...    # Estrategia 2
    
    @classmethod
    def desde_json(cls): ...    # Estrategia 3
```

---

## Conceptos Python Aprendidos

### 1. Decoradores

```python
@classmethod
def mi_metodo(cls):
    pass

# Equivalente a:
def mi_metodo(cls):
    pass
mi_metodo = classmethod(mi_metodo)
```

---

### 2. Type Hints

```python
def calcular(x: int, y: int) -> int:
    return x + y

from typing import List, Optional

def procesar(items: List[str]) -> Optional[str]:
    return items[0] if items else None
```

---

### 3. Dataclasses

```python
from dataclasses import dataclass

@dataclass
class Servidor:
    nombre: str
    puerto: int
    ssl: bool = False
    
    # Automáticamente genera:
    # - __init__
    # - __repr__
    # - __eq__
```

---

### 4. Context Managers

```python
with open('archivo.txt') as f:
    data = f.read()
# Automáticamente cierra el archivo
```

---

### 5. f-strings

```python
nombre = "Lempyra"
edad = 37

# Viejo
print("Nombre: " + nombre + ", Edad: " + str(edad))

# Nuevo
print(f"Nombre: {nombre}, Edad: {edad}")

# Con expresiones
print(f"En 5 años: {edad + 5}")
```

---

## Ejercicios Propuestos

### Ejercicio 1: Agregar Nuevo Preset

Agrega `@classmethod` llamado `testing()` al servidor web:
- puerto: 9999
- verbose: True
- max_conexiones: 1

---

### Ejercicio 2: Validación con argparse

Valida que el puerto esté entre 1024-65535:

```python
parser.add_argument(
    '--puerto',
    type=int,
    choices=range(1024, 65536),  # ← Tu código aquí
    help='Puerto TCP (1024-65535)'
)
```

---

### Ejercicio 3: Cargar desde YAML

Crea `@classmethod` llamado `desde_yaml()`:

```python
import yaml

@classmethod
def desde_yaml(cls, archivo):
    # Tu código aquí
    pass
```

---

### Ejercicio 4: Orquestador con Health Checks

Agrega verificación de salud a cada servidor:

```python
class Servidor:
    def verificar_salud(self) -> bool:
        # Tu código aquí
        pass
```

---

## Comparación: Antes vs Después

### Antes (Script Básico)

```python
# config.py
PUERTO = 8080
HOST = 'localhost'
SSL = False

# Para cambiar: editar archivo
```

**Problemas:**
- 🚫 Hay que editar código
- 🚫 Sin validación
- 🚫 Sin ayuda
- 🚫 Una sola configuración

---

### Después (Tool Profesional)

```python
# Múltiples formas de usar:
python servidor.py --preset desarrollo
python servidor.py --config config.json
export WEB_PORT=9000 && python servidor.py --preset ambiente

# O desde Python:
servidor = Servidor.desarrollo()
servidor = Servidor.desde_json('config.json')
```

**Ventajas:**
- ✅ No se edita código
- ✅ Validación automática
- ✅ Ayuda con --help
- ✅ Múltiples configuraciones

---

## Arquitectura para Producción

### Configuración en Capas (12-Factor App)

```
Prioridad (de menor a mayor):

1. Defaults en código
   └── def __init__(self, puerto=8080)

2. Archivo de configuración
   └── config.json

3. Variables de entorno
   └── export WEB_PORT=9000

4. Argumentos CLI
   └── --puerto 8080
```

**Implementación:**

```python
def obtener_puerto():
    # 1. Default
    puerto = 8080
    
    # 2. Archivo
    if os.path.exists('config.json'):
        with open('config.json') as f:
            puerto = json.load(f).get('puerto', puerto)
    
    # 3. Ambiente
    puerto = int(os.getenv('WEB_PORT', puerto))
    
    # 4. CLI (ya parseado en args)
    if args.puerto:
        puerto = args.puerto
    
    return puerto
```

---

## Aplicación Real: Infraestructura Lempyrλ

### Caso de Uso: 16 Servidores Oracle Cloud

```python
# orquestador_lempyra.py

class OrquestadorLempyra(OrquestadorInfraestructura):
    
    @classmethod
    def oracle_cloud_fleet(cls):
        orquestador = cls()
        
        # 16 servidores con GPUs RTX 3080
        for i in range(1, 17):
            config = ConfiguracionServidor(
                nombre=f"oracle-gpu-{i}",
                puerto=8000 + i,
                workers=8,
                gpu="RTX 3080"
            )
            orquestador.agregar_servidor(config)
        
        return orquestador
    
    @classmethod
    def telegram_bots_pool(cls):
        """Pool de servidores para bots de Telegram"""
        orquestador = cls()
        
        bots = ['blendstory', 'jezabel', 'storiesbyjez']
        
        for bot in bots:
            config = ConfiguracionServidor(
                nombre=f"bot-{bot}",
                puerto=8000 + len(orquestador.servidores),
                workers=4
            )
            orquestador.agregar_servidor(config)
        
        return orquestador

# Uso en producción
fleet = OrquestadorLempyra.oracle_cloud_fleet()
fleet.iniciar_todos()

# Levanta 16 servidores en ~2 segundos
# Distribuye carga entre GPUs
# Health checks automáticos
```

---

## Conclusión

### Lo que Aprendiste

✅ **argparse** - Scripts → CLI tools profesionales  
✅ **@classmethod** - Un __init__ → múltiples constructores  
✅ **Patrones** - Factory, Builder, Strategy  
✅ **Configuración** - JSON, ENV, presets, CLI  
✅ **Arquitectura** - Código modular y reutilizable  

### Archivos Creados

1. `01_basico_laptops.md` - Sistema de configuración  
2. `02_intermedio_webserver.md` - Servidor multi-config  
3. `03_avanzado_orquestador.md` - Infraestructura completa  
4. `python_interactive_learning.html` - Demo visual  

### Próximos Pasos

1. Implementa orquestador real con threading
2. Agrega persistencia con SQLite
3. Crea API REST con FastAPI
4. Integra con Docker/Kubernetes
5. Agrega métricas con Prometheus

---

### Recursos

- **Python Docs:** https://docs.python.org/3/
- **argparse Tutorial:** https://docs.python.org/3/howto/argparse.html
- **Real Python:** https://realpython.com/
- **Type Hints:** https://docs.python.org/3/library/typing.html

---

### Filosofía Final

> "El código no se escribe para las computadoras.  
> Se escribe para los humanos que lo leerán después.  
> Las computadoras solo ejecutan el bytecode."

**Lempyrλ - De Java (2006) a Python (2024)**

---

*"Information should be free. Code should be beautiful."*

🐍 **Happy Pythoning!** 🚀
