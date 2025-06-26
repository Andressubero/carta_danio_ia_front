# Carta de Daño IA

Este repositorio contiene el código de frontend de la aplicación **Carta de Daño IA**. Utiliza las tecnologias **React.JS** con **Vite**.

## Cómo configurarlo correctamente

### 1. Asegurarse tener Node.js instalado en su ordenador

### 2. Clonar el repositorio, desde la interfaz de su IDE o desde la terminal con el siguiente comando:  
```
https://github.com/Andressubero/carta_danio_ia_front
cd carta_danio_ia_front
```

### 3. Instalar las dependencias, con el siguiente comando:
```
npm install
```

### 4. Configurar las variables de ambiente:
 - Crear un archivo .env
 - Guiarse con el archivo .env.example las variables necesarias

### 5. Correr el proyecto:
```
npm run dev
```


## Agregar un nuevo vehículo

1. Se debe añadir el croquis en la carpeta images con un nombre que haga referencia al nuevo tipo
de vehículo.
2. Se debe añadir en la carpeta data un archivo con un nombre que referencie al nuevo tipo de vehículo, debe contener las coordenadas en porcentaje en donde debe ubicarse el punto en el nuevo croquis.
3. Se importa el croquis y los puntos en el archivo VehicleStateForm/VehicleStateForm
y se añaden al array "croquis" y "puntos" respectivamente. Con eso ya se podrá acceder al 
nuevo croquis.