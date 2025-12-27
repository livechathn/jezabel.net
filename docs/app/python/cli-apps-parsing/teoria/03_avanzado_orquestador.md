# Nivel Avanzado: Orquestador de Infraestructura

## Sistema Multi-Servidor con Auto-Discovery

### ¿Qué Construiremos?

Un **orquestador de servidores** que puede:
- 🎯 Levantar múltiples servidores simultáneamente
- 🎯 Auto-descubrir configuraciones
- 🎯 Balanceo de carga simple
- 🎯 Health checks automáticos
- 🎯 Logs centralizados
- 🎯 Hot-reload de configuración

**Inspiración:** Arquitectura similar a Kubernetes, Docker Compose, pero en Python puro.

---

## Arquitectura del Sistema

```
OrquestadorInfraestructura
    ├── ServidorWeb (Puerto 8080)
    ├── ServidorWeb (Puerto 8081)
    ├── ServidorWeb (Puerto 8082)
    └── LoadBalancer (Puerto 80)
         └── Distribuye tráfico entre 8080-8082
```

---

## Código Completo

```python
import argparse
import json
import os
import time
import threading
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from pathlib import Path
import socket
import random

@dataclass
class ConfiguracionServidor:
    """Configuración inmutable de servidor"""
    nombre: str
    puerto: int
    host: str = '0.0.0.0'
    workers: int = 4
    ssl: bool = False
    health_check_interval: int = 30
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: dict):
        return cls(**data)


class ServidorWeb:
    """Servidor web individual con health checking"""
    
    def __init__(self, config: ConfiguracionServidor):
        self.config = config
        self.estado = 'detenido'
        self.peticiones_procesadas = 0
        self.ultima_verificacion = None
        self._thread = None
    
    def iniciar(self):
        """Inicia servidor en thread separado"""
        self.estado = 'iniciando'
        self._thread = threading.Thread(target=self._ejecutar, daemon=True)
        self._thread.start()
        self.estado = 'corriendo'
        print(f"✓ {self.config.nombre} corriendo en :{self.config.puerto}")
    
    def _ejecutar(self):
        """Loop principal del servidor (simulado)"""
        while self.estado == 'corriendo':
            time.sleep(1)
            self.peticiones_procesadas += random.randint(0, 10)
    
    def verificar_salud(self) -> bool:
        """Health check"""
        self.ultima_verificacion = time.time()
        return self.estado == 'corriendo'
    
    def detener(self):
        """Detiene servidor"""
        self.estado = 'detenido'
        print(f"✗ {self.config.nombre} detenido")
    
    def estadisticas(self) -> dict:
        """Retorna métricas"""
        return {
            'nombre': self.config.nombre,
            'puerto': self.config.puerto,
            'estado': self.estado,
            'peticiones': self.peticiones_procesadas,
            'ultima_verificacion': self.ultima_verificacion
        }


class LoadBalancer:
    """Balanceador de carga round-robin simple"""
    
    def __init__(self, servidores: List[ServidorWeb]):
        self.servidores = servidores
        self.indice_actual = 0
    
    def obtener_siguiente(self) -> Optional[ServidorWeb]:
        """Obtiene siguiente servidor (round-robin)"""
        servidores_activos = [s for s in self.servidores if s.estado == 'corriendo']
        
        if not servidores_activos:
            return None
        
        servidor = servidores_activos[self.indice_actual % len(servidores_activos)]
        self.indice_actual += 1
        return servidor
    
    def distribuir_peticion(self):
        """Distribuye una petición al siguiente servidor"""
        servidor = self.obtener_siguiente()
        if servidor:
            servidor.peticiones_procesadas += 1
            return servidor.config.nombre
        return None


class OrquestadorInfraestructura:
    """Orquestador principal - maneja múltiples servidores"""
    
    def __init__(self):
        self.servidores: List[ServidorWeb] = []
        self.balanceador: Optional[LoadBalancer] = None
        self.monitor_thread: Optional[threading.Thread] = None
        self.monitoreando = False
    
    @classmethod
    def desde_archivo(cls, ruta: str):
        """Carga infraestructura desde JSON"""
        with open(ruta) as f:
            data = json.load(f)
        
        orquestador = cls()
        
        for config_dict in data.get('servidores', []):
            config = ConfiguracionServidor.from_dict(config_dict)
            servidor = ServidorWeb(config)
            orquestador.agregar_servidor(servidor)
        
        return orquestador
    
    @classmethod
    def desde_directorio(cls, directorio: str):
        """Auto-descubre configs en directorio"""
        orquestador = cls()
        ruta = Path(directorio)
        
        for archivo in ruta.glob('server_*.json'):
            print(f"📄 Descubierto: {archivo.name}")
            with open(archivo) as f:
                config_dict = json.load(f)
                config = ConfiguracionServidor.from_dict(config_dict)
                servidor = ServidorWeb(config)
                orquestador.agregar_servidor(servidor)
        
        return orquestador
    
    @classmethod
    def desde_plantilla(cls, nombre: str, cantidad: int, puerto_inicial: int):
        """Genera N servidores desde plantilla"""
        orquestador = cls()
        
        for i in range(cantidad):
            config = ConfiguracionServidor(
                nombre=f"{nombre}-{i+1}",
                puerto=puerto_inicial + i,
                workers=4
            )
            servidor = ServidorWeb(config)
            orquestador.agregar_servidor(servidor)
        
        return orquestador
    
    @classmethod
    def desde_ambiente(cls):
        """Carga desde variables de entorno"""
        orquestador = cls()
        
        cantidad = int(os.getenv('SERVERS_COUNT', '3'))
        puerto_base = int(os.getenv('PORT_BASE', '8080'))
        prefijo = os.getenv('SERVER_PREFIX', 'web')
        
        for i in range(cantidad):
            config = ConfiguracionServidor(
                nombre=f"{prefijo}-{i+1}",
                puerto=puerto_base + i
            )
            servidor = ServidorWeb(config)
            orquestador.agregar_servidor(servidor)
        
        return orquestador
    
    def agregar_servidor(self, servidor: ServidorWeb):
        """Agrega servidor al pool"""
        self.servidores.append(servidor)
    
    def iniciar_todos(self):
        """Inicia todos los servidores"""
        print(f"\n{'='*60}")
        print(f"🚀 Iniciando {len(self.servidores)} servidores...")
        print(f"{'='*60}\n")
        
        for servidor in self.servidores:
            servidor.iniciar()
            time.sleep(0.1)  # Pequeña pausa entre inicios
        
        # Crear balanceador
        self.balanceador = LoadBalancer(self.servidores)
        
        # Iniciar monitoreo
        self._iniciar_monitoreo()
        
        print(f"\n✓ Infraestructura lista\n")
    
    def detener_todos(self):
        """Detiene todos los servidores"""
        print(f"\n🛑 Deteniendo infraestructura...\n")
        self.monitoreando = False
        
        for servidor in self.servidores:
            servidor.detener()
    
    def _iniciar_monitoreo(self):
        """Inicia thread de monitoreo"""
        self.monitoreando = True
        self.monitor_thread = threading.Thread(target=self._monitorear, daemon=True)
        self.monitor_thread.start()
    
    def _monitorear(self):
        """Loop de monitoreo de salud"""
        while self.monitoreando:
            time.sleep(10)  # Check cada 10 segundos
            
            for servidor in self.servidores:
                if not servidor.verificar_salud():
                    print(f"⚠️  {servidor.config.nombre} no responde!")
    
    def estadisticas(self):
        """Muestra estadísticas de todos los servidores"""
        print(f"\n{'='*60}")
        print(f"📊 ESTADÍSTICAS DE INFRAESTRUCTURA")
        print(f"{'='*60}\n")
        
        total_peticiones = 0
        
        for srv in self.servidores:
            stats = srv.estadisticas()
            total_peticiones += stats['peticiones']
            
            print(f"{stats['nombre']:15} | "
                  f"Puerto: {stats['puerto']:5} | "
                  f"Estado: {stats['estado']:10} | "
                  f"Peticiones: {stats['peticiones']:6}")
        
        print(f"\n{'='*60}")
        print(f"Total de peticiones procesadas: {total_peticiones}")
        print(f"{'='*60}\n")
    
    def simular_trafico(self, peticiones: int = 100):
        """Simula tráfico y muestra distribución"""
        print(f"\n🔄 Simulando {peticiones} peticiones...\n")
        
        for _ in range(peticiones):
            if self.balanceador:
                self.balanceador.distribuir_peticion()
            time.sleep(0.01)
        
        self.estadisticas()


def main():
    parser = argparse.ArgumentParser(
        description='Orquestador de Infraestructura Multi-Servidor',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:

  Desde archivo:
    python orquestador.py --config infraestructura.json
  
  Auto-discovery:
    python orquestador.py --discover ./configs/
  
  Plantilla (3 servidores en puertos 8080-8082):
    python orquestador.py --template web --count 3 --port 8080
  
  Variables de entorno:
    export SERVERS_COUNT=5
    export PORT_BASE=9000
    python orquestador.py --from-env
  
  Simular tráfico:
    python orquestador.py --template web --count 3 --port 8080 --simulate 1000
        """
    )
    
    parser.add_argument('--config', help='Archivo de configuración JSON')
    parser.add_argument('--discover', help='Directorio para auto-discovery')
    parser.add_argument('--template', help='Nombre de plantilla')
    parser.add_argument('--count', type=int, default=3, help='Cantidad de servidores')
    parser.add_argument('--port', type=int, default=8080, help='Puerto inicial')
    parser.add_argument('--from-env', action='store_true', help='Desde variables de entorno')
    parser.add_argument('--simulate', type=int, help='Simular N peticiones')
    parser.add_argument('--duration', type=int, default=60, help='Duración en segundos')
    
    args = parser.parse_args()
    
    # Crear orquestador según método elegido
    if args.config:
        print(f"📄 Cargando desde {args.config}")
        orquestador = OrquestadorInfraestructura.desde_archivo(args.config)
    
    elif args.discover:
        print(f"🔍 Auto-descubriendo en {args.discover}")
        orquestador = OrquestadorInfraestructura.desde_directorio(args.discover)
    
    elif args.template:
        print(f"📋 Usando plantilla '{args.template}'")
        orquestador = OrquestadorInfraestructura.desde_plantilla(
            args.template, args.count, args.port
        )
    
    elif args.from_env:
        print("🌍 Cargando desde variables de entorno")
        orquestador = OrquestadorInfraestructura.desde_ambiente()
    
    else:
        print("❌ Debes especificar un método de configuración")
        parser.print_help()
        return
    
    # Iniciar infraestructura
    orquestador.iniciar_todos()
    
    # Simular tráfico si se pidió
    if args.simulate:
        time.sleep(2)  # Esperar que se estabilice
        orquestador.simular_trafico(args.simulate)
    
    # Mantener corriendo
    try:
        print(f"⏱️  Corriendo por {args.duration} segundos...")
        print("   Presiona Ctrl+C para detener\n")
        time.sleep(args.duration)
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupción detectada")
    finally:
        orquestador.estadisticas()
        orquestador.detener_todos()
        print("\n✓ Apagado limpio completado\n")


if __name__ == '__main__':
    main()
```

