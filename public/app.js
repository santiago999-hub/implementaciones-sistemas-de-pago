/**
 * app.js - Lógica del frontend para la página de pagos
 */

const API_URL = 'http://localhost:3000/api';
let ultimoPagoRealizado = null;

// Cargar empresas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarEmpresas();
    
    // Configurar formulario
    const form = document.getElementById('paymentForm');
    form.addEventListener('submit', procesarPago);
});

/**
 * Cargar empresas en el dropdown
 */
async function cargarEmpresas() {
    try {
        const response = await fetch(`${API_URL}/empresas`);
        
        if (!response.ok) {
            throw new Error('Error al cargar empresas');
        }
        
        const empresas = await response.json();
        const selectEmpresa = document.getElementById('empresa');
        
        // Limpiar opciones existentes (excepto la primera)
        selectEmpresa.innerHTML = '<option value="">Seleccione una empresa...</option>';
        
        // Agregar empresas
        empresas.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = empresa.nombre;
            selectEmpresa.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudieron cargar las empresas. Por favor, recargue la página.');
    }
}

/**
 * Validar tarjeta con algoritmo de Luhn
 */
function validarTarjeta(numero) {
    const digitos = numero.replace(/\s/g, '').split('').reverse();
    let suma = 0;
    
    for (let i = 0; i < digitos.length; i++) {
        let digito = parseInt(digitos[i]);
        
        if (i % 2 === 1) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        
        suma += digito;
    }
    
    return suma % 10 === 0;
}

/**
 * Procesar el pago
 */
