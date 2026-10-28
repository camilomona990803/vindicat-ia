# Vindicat — Inteligencia Jurídica Vial

Aplicación web moderna desarrollada en **React (Vite + TypeScript + Tailwind CSS)** con backend integrado en **Express** para la orientación jurídica vial y gestión de trámites administrativos en Colombia (comparendos, fotodetecciones, prescripciones, caducidad y derechos de petición).

## Características principales

- **Orientación Jurídica Especializada:** Asesoría fundamentada en la normativa colombiana de tránsito (Ley 769 de 2002, Ley 1843 de 2017, Sentencias C-038 de 2020 y C-321 de 2022 de la Corte Constitucional).
- **Generación de Derecho de Petición:** Redacción automática de borradores formales (Art. 23 C.P. y Ley 1755 de 2015) listos para revisión y radicación.
- **Exportación a Word (.doc):** Descarga inmediata de borradores y orientaciones en formato compatible con procesadores de texto.
- **Inteligencia Artificial con Gemini:** Procesamiento en el servidor (`server.ts`) mediante el SDK `@google/genai` con modelo `gemini-3.8-flash` y motor de reglas jurídicas de contingencia.
- **Diseño Adaptativo Premium:** Interfaz responsive optimizada para escritorio y dispositivos móviles con tema oscuro refinado.

## Estructura del proyecto

```
├── src/
│   ├── App.tsx          # Componente principal con secciones y formularios
│   ├── main.tsx         # Punto de entrada de React 18
│   └── index.css        # Estilos globales y variables de diseño
├── server.ts            # Servidor Express con Vite middleware y endpoint /api/asesoria
├── index.html           # Plantilla HTML con metadatos y fuentes
├── package.json         # Dependencias y scripts
├── vite.config.ts       # Configuración de Vite con plugins de React y Tailwind
└── tsconfig.json        # Configuración de TypeScript
```

## Ejecución en desarrollo

```bash
npm run dev
```

El servidor iniciará en `http://0.0.0.0:3000`.

## Compilación y producción

```bash
npm run build
npm start
```
