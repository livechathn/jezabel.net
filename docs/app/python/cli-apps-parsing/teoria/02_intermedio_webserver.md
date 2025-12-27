# Nivel Intermedio: Servidor Web Profesional

## Múltiples Fuentes de Configuración

### Objetivo

Crear un servidor web que puede configurarse desde:
- ✅ Línea de comandos (argparse)
- ✅ Archivos JSON
- ✅ Variables de entorno
- ✅ Presets predefinidos

---

## Por Qué Es Importante

En producción, diferentes personas/sistemas configuran servidores de formas diferentes:

- **Desarrolladores:** Línea de comandos rápida
- **DevOps:** Archivos de configuración (JSON/YAML)
- **Docker/Kubernetes:** Variables de entorno
- **CI/CD:** Scripts automatizados

Tu código debe soportar **todas** estas formas.

---

## Código Completo

```python
import argparse
import json
import os

class ServidorWeb:
    """Servidor web configurable desde múltiples fuentes"""
    
    def __init__(self, host='localhost', puerto=8080, 
                 directorio='.', max_conexiones=5, 
                 ssl=False, verbose=False):
        """Constructor principal"""
        self.host = host
        self.puerto = puerto
        self.directorio = directorio
        self.max_conexiones = max_conexiones
        self.ssl = ssl
        self.verbose = verbose
    
    @classmethod
    def desarrollo(cls):
        """Preset para desarrollo local"""
        return cls(
            host='localhost',
            puerto=8080,
            directorio='./dev',
            max_conexiones=5,
            ssl=False,
            verbose=True
        )
    
    @classmethod
    def produccion(cls):
        """Preset para servidor de producción"""
        return cls(
            host='0.0.0.0',
            puerto=443,
            directorio='/var/www/html',
            max_conexiones=100,
            ssl=True,
            verbose=False
        )
    
    @classmethod
    def desde_json(cls, archivo):
        """Carga configuración desde archivo JSON"""
        with open(archivo, 'r') as f:
            config = json.load(f)
        
        return cls(
            host=config.get('host', 'localhost'),
            puerto=config.get('puerto', 8080),
            directorio=config.get('directorio', '.'),
            max_conexiones=config.get('max_conexiones', 5),
            ssl=config.get('ssl', False),
            verbose=config.get('verbose', False)
        )
    
    @classmethod
    def desde_ambiente(cls):
        """Carga desde variables de entorno"""
        return cls(
            host=os.getenv('WEB_HOST', 'localhost'),
            puerto=int(os.getenv('WEB_PORT', '8080')),
            directorio=os.getenv('WEB_DIR', '.'),
            max_conexiones=int(os.getenv('WEB_MAX_CONN', '5')),
            ssl=os.getenv('WEB_SSL', 'false').lower() == 'true',
            verbose=os.getenv('WEB_VERBOSE', 'false').lower() == 'true'
        )
    
    @classmethod
    def desde_argumentos(cls, args):
        """Crea desde argparse"""
        return cls(
            host=args.host,
            puerto=args.puerto,
            directorio=args.directorio,
            max_conexiones=args.max_conexiones,
            ssl=args.ssl,
            verbose=args.verbose
        )
    
    def iniciar(self):
        """Inicia el servidor"""
        protocolo = "HTTPS" if self.ssl else "HTTP"
        print(f"\n{'='*50}")
        print(f"🚀 Servidor {protocolo} Iniciado")
        print(f"{'='*50}")
        print(f"Host:            {self.host}")
        print(f"Puerto:          {self.puerto}")
        print(f"Directorio:      {self.directorio}")
        print(f"Max Conexiones:  {self.max_conexiones}")
        print(f"SSL:             {'✓' if self.ssl else '✗'}")
        print(f"Verbose:         {'✓' if self.verbose else '✗'}")
        print(f"{'='*50}")
        print(f"URL: {protocolo.lower()}://{self.host}:{self.puerto}")
        print(f"{'='*50}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Servidor Web Configurable',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python servidor.py --preset desarrollo
  python servidor.py --preset produccion
  python servidor.py --host 0.0.0.0 --puerto 9000 --ssl
  python servidor.py --config config.json
  python servidor.py --preset ambiente
        """
    )
    
    # Argumentos de red
    parser.add_argument('--host', default='localhost')
    parser.add_argument('-p', '--puerto', type=int, default=8080)
    parser.add_argument('-d', '--directorio', default='.')
    parser.add_argument('--max-conexiones', type=int, default=5)
    parser.add_argument('--ssl', action='store_true')
    parser.add_argument('-v', '--verbose', action='store_true')
    
    # Presets y archivos
    parser.add_argument('--preset', 
                       choices=['desarrollo', 'produccion', 'ambiente'])
    parser.add_argument('--config', help='Archivo JSON')
    
    args = parser.parse_args()
    
    # Decidir qué constructor usar
    if args.config:
        print(f"📄 Desde {args.config}")
        servidor = ServidorWeb.desde_json(args.config)
    elif args.preset == 'desarrollo':
        print("🔧 Preset DESARROLLO")
        servidor = ServidorWeb.desarrollo()
    elif args.preset == 'produccion':
        print("🏭 Preset PRODUCCIÓN")
        servidor = ServidorWeb.produccion()
    elif args.preset == 'ambiente':
        print("🌍 Variables de entorno")
        servidor = ServidorWeb.desde_ambiente()
    else:
        print("⚙️  Configuración personalizada")
        servidor = ServidorWeb.desde_argumentos(args)
    
    servidor.iniciar()


if __name__ == '__main__':
    main()
```

