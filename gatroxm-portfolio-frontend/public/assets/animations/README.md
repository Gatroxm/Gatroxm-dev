# Animaciones de la mascota Gx (Pencil2D)

Coloca aquí las exportaciones de animación de Gx generadas en Pencil2D. El frontend las cargará automáticamente según el nombre del estado de animación.

## Nombres esperados

Para cada animación, exporta los siguientes archivos con el mismo nombre base:

- `gx-hello.webm` / `gx-hello.mp4` (y opcionalmente un poster si se requiere en el futuro)
- `gx-idle.webm` / `gx-idle.mp4`
- `gx-coding.webm` / `gx-coding.mp4`
- `gx-presenting.webm` / `gx-presenting.mp4`
- `gx-celebrating.webm` / `gx-celebrating.mp4`

## Comportamiento en la app

- El componente `MascotAnimationComponent` intenta reproducir el vídeo (`.webm` y `.mp4`) solo cuando el elemento es visible (IntersectionObserver) y pausa fuera de pantalla.
- Si los vídeos no existen o fallan al cargar, se muestra automáticamente el fallback estático (PNG de la mascota).
- Si el usuario tiene activado `prefers-reduced-motion`, no se reproduce vídeo y se muestra siempre la imagen estática.

No incluyas vídeos falsos o de marcador de posición: deja solo los archivos finales exportados desde Pencil2D cuando estén listos.
