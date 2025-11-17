/**
 * admin.js - Lógica del panel de administración
 */

const API_URL = 'http://localhost:3000/api';
let empresaAEliminar = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    configurarTabs();
    cargarEmpresasAdmin();
    cargarEmpresasFiltro();
    configurarFormularioEmpresa();
    
    // Establecer fecha actual por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaHasta').value = hoy;
    
    // Cargar ventas y estadísticas inicialmente
    consultarVentas();
    cargarEstadisticas();
});

/**
 * Cargar estadísticas del dashboard
 */
async function cargarEstadisticas() {
    try {
        const [pagosResponse, empresasResponse] = await Promise.all([
            fetch(`${API_URL}/pagos`),
            fetch(`${API_URL}/empresas`)
        ]);
        
        const pagos = await pagosResponse.json();
        const empresas = await empresasResponse.json();
        
        // Total recaudado
        const totalRecaudado = pagos.reduce((sum, pago) => sum + parseFloat(pago.importe || 0), 0);
        document.getElementById('totalRecaudado').textContent = `$${totalRecaudado.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        
        // Total de pagos
        document.getElementById('totalPagos').textContent = pagos.length;
        
        // Pagos por método
        const pagoVisa = pagos.filter(p => p.metodo_pago?.toLowerCase() === 'visa').length;
        const pagoMastercard = pagos.filter(p => p.metodo_pago?.toLowerCase() === 'mastercard').length;
        document.getElementById('pagoVisa').textContent = pagoVisa;
        document.getElementById('pagoMastercard').textContent = pagoMastercard;
        
        // Promedio de importe
        const promedioImporte = pagos.length > 0 ? totalRecaudado / pagos.length : 0;
        document.getElementById('promedioImporte').textContent = `$${promedioImporte.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        
        // Total empresas
        document.getElementById('totalEmpresas').textContent = empresas.length;
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

/**
 * Configurar sistema de pestañas
 */
function configurarTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Mostrar contenido correspondiente
            const tabId = btn.dataset.tab;
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
}

// ==================== GESTIÓN DE VENTAS ====================

/**
 * Consultar ventas con filtros
 */
async function consultarVentas() {
    try {
        // Obtener filtros
        const buscarCliente = document.getElementById('buscarCliente').value.toLowerCase().trim();
        const empresaId = document.getElementById('filtroEmpresa').value;
        const metodoPago = document.getElementById('filtroMetodoPago').value;
        const fechaDesde = document.getElementById('fechaDesde').value;
        const fechaHasta = document.getElementById('fechaHasta').value;
        
        // Construir URL con parámetros
        let url = `${API_URL}/pagos?`;
        if (empresaId) url += `empresa_id=${empresaId}&`;
        if (fechaDesde) url += `fecha_desde=${fechaDesde}&`;
        if (fechaHasta) url += `fecha_hasta=${fechaHasta}&`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al consultar ventas');
        }
        
        let ventas = await response.json();
        
        // Filtrar por cliente (búsqueda en frontend)
        if (buscarCliente) {
            ventas = ventas.filter(v => {
                const nombreCompleto = `${v.nombre_cliente} ${v.apellido_cliente}`.toLowerCase();
                return nombreCompleto.includes(buscarCliente);
            });
        }
        
        // Filtrar por método de pago
        if (metodoPago) {
            ventas = ventas.filter(v => v.metodo_pago === metodoPago);
        }
        
        mostrarVentas(ventas);
        actualizarEstadisticas(ventas);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al consultar ventas', 'error');
    }
}

/**
 * Mostrar ventas en la tabla
 */
function mostrarVentas(ventas) {
    const tbody = document.getElementById('ventasTableBody');
    
    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No se encontraron ventas</td></tr>';
        return;
    }
    
    tbody.innerHTML = ventas.map(venta => `
        <tr>
            <td>${venta.id}</td>
            <td><span class="comprobante-badge">${venta.numero_comprobante || 'N/A'}</span></td>
            <td>${formatearFecha(venta.fecha_pago)}</td>
            <td>${venta.nombre_cliente} ${venta.apellido_cliente}</td>
            <td>${venta.empresa_nombre}</td>
            <td class="text-right">$${parseFloat(venta.importe).toFixed(2)}</td>
            <td><span class="badge badge-${venta.metodo_pago.toLowerCase()}">${venta.metodo_pago}</span></td>
        </tr>
    `).join('');
}

/**
 * Actualizar estadísticas
 */