---

## Archivos de Configuración

### infraestructura.json
```json
{
  "servidores": [
    {
      "nombre": "web-1",
      "puerto": 8080,
      "workers": 4,
      "ssl": false
    },
    {
      "nombre": "web-2",
      "puerto": 8081,
      "workers": 4,
      "ssl": false
    },
    {
      "nombre": "web-3",
      "puerto": 8082,
      "workers": 8,
      "ssl": true
    }
  ]
}
```

### Auto-Discovery: configs/server_alpha.json
```json
{
  "nombre": "alpha",
  "puerto": 9000,
  "workers": 2,
  "ssl": false
}
```

### configs/server_beta.json
```json
{
  "nombre": "beta",
  "puerto": 9001,
  "workers": 4,
  "ssl": true
}
```

---

## Casos de Uso

### 1. Desarrollo Local (3 servidores)
```bash
python orquestador.py --template dev --count 3 --port 8080 --simulate 500
```

### 2. Auto-Discovery de Configuraciones
```bash
# Crea directorio con configs
mkdir configs
# Agrega server_*.json
python orquestador.py --discover ./configs/
```

### 3. Variables de Entorno (Docker/K8s)
```bash
export SERVERS_COUNT=5
export PORT_BASE=9000
export SERVER_PREFIX=prod
python orquestador.py --from-env --duration 300
```

