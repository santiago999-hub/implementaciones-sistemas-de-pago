/**
 * Frontend JavaScript for Payment Processing
 */

// Load companies on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCompanies();
    loadPaymentHistory();
    setupFormHandlers();
});

/**
 * Load companies from API
 */
async function loadCompanies() {
    try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        
        if (data.success) {
            const companySelect = document.getElementById('companyId');
            companySelect.innerHTML = '<option value="">Seleccione una empresa...</option>';
            
            data.companies.forEach(company => {
                const option = document.createElement('option');
                option.value = company.id;
                option.textContent = `${company.name} - ${company.category}`;
                companySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading companies:', error);
        showAlert('Error al cargar las empresas', 'error');
    }
}

/**
 * Load payment history
 */
async function loadPaymentHistory() {
    try {
        const response = await fetch('/api/payments');
        const data = await response.json();
        
        if (data.success) {
            displayPaymentHistory(data.payments);
        }
    } catch (error) {
        console.error('Error loading payment history:', error);
        document.getElementById('paymentHistory').innerHTML = 
            '<p class="text-muted">Error al cargar el historial</p>';
    }
}

/**
 * Display payment history
 */
function displayPaymentHistory(payments) {
    const historyContainer = document.getElementById('paymentHistory');
    
    if (payments.length === 0) {
        historyContainer.innerHTML = '<p class="text-muted">No hay pagos registrados</p>';
        return;
    }
    
    // Sort by most recent first
    payments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show only last 5 payments
    const recentPayments = payments.slice(0, 5);
    
    historyContainer.innerHTML = recentPayments.map(payment => `
        <div class="payment-item status-${payment.status}">
            <div class="payment-header">
                <span class="payment-id">Pago #${payment.id}</span>
                <span class="payment-status status-${payment.status}">
                    ${payment.status === 'approved' ? 'Aprobado' : 
                      payment.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                </span>
            </div>
            <div class="payment-details">
                <div><strong>Cliente:</strong> ${payment.clientName}</div>
                <div><strong>Empresa:</strong> ${payment.company}</div>
                <div><strong>Tarjeta:</strong> ${payment.cardType} ${payment.cardNumber}</div>
                <div><strong>Monto:</strong> $${payment.amount.toFixed(2)}</div>
                <div><strong>Fecha:</strong> ${new Date(payment.timestamp).toLocaleString('es-ES')}</div>
            </div>
            ${payment.rejectionReason ? `
                <div style="margin-top: 10px; color: #721c24;">
                    <strong>Razón de rechazo:</strong> ${payment.rejectionReason}
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Setup form handlers
 */
function setupFormHandlers() {
    const form = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    // Format card number as user types
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Format expiry date as user types
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow digits in CVV
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await processPayment();
    });
}

/**
 * Process payment
 */
async function processPayment() {
    const form = document.getElementById('paymentForm');
    const submitBtn = document.getElementById('submitBtn');
    const alertContainer = document.getElementById('alertContainer');
    
    // Get form data
    const formData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        cvv: document.getElementById('cvv').value,
        expiryDate: document.getElementById('expiryDate').value,
        amount: document.getElementById('amount').value,
        companyId: document.getElementById('companyId').value
    };
    
    // Disable form
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    form.classList.add('loading');
    
    try {
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`✅ ${data.message}`, 'success');
            form.reset();
            
            // Reload payment history
            setTimeout(() => {
                loadPaymentHistory();
            }, 500);
            
            // Show payment details
            displayPaymentResult(data.payment);
        } else {
            showAlert(`❌ ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        showAlert('❌ Error al procesar el pago. Por favor, intente nuevamente.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Procesar Pago';
        form.classList.remove('loading');
    }
}

/**
 * Display payment result
 */
function displayPaymentResult(payment) {
    const resultContainer = document.getElementById('paymentResult');
    
    resultContainer.innerHTML = `
        <h3>Resultado del Pago</h3>
        <div class="payment-item status-${payment.status}">
            <div class="payment-header">
                <span class="payment-id">Pago #${payment.id}</span>
                <span class="payment-status status-${payment.status}">
                    ${payment.status === 'approved' ? '✅ Aprobado' : 
                      payment.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente'}
                </span>
            </div>
            <div class="payment-details">
                <div><strong>Cliente:</strong> ${payment.clientName}</div>
                <div><strong>Email:</strong> ${payment.clientEmail}</div>
                <div><strong>Empresa:</strong> ${payment.company}</div>
                <div><strong>Tarjeta:</strong> ${payment.cardType} ${payment.cardNumber}</div>
                <div><strong>Monto:</strong> $${payment.amount.toFixed(2)}</div>
                <div><strong>Fecha:</strong> ${new Date(payment.timestamp).toLocaleString('es-ES')}</div>
            </div>
            ${payment.rejectionReason ? `
                <div style="margin-top: 15px; padding: 15px; background: #f8d7da; border-radius: 6px; color: #721c24;">
                    <strong>Razón de rechazo:</strong> ${payment.rejectionReason}
                </div>
            ` : ''}
        </div>
    `;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show alert message
 */
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    
    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            ${message}
        </div>
    `;
    
    // Scroll to alert
    alertContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}