function actualizarEstadisticas(ventas) {
    const totalVentas = ventas.length;
    const totalImporte = ventas.reduce((sum, v) => sum + parseFloat(v.importe), 0);
    const promedioImporte = totalVentas > 0 ? totalImporte / totalVentas : 0;
    
    document.getElementById('totalVentas').textContent = totalVentas;
    document.getElementById('totalImporte').textContent = `$${totalImporte.toFixed(2)}`;
    document.getElementById('promedioImporte').textContent = `$${promedioImporte.toFixed(2)}`;
}

/**
 * Limpiar filtros
 */
function limpiarFiltros() {
    document.getElementById('buscarCliente').value = '';
    document.getElementById('filtroEmpresa').value = '';
    document.getElementById('filtroMetodoPago').value = '';
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = new Date().toISOString().split('T')[0];
    consultarVentas();
}

/**
 * Exportar ventas a CSV
 */
async function exportarCSV() {
    try {
        // Obtener filtros actuales
        const buscarCliente = document.getElementById('buscarCliente').value.toLowerCase().trim();
        const empresaId = document.getElementById('filtroEmpresa').value;
        const metodoPago = document.getElementById('filtroMetodoPago').value;
        const fechaDesde = document.getElementById('fechaDesde').value;
        const fechaHasta = document.getElementById('fechaHasta').value;
        
        // Construir URL
        let url = `${API_URL}/pagos?`;
        if (empresaId) url += `empresa_id=${empresaId}&`;
        if (fechaDesde) url += `fecha_desde=${fechaDesde}&`;
        if (fechaHasta) url += `fecha_hasta=${fechaHasta}&`;
        
        const response = await fetch(url);
        let ventas = await response.json();
        
        // Aplicar filtros de cliente y método de pago
        if (buscarCliente) {
            ventas = ventas.filter(v => {
                const nombreCompleto = `${v.nombre_cliente} ${v.apellido_cliente}`.toLowerCase();
                return nombreCompleto.includes(buscarCliente);
            });
        }
        if (metodoPago) {
            ventas = ventas.filter(v => v.metodo_pago === metodoPago);
        }
        
        if (ventas.length === 0) {
            mostrarNotificacion('No hay ventas para exportar', 'warning');
            return;
        }
        
        // Crear CSV
        let csv = 'ID,Comprobante,Fecha,Nombre,Apellido,Empresa,Importe,Metodo de Pago\n';
        ventas.forEach(v => {
            csv += `${v.id},${v.numero_comprobante || 'N/A'},${formatearFecha(v.fecha_pago)},${v.nombre_cliente},${v.apellido_cliente},${v.empresa_nombre},${v.importe},${v.metodo_pago}\n`;
        });
        
        // Descargar archivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        mostrarNotificacion('Archivo CSV exportado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar CSV', 'error');
    }
}

// ==================== GESTIÓN DE EMPRESAS ====================

/**
 * Cargar empresas en la tabla de administración
 */
async function cargarEmpresasAdmin() {
    try {
        const response = await fetch(`${API_URL}/empresas`);
        
        if (!response.ok) {
            throw new Error('Error al cargar empresas');
        }
        
        const empresas = await response.json();
        mostrarEmpresasTabla(empresas);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar empresas', 'error');
    }
}

/**
 * Cargar empresas en el filtro
 */