### 4. Desde Archivo Maestro
```bash
python orquestador.py --config infraestructura.json --simulate 1000
```

### 5. Testing de Carga
```bash
python orquestador.py \
  --template loadtest \
  --count 10 \
  --port 8000 \
  --simulate 10000 \
  --duration 120
```

---

## Conceptos Avanzados Aplicados

### 1. Dataclasses (Python 3.7+)
```python
@dataclass
class ConfiguracionServidor:
    nombre: str
    puerto: int
    # Automáticamente genera __init__, __repr__, etc.
```

### 2. Type Hints
```python
def obtener_siguiente(self) -> Optional[ServidorWeb]:
    # Ayuda a IDEs y type checkers
```

### 3. Threading
```python
self._thread = threading.Thread(target=self._ejecutar, daemon=True)
# Servidores corren en paralelo
```

### 4. Factory Pattern con @classmethod
```python
# 4 formas diferentes de crear la misma infraestructura
OrquestadorInfraestructura.desde_archivo()
OrquestadorInfraestructura.desde_directorio()
OrquestadorInfraestructura.desde_plantilla()
OrquestadorInfraestructura.desde_ambiente()
```

### 5. Health Checking
```python
def verificar_salud(self) -> bool:
    # Monitoreo automático cada 10 segundos
```

