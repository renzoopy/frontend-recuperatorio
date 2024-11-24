# Recuperatorio - Carrito de Compras WEB

## Descripción

Este proyecto es una aplicación frontend desarrollada con Angular para gestionar un carrito de compras. Permite la administración de categorías, productos, clientes y ventas. Incluye funcionalidades como búsqueda de productos, gestión del carrito de compras, creación de órdenes de venta y registro/verificación de clientes.

## Requisitos

- Node.js y npm instalados
- Angular CLI instalado `npm install -g @angular/cli`
- json-server npm `npm install -g json-server`

## Entorno de desarrollo

1. Crea un archivo db.json en la raíz del proyecto:

   ```bash
   {
   "categorias": [],
   "productos": [],
   "clientes": [],
   "ventas": []
   }
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Inicia el servidor json-server:

   ```bash
   json-server --watch db.json --port 3000
   ```

4. Inicia el servidor de desarrollo de Angular:

   ```bash
   ng serve
   ```

5. Abre la aplicación en tu navegador:

   ```bash
   http://localhost:4200
   ```