async function procesarPago(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(e.target);
    const numeroTarjeta = formData.get('numero_tarjeta')?.replace(/\s/g, '') || '';
    
    const datos = {
        nombre_cliente: formData.get('nombre').trim(),
        apellido_cliente: formData.get('apellido').trim(),
        empresa_id: parseInt(formData.get('empresa')),
        importe: parseFloat(formData.get('importe')),
        metodo_pago: formData.get('metodo_pago'),
        numero_tarjeta: numeroTarjeta
    };
    
    // Validaciones adicionales
    if (!datos.nombre_cliente || !datos.apellido_cliente) {
        mostrarError('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // Validar formato de nombre y apellido
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/;
    if (!regexNombre.test(datos.nombre_cliente)) {
        mostrarError('❌ Nombre inválido. Solo letras, entre 2 y 50 caracteres.');
        return;
    }
    
    if (!regexNombre.test(datos.apellido_cliente)) {
        mostrarError('❌ Apellido inválido. Solo letras, entre 2 y 50 caracteres.');
        return;
    }
    
    if (!datos.empresa_id) {
        mostrarError('Por favor, seleccione una empresa.');
        return;
    }
    
    // Validar rango de importe
    if (!datos.importe || datos.importe < 100 || datos.importe > 100000) {
        mostrarError('❌ Importe inválido. Debe estar entre $100 y $100,000.');
        return;
    }
    
    if (!datos.metodo_pago) {
        mostrarError('Por favor, seleccione un método de pago.');
        return;
    }
    
    // Validar número de tarjeta con algoritmo de Luhn
    if (numeroTarjeta && !validarTarjeta(numeroTarjeta)) {
        mostrarError('❌ Número de tarjeta inválido. Verifique los dígitos.');
        return;
    }
    
    // Mostrar loader
    mostrarLoader();
    
    // Deshabilitar botón durante el proceso
    const btnPagar = document.getElementById('btnPagar');
    const originalText = btnPagar.innerHTML;
    btnPagar.disabled = true;
    btnPagar.innerHTML = '<span class="btn-text">Procesando...</span>';
    
    try {
        const response = await fetch(`${API_URL}/pagos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al procesar el pago');
        }
        
        // Obtener nombre de la empresa
        const selectEmpresa = document.getElementById('empresa');
        const empresaNombre = selectEmpresa.options[selectEmpresa.selectedIndex].text;
        
        // Agregar número de comprobante a los datos
        datos.numero_comprobante = result.numero_comprobante;
        datos.empresa_nombre = empresaNombre;
        
        // Mostrar modal de éxito
        mostrarExito(
            `Pago de $${datos.importe.toFixed(2)} a ${empresaNombre} realizado exitosamente.`,
            datos
        );
        
        // Limpiar formulario
        e.target.reset();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message || 'Ocurrió un error al procesar el pago. Por favor, intente nuevamente.');
    } finally {
        // Ocultar loader
        ocultarLoader();
        
        // Rehabilitar botón
        btnPagar.disabled = false;
        btnPagar.innerHTML = originalText;
    }
}

/**
 * Mostrar modal de éxito
 */
function mostrarExito(mensaje, datos) {
    // Guardar datos del pago para el comprobante
    ultimoPagoRealizado = {
        ...datos,
        fecha: new Date().toLocaleString('es-AR'),
        numeroComprobante: datos.numero_comprobante
    };
    
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    messageElement.innerHTML = `
        <strong>${mensaje}</strong><br><br>
        <small>
            Cliente: ${datos.nombre_cliente} ${datos.apellido_cliente}<br>
            Método: ${datos.metodo_pago}<br>
            Fecha: ${ultimoPagoRealizado.fecha}<br>
            Comprobante: <strong>${ultimoPagoRealizado.numeroComprobante}</strong>
        </small>
    `;
    
    modal.style.display = 'flex';
}

/**
 * Cerrar modal de éxito
 */
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

/**
 * Mostrar modal de error
 */
function mostrarError(mensaje) {
    const modal = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorMessage');
    
    messageElement.textContent = mensaje;
    modal.style.display = 'flex';
}

/**
 * Cerrar modal de error
 */
function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';
}

/**
 * Imprimir comprobante de pago
 */
function imprimirComprobante() {
    if (!ultimoPagoRealizado) {
        alert('No hay datos de pago para imprimir');
        return;
    }
    
    // Usar nombre de empresa guardado
    const empresaNombre = ultimoPagoRealizado.empresa_nombre || 'N/A';
    
    // Generar contenido del comprobante
    const comprobanteContent = document.getElementById('comprobanteContent');
    comprobanteContent.innerHTML = `
        <table class="comprobante-table">
            <tr>
                <td class="label">Número de Comprobante:</td>
                <td class="value"><strong>${ultimoPagoRealizado.numeroComprobante}</strong></td>
            </tr>
            <tr>
                <td class="label">Fecha y Hora:</td>
                <td class="value">${ultimoPagoRealizado.fecha}</td>
            </tr>
            <tr>
                <td class="label">Cliente:</td>
                <td class="value">${ultimoPagoRealizado.nombre_cliente} ${ultimoPagoRealizado.apellido_cliente}</td>
            </tr>
            <tr>
                <td class="label">Empresa:</td>
                <td class="value">${empresaNombre}</td>
            </tr>
            <tr>
                <td class="label">Método de Pago:</td>
                <td class="value">${ultimoPagoRealizado.metodo_pago}</td>
            </tr>
            <tr class="total-row">
                <td class="label">Importe Total:</td>
                <td class="value"><strong>$ ${parseFloat(ultimoPagoRealizado.importe).toFixed(2)}</strong></td>
            </tr>
        </table>
    `;
    
    // Obtener contenido para imprimir
    const contenidoImprimir = document.getElementById('comprobanteImpresion').innerHTML;
    
    // Crear ventana de impresión
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comprobante de Pago - ${ultimoPagoRealizado.numeroComprobante}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 40px;
                    background: white;
                }
                .comprobante-print {
                    max-width: 600px;
                    margin: 0 auto;
                    border: 2px solid #333;
                    padding: 30px;
                }
                .comprobante-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .comprobante-header h1 {
                    color: #8B1538;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .banco-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }
                hr {
                    border: none;
                    border-top: 2px solid #8B1538;
                    margin: 20px 0;
                }
                .comprobante-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .comprobante-table tr {
                    border-bottom: 1px solid #ddd;
                }
                .comprobante-table td {
                    padding: 12px 10px;
                }
                .comprobante-table .label {
                    width: 40%;
                    color: #666;
                }
                .comprobante-table .value {
                    width: 60%;
                    color: #333;
                    font-weight: 500;
                }
                .total-row {
                    border-top: 2px solid #333 !important;
                    background: #f9f9f9;
                }
                .total-row td {
                    font-size: 18px;
                    padding: 15px 10px;
                }
                .comprobante-footer {
                    text-align: center;
                    margin-top: 20px;
                }
                .comprobante-footer p {
                    margin: 5px 0;
                }
                .small-text {
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body { padding: 0; }
                    .comprobante-print { border: none; }
                }
            </style>
        </head>
        <body>
            ${contenidoImprimir}
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    
    if (event.target === successModal) {
        closeModal();
    }
    if (event.target === errorModal) {
        closeErrorModal();
    }
};

/**
 * Mostrar loader de procesamiento
 */
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
    }
}

/**
 * Ocultar loader de procesamiento
 */
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Descargar comprobante como HTML
 */
function descargarComprobante() {
    if (!ultimoPagoRealizado) {
        alert('No hay comprobante disponible para descargar.');
        return;
    }
    
    const contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de Pago - ${ultimoPagoRealizado.numeroComprobante}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        .comprobante-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .comprobante-header {
            background: linear-gradient(135deg, #8B1538 0%, #5a0e24 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .comprobante-header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .comprobante-numero {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 10px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .comprobante-body {
            padding: 40px;
        }
        .info-section {
            margin-bottom: 30px;
        }
        .info-section h2 {
            color: #8B1538;
            font-size: 1.3rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        .info-label {
            font-weight: 600;
            color: #555;
        }
        .info-value {
            color: #333;
            font-weight: 500;
        }
        .total-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 10px;
            margin-top: 30px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 1.5rem;
            font-weight: bold;
            color: #8B1538;
        }
        .comprobante-footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        .verificacion {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .comprobante-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="comprobante-container">
        <div class="comprobante-header">
            <h1>🏦 Banco Robles</h1>
            <p>Sistema de Pagos Online</p>
            <div class="comprobante-numero">
                Nº ${ultimoPagoRealizado.numeroComprobante}
            </div>
        </div>
        
        <div class="comprobante-body">
            <div class="info-section">
                <h2>📋 Información del Cliente</h2>
                <div class="info-row">
                    <span class="info-label">Nombre Completo:</span>
                    <span class="info-value">${ultimoPagoRealizado.nombre_cliente} ${ultimoPagoRealizado.apellido_cliente}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fecha y Hora:</span>
                    <span class="info-value">${ultimoPagoRealizado.fecha}</span>
                </div>
            </div>
            
            <div class="info-section">
                <h2>💳 Detalles del Pago</h2>
                <div class="info-row">
                    <span class="info-label">Empresa:</span>
                    <span class="info-value">${ultimoPagoRealizado.empresa_nombre}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Método de Pago:</span>
                    <span class="info-value">${ultimoPagoRealizado.metodo_pago}</span>
                </div>
                ${ultimoPagoRealizado.numero_tarjeta ? `
                <div class="info-row">
                    <span class="info-label">Tarjeta:</span>
                    <span class="info-value">**** **** **** ${ultimoPagoRealizado.numero_tarjeta.slice(-4)}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="total-section">
                <div class="total-row">
                    <span>TOTAL PAGADO:</span>
                    <span>$${parseFloat(ultimoPagoRealizado.importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                </div>
            </div>
            
            <div class="verificacion">
                <strong>✓ Pago verificado y procesado exitosamente</strong>
                <p style="margin-top: 10px; font-size: 0.9rem;">
                    Este comprobante es válido como constancia de pago. 
                    Conserve este documento para futuras referencias.
                </p>
            </div>
        </div>
        
        <div class="comprobante-footer">
            <p><strong>Banco Robles - Sistema de Pagos Online</strong></p>
            <p>Este es un comprobante electrónico generado automáticamente</p>
            <p style="margin-top: 10px; font-size: 0.85rem;">
                Comprobante: ${ultimoPagoRealizado.numeroComprobante} | 
                Fecha: ${new Date().toLocaleDateString('es-AR')}
            </p>
        </div>
    </div>
</body>
</html>
    `;
    
    // Crear blob y descargar
    const blob = new Blob([contenidoHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_${ultimoPagoRealizado.numeroComprobante}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
        alert('✅ Comprobante descargado exitosamente!\n\nPuedes abrir el archivo HTML en cualquier navegador para ver e imprimir tu comprobante.');
    }, 100);
}
