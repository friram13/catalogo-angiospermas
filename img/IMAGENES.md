# Guía para agregar imágenes

Este documento explica cómo organizar y nombrar las imágenes del catálogo para que el sitio las muestre automáticamente.

## Estructura de carpetas

Todas las imágenes taxonómicas van dentro de `img/ordenes/`, una carpeta por **orden**:

```
img/
└── ordenes/
    └── Nymphaeales/
        ├── orden.jpg          ← imagen del orden (miniatura en el acordeón)
        ├── generos/
        │   ├── Brasenia.jpg
        │   └── Cabomba.jpg
        └── familias/
            └── Nymphaeaceae.jpg
```

Cada orden tiene dos subcarpetas:

| Subcarpeta  | Contenido                                      |
|-------------|------------------------------------------------|
| `generos/`  | Imágenes de géneros que tienen registro en el JSON |
| `familias/` | Imágenes de familias sin géneros registrados   |

> Ya existen **53 carpetas** de órdenes generadas desde `data/data-base1.json`. Solo debes colocar los archivos dentro de la carpeta correcta.

## Tipos de imagen

### 1. Imagen del orden

Se muestra como miniatura en el encabezado del acordeón del orden.

**Ruta:**

```
img/ordenes/{Orden}/orden.jpg
```

**Ejemplo:**

```
img/ordenes/Nymphaeales/orden.jpeg
```

### 2. Imagen de género

Se muestra en la tarjeta del género al desplegar un orden.

**Ruta:**

```
img/ordenes/{Orden}/generos/{Genero}.jpg
```

**Ejemplo:**

```
img/ordenes/Nymphaeales/generos/Brasenia.jpg
```

### 3. Imagen de familia

Se usa cuando la familia **no tiene géneros** en el JSON.

**Ruta:**

```
img/ordenes/{Orden}/familias/{Familia}.jpg
```

**Ejemplo:**

```
img/ordenes/Canellales/familias/Canellaceae.jpg
```

## Reglas de nombres de archivo

El sitio convierte los nombres del JSON a nombres de archivo así:

1. Se eliminan caracteres no válidos: `/ \ ? % * : | " < >`
2. Los paréntesis `(` `)` se reemplazan por `_`
3. Los espacios se reemplazan por `_`

| Nombre en el JSON                         | Nombre del archivo                    |
|-------------------------------------------|---------------------------------------|
| `Brasenia`                                | `Brasenia.jpg`                        |
| `Cornaceae (incluye Nyssaceae)`           | `Cornaceae_incluye_Nyssaceae.jpg`     |
| `Myrtaceae (incluye Heteropyxida ...)`    | `Myrtaceae_incluye_Heteropyxida_...jpg` |

## Formatos aceptados

El sitio prueba cargar la imagen en este orden:

1. `.jpg`
2. `.jpeg`
3. `.png`

Puedes usar cualquiera de esos formatos. Se recomienda **`.jpg`** o **`.jpeg`** para fotografías.

## Si la imagen no existe

- En las **tarjetas** de género/familia aparece el texto *Sin imagen*.
- En el **acordeón del orden**, la miniatura simplemente no se muestra.

No es necesario modificar el código al agregar nuevas imágenes: basta con guardar el archivo en la ruta correcta y recargar la página.

## Cómo encontrar la carpeta correcta

1. Abre el sitio en **Categorías**.
2. Despliega el clado y luego el orden que te interese.
3. El nombre del orden coincide con la carpeta en `img/ordenes/`.
4. El nombre de la tarjeta (género o familia) coincide con el nombre del archivo.

**Ejemplo:** para la tarjeta *Brasenia* dentro del orden **Nymphaeales**:

```
img/ordenes/Nymphaeales/generos/Brasenia.jpg
```

## Encabezado del sitio

La imagen de fondo del encabezado (banner verde) es independiente:

```
img/Encabezado angio.jpg
```

## Lista de órdenes con carpeta creada

Alismatales, Apiales, Aquifoliales, Arecales, Asparagales, Asterales, Austrobaileyales, Brassicales, Buxales, Canellales, Caryophyllales, Celastrales, Ceratophyllales, Chloranthales, Commelinales, Cornales, Crossosomatales, Cucurbitales, Dilleniales, Dioscoreales, Dipsacales, Ericales, Fabales, Fagales, Garryales, Gentianales, Geraniales, Gunnerales, Huerteales, Lamiales, Laurales, Liliales, Magnoliales, Malpighiales, Malvales, Myrtales, Nymphaeales, Oxalidales, Pandanales, Picramniales, Piperales, Poales, Proteales, Ranunculales, Rosales, Sapindales, Santalales, Saxifragales, Solanales, Vitales, Zingiberales, Zygophyllales.

## Consejos

- Usa nombres de archivo **exactamente** como indica la tabla de conversión.
- Mantén las imágenes cuadradas o apaisadas; se recortan con `object-fit: cover` en un recuadro de ~130 px de alto.
- Tamaño recomendado: **400 × 400 px** o similar, para buena calidad sin peso excesivo.
