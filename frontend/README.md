# Frontend — Control de Pagos

## ▶️ Cómo correrlo

### Requisitos
- Node.js instalado (https://nodejs.org → versión LTS)

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Correr el frontend
```bash
npm run dev
```

### 3. Abrir en el navegador
```
http://localhost:5173
```

### 4. Abrir en tu celular
Asegúrate de que tu celular esté en la misma red WiFi que tu PC.
En la terminal verás algo como:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.XX:5173/
```
Abre esa dirección **Network** desde el navegador de tu celular.

---

## ⚠️ Importante
El backend debe estar corriendo en otra terminal:
```bash
cd backend
uvicorn main:app --reload
```

Ambos deben estar corriendo al mismo tiempo.
