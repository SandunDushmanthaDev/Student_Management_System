const NAME_REGEX = /^[a-zA-Z ]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(0)(7)([012456789])([0-9]{7})$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9 ,./]{5,100}$/;


function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = 'alert ' + type;
    alert.style.display = 'block';
    setTimeout(() => alert.style.display = 'none', 3000);
}


function loadCustomers() {
    fetch('/api/customer')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('customerTable');
            if (!data.status || !data.data || data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="loading">No customers found</td></tr>';
                return;
            }
            let rows = '';
            data.data.forEach(function(c) {
                rows += '<tr>' +
                    '<td>' + c.id + '</td>' +
                    '<td>' + c.customerName + '</td>' +
                    '<td>' + c.customerEmail + '</td>' +
                    '<td>' + c.customerMobile + '</td>' +
                    '<td>' + c.customerAddress + '</td>' +
                    '<td><div class="actions">' +
                    '<button class="btn btn-edit btn-sm" onclick="openEditModal(' + c.id + ', \'' + c.customerName + '\', \'' + c.customerEmail + '\', \'' + c.customerMobile + '\', \'' + c.customerAddress + '\')">Edit</button>' +
                    '<button class="btn btn-danger btn-sm" onclick="deleteCustomer(' + c.id + ')">Delete</button>' +
                    '</div></td>' +
                    '</tr>';
            });
            tbody.innerHTML = rows;
        })
        .catch(err => console.error('Error:', err));
}


function openAddModal() {
    document.getElementById('modalTitle').innerHTML = 'Add <span style="color:var(--accent)">Customer</span>';
    document.getElementById('customerId').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('customerAddress').value = '';
    clearErrors();
    document.getElementById('modalOverlay').classList.add('show');
}


function openEditModal(id, name, email, mobile, address) {
    document.getElementById('modalTitle').innerHTML = 'Edit <span style="color:var(--accent)">Customer</span>';
    document.getElementById('customerId').value = id;
    document.getElementById('customerName').value = name;
    document.getElementById('customerEmail').value = email;
    document.getElementById('customerMobile').value = mobile;
    document.getElementById('customerAddress').value = address;
    clearErrors();
    document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
}

function clearErrors() {
    ['nameError','emailError','mobileError','addressError'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}


function validate() {
    let valid = true;
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const mobile = document.getElementById('customerMobile').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    clearErrors();

    if (!NAME_REGEX.test(name)) {
        document.getElementById('nameError').style.display = 'block';
        valid = false;
    }
    if (!EMAIL_REGEX.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        valid = false;
    }
    if (!MOBILE_REGEX.test(mobile)) {
        document.getElementById('mobileError').style.display = 'block';
        valid = false;
    }
    if (!ADDRESS_REGEX.test(address)) {
        document.getElementById('addressError').style.display = 'block';
        valid = false;
    }
    return valid;
}


function saveCustomer() {
    if (!validate()) return;

    const id = document.getElementById('customerId').value;
    const data = {
        id: id ? parseInt(id) : 0,
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerMobile: document.getElementById('customerMobile').value.trim(),
        customerAddress: document.getElementById('customerAddress').value.trim()
    };

    const method = id ? 'PUT' : 'POST';

    fetch('/api/customer', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            if (result.status) {
                closeModal();
                showAlert(result.message, 'success');
                loadCustomers();
            } else {
                showAlert(result.message, 'error');
            }
        });
}


function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    fetch('/api/customer?id=' + id, { method: 'DELETE' })
        .then(res => res.json())
        .then(result => {
            showAlert(result.message, result.status ? 'success' : 'error');
            if (result.status) loadCustomers();
        });
}


document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});


loadCustomers();