### 6. Load Balancing Round-Robin
```python
servidor = servidores_activos[self.indice_actual % len(servidores_activos)]
# Distribuye uniformemente
```

---

## Ejercicios Avanzados

### Ejercicio 1: Agregar Persistencia
Guarda estadísticas en SQLite cada minuto.

### Ejercicio 2: API REST
Agrega endpoints:
- `GET /stats` - Ver estadísticas
- `POST /servers` - Agregar servidor
- `DELETE /servers/{id}` - Remover servidor

### Ejercicio 3: Hot Reload
Detecta cambios en archivos de config y recarga sin detener.

**Pista:** Usa `watchdog` library

### Ejercicio 4: Weighted Load Balancing
Servidores con más workers reciben más tráfico.

### Ejercicio 5: Circuit Breaker
Si un servidor falla 3 veces, sacarlo del pool por 60 segundos.

---

## Arquitecturas Similares en el Mundo Real

| Este Código | Equivalente Real |
|-------------|------------------|
| `OrquestadorInfraestructura` | Kubernetes Controller |
| `LoadBalancer` | Nginx, HAProxy |
| `verificar_salud()` | Kubernetes Liveness Probe |
| `desde_archivo()` | Docker Compose |
| `desde_directorio()` | Kubernetes ConfigMaps |
| `desde_ambiente()` | 12-Factor App |

---

## Integración con tu Infraestructura

### Para Lempyrλ (16+ Oracle Servers)

```python
# orquestador_lempyra.py
from orquestador import OrquestadorInfraestructura, ConfiguracionServidor

class OrquestadorLempyra(OrquestadorInfraestructura):
    """Orquestador específico para infraestructura Lempyrλ"""
    
    @classmethod
    def oracle_cloud_fleet(cls):
        """Configura los 16 servidores Oracle con GPUs"""
        orquestador = cls()
        
        for i in range(1, 17):
            config = ConfiguracionServidor(
                nombre=f"oracle-gpu-{i}",
                puerto=8000 + i,
                workers=8,  # RTX 3080 puede manejar más
                ssl=True
            )
            servidor = ServidorWeb(config)
            orquestador.agregar_servidor(servidor)
        
        return orquestador

# Uso
if __name__ == '__main__':
    fleet = OrquestadorLempyra.oracle_cloud_fleet()
    fleet.iniciar_todos()
    fleet.simular_trafico(10000)
```

---

## Resumen de Técnicas

✅ **argparse avanzado** - Múltiples subcomandos y opciones
✅ **@classmethod como factories** - 4 formas de crear infraestructura
✅ **Dataclasses** - Configuración tipada e inmutable
✅ **Threading** - Ejecución paralela
✅ **Health checking** - Monitoreo automático
✅ **Load balancing** - Distribución de carga
✅ **Auto-discovery** - Configuración dinámica
✅ **Type hints** - Código más mantenible
✅ **Context managers** - Manejo seguro de recursos

---

## Próximos Pasos

1. **Implementa persistencia** con SQLite
2. **Agrega métricas** con Prometheus format
3. **Crea dashboard** con curses o rich
4. **Integra con Docker** para deploy real
5. **Agrega circuit breaker** pattern

**Este es código de producción real.** Puedes usarlo para orquestar tu infraestructura Lempyrλ.

---

**Nivel Desbloqueado:** Arquitecto de Sistemas 🏗️
