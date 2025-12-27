# Conceptos Python Básicos: argparse y @classmethod

## Sistema de Configuración de Laptops

### ¿Qué aprenderás?

- ✅ Cómo usar `argparse` para crear programas de línea de comandos
- ✅ Qué es `@classmethod` y por qué es útil
- ✅ Múltiples formas de crear objetos

---

## 1. ¿Qué es argparse?

**argparse** convierte tu script Python en una herramienta profesional de línea de comandos.

### Sin argparse
```python
# Tienes que editar el código cada vez
cpu = "Intel i5"  # ¿Quieres cambiar? Edita aquí
ram = "8GB"       # ¿Quieres cambiar? Edita aquí
```

### Con argparse
```bash
# Cambias parámetros sin tocar el código
python programa.py --cpu "Intel i7" --ram "16GB"
```

**Beneficios:**
- 🎯 Ayuda automática con `--help`
- 🎯 Validación de tipos
- 🎯 Valores por defecto
- 🎯 Aspecto profesional

---

## 2. ¿Qué es @classmethod?

Es como tener **múltiples recetas** para crear el mismo tipo de objeto.

### Analogía: Restaurante de Hamburguesas

**Forma 1 (Constructor normal):** Pedir ingrediente por ingrediente
- "Dame pan, carne, lechuga, tomate, queso..."

**Forma 2 (@classmethod):** Pedir un combo predefinido
- "Dame la Clásica" → Ya sabe qué lleva
- "Dame la Vegetariana" → Ya sabe qué lleva

Todas son hamburguesas, pero tienes diferentes formas de pedirlas.

---

## 3. Código Completo: Sistema de Laptops

```python
import argparse

class Laptop:
    """Representa una laptop con sus componentes"""
    
    def __init__(self, cpu, ram, disco, pantalla):
        """Constructor normal - configuras todo manualmente"""
        self.cpu = cpu
        self.ram = ram
        self.disco = disco
        self.pantalla = pantalla
    
    @classmethod
    def para_gaming(cls):
        """Paquete Gaming preconfigurado"""
        return cls(
            cpu="Intel i9",
            ram="32GB",
            disco="1TB SSD",
            pantalla="17 pulgadas 144Hz"
        )
    
    @classmethod
    def para_oficina(cls):
        """Paquete Oficina preconfigurado"""
        return cls(
            cpu="Intel i5",
            ram="16GB",
            disco="512GB SSD",
            pantalla="15 pulgadas"
        )
    
    @classmethod
    def desde_argumentos(cls, args):
        """Desde línea de comandos"""
        return cls(
            cpu=args.cpu,
            ram=args.ram,
            disco=args.disco,
            pantalla=args.pantalla
        )
    
    def mostrar_specs(self):
        """Muestra las especificaciones"""
        print(f"\n{'='*40}")
        print(f"CPU:      {self.cpu}")
        print(f"RAM:      {self.ram}")
        print(f"Disco:    {self.disco}")
        print(f"Pantalla: {self.pantalla}")
        print(f"{'='*40}\n")


def main():
    """Programa principal con argparse"""
    
    parser = argparse.ArgumentParser(
        description='Sistema de Configuración de Laptops'
    )
    
    # Definir argumentos
    parser.add_argument('--cpu', default='Intel i5')
    parser.add_argument('--ram', default='8GB')
    parser.add_argument('--disco', default='256GB SSD')
    parser.add_argument('--pantalla', default='14 pulgadas')
    parser.add_argument('--paquete', choices=['gaming', 'oficina'])
    
    args = parser.parse_args()
    
    # Crear laptop según lo solicitado
    if args.paquete == 'gaming':
        laptop = Laptop.para_gaming()
        print("📦 Paquete Gaming")
    elif args.paquete == 'oficina':
        laptop = Laptop.para_oficina()
        print("📦 Paquete Oficina")
    else:
        laptop = Laptop.desde_argumentos(args)
        print("🔧 Personalizada")
    
    laptop.mostrar_specs()


if __name__ == '__main__':
    main()
```

---

## 4. Cómo Usar

### Opción 1: Línea de Comandos
```bash
# Personalizada
python laptops.py --cpu "Intel i7" --ram "32GB"

# Paquete Gaming
python laptops.py --paquete gaming

# Paquete Oficina
python laptops.py --paquete oficina

# Ver ayuda
python laptops.py --help
```

### Opción 2: Desde Python
```python
from laptops import Laptop

# Constructor directo
mi_laptop = Laptop("AMD Ryzen 9", "64GB", "2TB SSD", "16 pulgadas")

# Paquete gaming
laptop_gaming = Laptop.para_gaming()

# Paquete oficina
laptop_trabajo = Laptop.para_oficina()
```

---

## 5. Ejercicios

### Ejercicio 1: Agrega un nuevo paquete
Crea un `@classmethod` llamado `para_estudiante()` con specs económicas.

### Ejercicio 2: Agrega más argumentos
Agrega `--marca` y `--color` al argparse.

### Ejercicio 3: Validación
Haz que el argumento `--ram` solo acepte: 8GB, 16GB, 32GB, 64GB.

**Pista:** Usa `choices=['8GB', '16GB', '32GB', '64GB']`

---

## Resumen

| Método | Cuándo Usar | Ejemplo |
|--------|-------------|---------|
| `__init__` | Máxima flexibilidad | `Laptop("i7", "16GB", ...)` |
| `@classmethod` | Configuraciones comunes | `Laptop.para_gaming()` |
| `argparse` | Herramienta CLI | `python laptops.py --paquete gaming` |

**Próximo nivel:** Ver `02_intermedio_webserver.md`
