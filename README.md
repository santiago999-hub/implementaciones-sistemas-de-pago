# 💳 Sistema de Pagos Online

Sistema de Pagos Online es una aplicación web completa desarrollada con Node.js y Express que simula un sistema bancario de procesamiento de pagos en tiempo real. El sistema permite a los clientes realizar pagos a diferentes empresas utilizando tarjetas Visa o Mastercard, con validaciones avanzadas que incluyen el algoritmo de Luhn para verificar números de tarjeta reales.

## 🚀 Características

- **Procesamiento de Pagos en Tiempo Real**: Simula transacciones bancarias en tiempo real
- **Validación de Tarjetas con Algoritmo de Luhn**: Implementación completa del algoritmo de Luhn para validar números de tarjeta
- **Soporte para Visa y Mastercard**: Detecta automáticamente el tipo de tarjeta basándose en el número
- **Múltiples Empresas**: Permite realizar pagos a diferentes compañías (Netflix, Amazon, Spotify, etc.)
- **Interfaz de Usuario Intuitiva**: Interfaz web moderna y responsive
- **Historial de Transacciones**: Visualización de pagos recientes con estado (aprobado/rechazado)
- **Validaciones Completas**: Validación de CVV, fecha de expiración, monto, y más

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/santiago999-hub/implementaciones-sistemas-de-pago.git
cd implementaciones-sistemas-de-pago
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

4. Abrir el navegador y visitar:
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
implementaciones-sistemas-de-pago/
├── src/
│   ├── controllers/
│   │   └── paymentController.js    # Lógica de procesamiento de pagos
│   ├── models/
│   │   ├── Payment.js              # Modelo de pago
│   │   └── Company.js              # Modelo de empresa
│   ├── routes/
│   │   ├── paymentRoutes.js        # Rutas de pagos
│   │   └── companyRoutes.js        # Rutas de empresas
│   ├── utils/
│   │   └── luhnValidator.js        # Implementación del algoritmo de Luhn
│   └── server.js                   # Servidor principal de Express
├── views/
│   ├── index.ejs                   # Página de inicio
│   └── payments.ejs                # Página de procesamiento de pagos
├── public/
│   ├── css/
│   │   └── style.css              # Estilos CSS
│   └── js/
│       └── payment.js             # JavaScript del frontend
├── package.json
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - EJS (Motor de plantillas)
  - Body-Parser

- **Frontend**:
  - HTML5
  - CSS3 (con Grid y Flexbox)
  - JavaScript (ES6+)
  - Fetch API

## 💡 Algoritmo de Luhn

El sistema implementa el algoritmo de Luhn (también conocido como "módulo 10" o "mod 10") para validar números de tarjeta de crédito. Este algoritmo:

1. Procesa los dígitos de derecha a izquierda
2. Duplica cada segundo dígito
3. Si el resultado es mayor que 9, resta 9
4. Suma todos los dígitos
5. Si la suma es divisible por 10, el número es válido

### Tarjetas de Prueba Válidas

El sistema incluye estas tarjetas de prueba que pasan la validación de Luhn:

- **Visa**: 4532015112830366
- **Visa**: 4916338506082832
- **Mastercard**: 5425233430109903
- **Mastercard**: 5105105105105100

Puedes usar:
- **CVV**: Cualquier 3 dígitos (ej: 123)
- **Fecha de expiración**: Cualquier fecha futura en formato MM/YY (ej: 12/25)

## 🌐 API Endpoints

### Pagos

- `POST /api/payments` - Procesar un nuevo pago
  ```json
  {
    "clientName": "Juan Pérez",
    "clientEmail": "juan@ejemplo.com",
    "cardNumber": "4532015112830366",
    "cvv": "123",
    "expiryDate": "12/25",
    "amount": "100.00",
    "companyId": "1"
  }
  ```

- `GET /api/payments` - Obtener todos los pagos
- `GET /api/payments/:id` - Obtener un pago específico

### Empresas

- `GET /api/companies` - Obtener todas las empresas disponibles

## 🎨 Funcionalidades del Sistema

### Validaciones Implementadas

1. **Validación de Tarjeta (Luhn)**:
   - Verifica que el número de tarjeta sea válido matemáticamente
   - Detecta errores de escritura comunes

2. **Tipo de Tarjeta**:
   - Visa: Comienza con 4
   - Mastercard: Comienza con 51-55 o 2221-2720

3. **CVV**:
   - Debe ser de 3 o 4 dígitos

4. **Fecha de Expiración**:
   - Formato MM/YY
   - No puede estar vencida

5. **Monto**:
   - Debe ser un número positivo

### Proceso de Pago

1. El cliente ingresa sus datos y la información de la tarjeta
2. El sistema valida todos los campos
3. Se verifica el número de tarjeta con el algoritmo de Luhn
4. Se identifica el tipo de tarjeta (Visa/Mastercard)
5. Se simula el procesamiento con el banco (90% tasa de éxito)
6. Se muestra el resultado al usuario
7. Se registra en el historial de transacciones

## 🔒 Seguridad

- Los números de tarjeta se enmascaran mostrando solo los últimos 4 dígitos
- El CVV no se almacena después de la validación
- Las validaciones se realizan tanto en frontend como en backend

## 🚦 Estados de Pago

- **Pendiente**: Pago en proceso
- **Aprobado**: Pago procesado exitosamente
- **Rechazado**: Pago rechazado por el sistema bancario

## 📝 Notas de Desarrollo

Este es un sistema de simulación con propósitos educativos y de demostración. En un entorno de producción real, se deberían implementar:

- Base de datos persistente (MongoDB, PostgreSQL, etc.)
- Integración con pasarelas de pago reales (Stripe, PayPal, etc.)
- Autenticación y autorización de usuarios
- Encriptación de datos sensibles
- Certificados SSL/TLS
- Logging y monitoreo
- Pruebas unitarias y de integración
- Cumplimiento con PCI DSS

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📄 Licencia

ISC

## 👤 Autor

Santiago999

---

**⚠️ Aviso**: Este sistema es solo para propósitos educativos y de demostración. No debe ser utilizado para procesar pagos reales sin las medidas de seguridad y cumplimiento normativo adecuadas.