---

## Archivo de Configuración: config.json

```json
{
  "host": "192.168.1.100",
  "puerto": 9000,
  "directorio": "/var/www/produccion",
  "max_conexiones": 50,
  "ssl": true,
  "verbose": false
}
```

---

## Formas de Uso

### 1. Línea de Comandos (Desarrollo)
```bash
python servidor.py --preset desarrollo
```

### 2. Línea de Comandos (Producción)
```bash
python servidor.py --preset produccion
```

### 3. Configuración Personalizada
```bash
python servidor.py --host 0.0.0.0 --puerto 9000 --ssl -v
```

### 4. Desde Archivo JSON
```bash
python servidor.py --config config.json
```

### 5. Desde Variables de Entorno
```bash
export WEB_HOST=0.0.0.0
export WEB_PORT=8080
export WEB_SSL=true
python servidor.py --preset ambiente
```

### 6. Desde Python (Testing)
```python
from servidor import ServidorWeb

# Desarrollo rápido
srv = ServidorWeb.desarrollo()
srv.iniciar()

# Producción
srv = ServidorWeb.produccion()

# Desde JSON
srv = ServidorWeb.desde_json('config.json')

# Personalizado
srv = ServidorWeb(puerto=9999, ssl=True)
```

---

## Patrones Importantes

### 1. Patrón Factory con @classmethod

```python
# Cada @classmethod es una "fábrica" diferente
servidor = ServidorWeb.desarrollo()      # Fábrica 1
servidor = ServidorWeb.produccion()      # Fábrica 2
servidor = ServidorWeb.desde_json(...)   # Fábrica 3
servidor = ServidorWeb.desde_ambiente()  # Fábrica 4
```

### 2. Patrón de Valores por Defecto

```python
def __init__(self, host='localhost', puerto=8080, ...):
    # Si no pasas argumentos, usa defaults sensatos
```

### 3. Patrón de Configuración en Capas

```
1. Defaults en código
2. Archivo de configuración
3. Variables de entorno
4. Argumentos de línea de comandos (mayor prioridad)
```

---

## Ejercicios

### Ejercicio 1: Nuevo Preset
Crea `@classmethod` llamado `testing()` para pruebas:
- puerto: 9999
- verbose: True
- max_conexiones: 1

### Ejercicio 2: Validación
Valida que `puerto` esté entre 1024-65535.

### Ejercicio 3: Archivo YAML
Crea `desde_yaml()` que cargue desde YAML en lugar de JSON.

**Pista:** `pip install pyyaml`, luego `import yaml`

### Ejercicio 4: Docker
Crea un Dockerfile que use variables de entorno.

---

## Casos de Uso Reales

### Desarrollo Local
```bash
python servidor.py --preset desarrollo
# Rápido, verbose, localhost
```

### CI/CD Pipeline
```bash
export WEB_HOST=0.0.0.0
export WEB_PORT=8080
python servidor.py --preset ambiente
# Configurado por el runner
```

### Kubernetes Deployment
```yaml
env:
  - name: WEB_HOST
    value: "0.0.0.0"
  - name: WEB_PORT
    value: "8080"
  - name: WEB_SSL
    value: "true"
```

### Testing Automatizado
```python
def test_servidor():
    srv = ServidorWeb.desarrollo()
    assert srv.puerto == 8080
    assert srv.verbose == True
```

---

## Comparación de Métodos

| Método | Ventaja Principal | Caso de Uso |
|--------|-------------------|-------------|
| Constructor directo | Flexibilidad total | Scripts Python |
| `desarrollo()` | Configuración rápida | Dev local |
| `produccion()` | Seguro por defecto | Deploy |
| `desde_json()` | Versionable en Git | Equipos |
| `desde_ambiente()` | Cloud-native | Docker/K8s |
| `desde_argumentos()` | Interactivo | Usuarios finales |

---

## Resumen

Has aprendido:
- ✅ Múltiples constructores con `@classmethod`
- ✅ argparse para CLI profesional
- ✅ Cargar desde JSON y variables de entorno
- ✅ Presets para casos comunes
- ✅ Patrones de configuración en capas

**Próximo nivel:** Ver `03_avanzado_orquestador.md`