async function cargarEmpresasFiltro() {
    try {
        const response = await fetch(`${API_URL}/empresas`);
        const empresas = await response.json();
        
        const select = document.getElementById('filtroEmpresa');
        select.innerHTML = '<option value="">Todas las empresas</option>';
        
        empresas.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = empresa.nombre;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Mostrar empresas en la tabla
 */
function mostrarEmpresasTabla(empresas) {
    const tbody = document.getElementById('empresasTableBody');
    
    if (empresas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay empresas registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = empresas.map(empresa => `
        <tr>
            <td>${empresa.id}</td>
            <td><strong>${empresa.nombre}</strong></td>
            <td>${empresa.contacto || '-'}</td>
            <td>${empresa.email || '-'}</td>
            <td>${empresa.telefono || '-'}</td>
            <td class="actions-cell">
                <button class="btn-icon btn-edit" onclick="editarEmpresa(${empresa.id})" title="Editar">
                    ✏️
                </button>
                <button class="btn-icon btn-delete" onclick="confirmarEliminarEmpresa(${empresa.id}, '${empresa.nombre}')" title="Eliminar">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Configurar formulario de empresa
 */
function configurarFormularioEmpresa() {
    const form = document.getElementById('formEmpresa');
    form.addEventListener('submit', guardarEmpresa);
}

/**
 * Mostrar formulario de nueva empresa
 */
function mostrarFormularioEmpresa() {
    document.getElementById('formTitle').textContent = 'Nueva Empresa';
    document.getElementById('empresaId').value = '';
    document.getElementById('formEmpresa').reset();
    document.getElementById('formEmpresaContainer').style.display = 'block';
    document.getElementById('empresaNombre').focus();
}

/**
 * Cancelar formulario
 */
function cancelarFormularioEmpresa() {
    document.getElementById('formEmpresaContainer').style.display = 'none';
    document.getElementById('formEmpresa').reset();
}

/**
 * Editar empresa
 */
async function editarEmpresa(id) {
    try {
        const response = await fetch(`${API_URL}/empresas/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener empresa');
        }
        
        const empresa = await response.json();
        
        // Llenar formulario
        document.getElementById('formTitle').textContent = 'Editar Empresa';
        document.getElementById('empresaId').value = empresa.id;
        document.getElementById('empresaNombre').value = empresa.nombre;
        document.getElementById('empresaContacto').value = empresa.contacto || '';
        document.getElementById('empresaEmail').value = empresa.email || '';
        document.getElementById('empresaTelefono').value = empresa.telefono || '';
        
        // Mostrar formulario
        document.getElementById('formEmpresaContainer').style.display = 'block';
        document.getElementById('empresaNombre').focus();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos de la empresa', 'error');
    }
}

/**
 * Guardar empresa (crear o actualizar)
 */
async function guardarEmpresa(e) {
    e.preventDefault();
    
    const id = document.getElementById('empresaId').value;
    const datos = {
        nombre: document.getElementById('empresaNombre').value.trim(),
        contacto: document.getElementById('empresaContacto').value.trim(),
        email: document.getElementById('empresaEmail').value.trim(),
        telefono: document.getElementById('empresaTelefono').value.trim()
    };
    
    const esEdicion = id !== '';
    const url = esEdicion ? `${API_URL}/empresas/${id}` : `${API_URL}/empresas`;
    const method = esEdicion ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al guardar empresa');
        }
        
        mostrarNotificacion(
            esEdicion ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente',
            'success'
        );
        
        cancelarFormularioEmpresa();
        cargarEmpresasAdmin();
        cargarEmpresasFiltro();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

/**
 * Confirmar eliminación de empresa
 */
function confirmarEliminarEmpresa(id, nombre) {
    empresaAEliminar = id;
    document.getElementById('confirmMessage').textContent = 
        `¿Está seguro que desea eliminar la empresa "${nombre}"? Los pagos asociados no se eliminarán.`;
    document.getElementById('confirmModal').style.display = 'flex';
}

/**
 * Confirmar eliminación
 */
async function confirmarEliminacion() {
    if (!empresaAEliminar) return;
    
    try {
        const response = await fetch(`${API_URL}/empresas/${empresaAEliminar}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al eliminar empresa');
        }
        
        mostrarNotificacion('Empresa eliminada exitosamente', 'success');
        cargarEmpresasAdmin();
        cargarEmpresasFiltro();
        closeConfirmModal();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
        closeConfirmModal();
    }
}

/**
 * Cerrar modal de confirmación
 */
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    empresaAEliminar = null;
}

// ==================== UTILIDADES ====================

/**
 * Formatear fecha
 */
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const title = document.getElementById('notificationTitle');
    const message = document.getElementById('notificationMessage');
    
    // Configurar según tipo
    if (tipo === 'success') {
        icon.textContent = '✓';
        icon.className = 'modal-icon success';
        title.textContent = 'Éxito';
    } else if (tipo === 'error') {
        icon.textContent = '✕';
        icon.className = 'modal-icon error';
        title.textContent = 'Error';
    } else if (tipo === 'warning') {
        icon.textContent = '⚠️';
        icon.className = 'modal-icon warning';
        title.textContent = 'Advertencia';
    }
    
    message.textContent = mensaje;
    modal.style.display = 'flex';
}

/**
 * Cerrar notificación
 */
function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const confirmModal = document.getElementById('confirmModal');
    const notificationModal = document.getElementById('notificationModal');
    
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
    if (event.target === notificationModal) {
        closeNotificationModal();
    }
}
