var allInvoices = [];
var currentInvoice = null;

function showAlert(message, type) {
    var el = document.getElementById('alertBox');
    el.textContent = message;
    el.className = 'alert ' + type;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 4000);
}

function loadInvoices() {
    fetch('/api/invoice')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.status || data.data.length === 0) {
                allInvoices = [];
                document.getElementById('invoiceTable').innerHTML = '<tr><td colspan="8" class="loading">No invoices found</td></tr>';
                document.getElementById('searchCount').textContent = '';
                return;
            }
            allInvoices = data.data;
            renderTable(allInvoices);
        })
        .catch(function() {
            document.getElementById('invoiceTable').innerHTML = '<tr><td colspan="8" class="loading">Failed to load invoices!</td></tr>';
        });
}


function renderTable(invoices) {
    var tbody = document.getElementById('invoiceTable');
    document.getElementById('searchCount').textContent = invoices.length + ' invoice(s) found';

    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No matching invoices found</td></tr>';
        return;
    }

    var html = '';
    for (var i = 0; i < invoices.length; i++) {
        var inv = invoices[i];
        var date = inv.invoiceDate ? inv.invoiceDate.substring(0, 10) : 'N/A';
        var badgeClass = inv.paymentMethod && inv.paymentMethod.toLowerCase() === 'cash' ? 'badge-green' : 'badge-purple';
        var balColor = inv.balanceAmount < 0 ? 'color:var(--danger)' : 'color:var(--accent3)';

        html += '<tr>';
        html += '<td>' + inv.id + '</td>';
        html += '<td>' + inv.customerName + '</td>';
        html += '<td>' + date + '</td>';
        html += '<td>Rs. ' + inv.totalAmount.toLocaleString() + '</td>';
        html += '<td>Rs. ' + inv.paidAmount.toLocaleString() + '</td>';
        html += '<td style="' + balColor + '">Rs. ' + inv.balanceAmount.toLocaleString() + '</td>';
        html += '<td><span class="badge ' + badgeClass + '">' + inv.paymentMethod + '</span></td>';
        html += '<td><div class="actions">';
        html += '<button class="btn btn-view btn-sm" onclick="viewInvoice(' + inv.id + ')">View</button>';
        html += '<button class="btn btn-edit btn-sm" onclick="editInvoice(' + inv.id + ')">Edit</button>';
        html += '<button class="btn btn-danger btn-sm" onclick="deleteInvoice(' + inv.id + ')">Delete</button>';
        html += '</div></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}


function filterInvoices() {
    var query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (query === '') {
        renderTable(allInvoices);
        return;
    }
    var filtered = [];
    for (var i = 0; i < allInvoices.length; i++) {
        var inv = allInvoices[i];
        var idMatch = ('#' + inv.id).indexOf(query) !== -1 || ('' + inv.id).indexOf(query) !== -1;
        var nameMatch = inv.customerName && inv.customerName.toLowerCase().indexOf(query) !== -1;
        if (idMatch || nameMatch) {
            filtered.push(inv);
        }
    }
    renderTable(filtered);
}


function viewInvoice(id) {
    fetch('/api/invoice?id=' + id)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.status) { showAlert(data.message, 'error'); return; }
            var inv = data.data;
            currentInvoice = inv;

            document.getElementById('modalInvoiceId').textContent = '' + inv.id;
            document.getElementById('modalCustomer').textContent = inv.customerName;
            document.getElementById('modalPayment').textContent = inv.paymentMethod;
            document.getElementById('modalDate').textContent = inv.invoiceDate ? inv.invoiceDate.substring(0, 10) : 'N/A';
            document.getElementById('modalDiscount').textContent = 'Rs. ' + inv.discount.toLocaleString();
            document.getElementById('modalTotal').textContent = 'Rs. ' + inv.totalAmount.toLocaleString();
            document.getElementById('modalPaid').textContent = 'Rs. ' + inv.paidAmount.toLocaleString();

            var balEl = document.getElementById('modalBalance');
            balEl.textContent = 'Rs. ' + inv.balanceAmount.toLocaleString();
            balEl.style.color = inv.balanceAmount < 0 ? 'var(--danger)' : 'var(--accent3)';

            var itemsHtml = '';
            for (var i = 0; i < inv.invoiceItems.length; i++) {
                var item = inv.invoiceItems[i];
                itemsHtml += '<tr>';
                itemsHtml += '<td>' + item.productName + '</td>';
                itemsHtml += '<td>Rs. ' + item.unitPrice.toLocaleString() + '</td>';
                itemsHtml += '<td>' + item.qty + '</td>';
                itemsHtml += '<td>Rs. ' + item.subTotal.toLocaleString() + '</td>';
                itemsHtml += '</tr>';
            }
            document.getElementById('modalItems').innerHTML = itemsHtml;
            document.getElementById('modalOverlay').classList.add('show');
        });
}


function downloadPDF() {
    if (!currentInvoice) return;
    var inv = currentInvoice;
    var doc = new window.jspdf.jsPDF();


    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice System', 105, 28, { align: 'center' });

    doc.setDrawColor(108, 99, 255);
    doc.setLineWidth(0.8);
    doc.line(14, 33, 196, 33);


    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #' + inv.id, 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.text('Customer: ' + inv.customerName, 14, 50);
    doc.text('Date: ' + (inv.invoiceDate ? inv.invoiceDate.substring(0, 10) : 'N/A'), 14, 58);
    doc.text('Payment: ' + inv.paymentMethod, 14, 66);
    doc.text('Discount: Rs. ' + inv.discount.toLocaleString(), 120, 50);


    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, 74, 196, 74);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Product', 14, 81);
    doc.text('Unit Price', 90, 81);
    doc.text('Qty', 130, 81);
    doc.text('Sub Total', 160, 81);
    doc.line(14, 84, 196, 84);

    doc.setFont('helvetica', 'normal');
    var y = 92;
    for (var i = 0; i < inv.invoiceItems.length; i++) {
        var item = inv.invoiceItems[i];
        doc.text(item.productName, 14, y);
        doc.text('Rs. ' + item.unitPrice.toLocaleString(), 90, y);
        doc.text('' + item.qty, 130, y);
        doc.text('Rs. ' + item.subTotal.toLocaleString(), 160, y);
        y += 10;
    }


    doc.line(14, y + 2, 196, y + 2);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 120, y);
    doc.text('Rs. ' + inv.totalAmount.toLocaleString(), 170, y);
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.text('Paid Amount:', 120, y);
    doc.text('Rs. ' + inv.paidAmount.toLocaleString(), 170, y);
    y += 9;
    doc.text('Balance:', 120, y);
    doc.text('Rs. ' + inv.balanceAmount.toLocaleString(), 170, y);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated by Invoice System', 105, 285, { align: 'center' });
    doc.save('Invoice_' + inv.id + '_' + inv.customerName + '.pdf');
}


function deleteInvoice(id) {
    if (!confirm('Are you sure you want to delete Invoice ' + id + '?')) return;
    fetch('/api/invoice?id=' + id, { method: 'DELETE' })
        .then(function(r) { return r.json(); })
        .then(function(result) {
            showAlert(result.message, result.status ? 'success' : 'error');
            if (result.status) loadInvoices();
        })
        .catch(function() {
            showAlert('Connection error!', 'error');
        });
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    currentInvoice = null;
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});


var editItemCount = 0;
var allCustomers = [];
var allPaymentMethods = [];

fetch('/api/customer')
    .then(function(r) { return r.json(); })
    .then(function(data) { if (data.status) allCustomers = data.data; });

fetch('/api/payment-method')
    .then(function(r) { return r.json(); })
    .then(function(data) { if (data.status) allPaymentMethods = data.data; });

function editInvoice(id) {
    fetch('/api/invoice?id=' + id)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.status) { showAlert(data.message, 'error'); return; }
            var inv = data.data;

            document.getElementById('editInvoiceId').value = inv.id;
            document.getElementById('editInvoiceTitle').textContent = 'Invoice ' + inv.id;

            var custSel = document.getElementById('editCustomerId');
            custSel.innerHTML = '';
            for (var i = 0; i < allCustomers.length; i++) {
                var opt = document.createElement('option');
                opt.value = allCustomers[i].id;
                opt.text = allCustomers[i].customerName;
                if (allCustomers[i].id == inv.customerId) opt.selected = true;
                custSel.appendChild(opt);
            }

            var pmSel = document.getElementById('editPaymentMethodId');
            pmSel.innerHTML = '';
            for (var j = 0; j < allPaymentMethods.length; j++) {
                var opt2 = document.createElement('option');
                opt2.value = allPaymentMethods[j].id;
                opt2.text = allPaymentMethods[j].method;
                if (allPaymentMethods[j].method === inv.paymentMethod) opt2.selected = true;
                pmSel.appendChild(opt2);
            }

            document.getElementById('editDiscount').value = inv.discount || 0;
            document.getElementById('editPaidAmount').value = inv.paidAmount || 0;

            var tbody = document.getElementById('editItemsBody');
            tbody.innerHTML = '';
            editItemCount = 0;
            for (var k = 0; k < inv.invoiceItems.length; k++) {
                addEditItem(inv.invoiceItems[k]);
            }

            calcEditTotal();
            document.getElementById('editModalOverlay').classList.add('show');
        });
}

function addEditItem(item) {
    editItemCount++;
    var tbody = document.getElementById('editItemsBody');
    var row = document.createElement('tr');
    row.id = 'editItem_' + editItemCount;
    var sub   = item ? (price * qty).toFixed(2) : '0.00';

    var name = item ? item.productName : '';
    var price = item ? item.unitPrice : 0;
    var qty = item ? item.qty : 1;

    row.innerHTML =
        '<td><input type="text" id="editName_' + editItemCount + '" value="' + name + '" oninput="calcEditTotal()"></td>' +
        '<td><input type="number" id="editPrice_' + editItemCount + '" value="' + price + '" min="0" oninput="calcEditTotal()"></td>' +
        '<td><input type="number" id="editQty_' + editItemCount + '" value="' + qty + '" min="1" oninput="calcEditTotal()"></td>' +
        '<td><input type="text" id="editSub_' + editItemCount + '" readonly style="color:#43e97b"></td>' +
        '<td><button class="btn-remove" onclick="removeEditItem(' + editItemCount + ')">✕</button></td>';
    tbody.appendChild(row);
    calcEditTotal();
}

function removeEditItem(id) {
    document.getElementById('editItem_' + id).remove();
    calcEditTotal();
}

function calcEditTotal() {
    var subTotal = 0;
    for (var i = 1; i <= editItemCount; i++) {
        var row = document.getElementById('editItem_' + i);
        if (!row) continue;
        var price = parseFloat(document.getElementById('editPrice_' + i).value) || 0;
        var qty = parseInt(document.getElementById('editQty_' + i).value) || 0;
        var sub = price * qty;
        document.getElementById('editSub_' + i).value = 'Rs. ' + sub.toFixed(2);
        subTotal += sub;
    }
    var discount = parseFloat(document.getElementById('editDiscount').value) || 0;
    var paid = parseFloat(document.getElementById('editPaidAmount').value) || 0;
    var total = subTotal - discount;
    var balance = total - paid;

    document.getElementById('editSubTotal').textContent = 'Rs. ' + subTotal.toFixed(2);
    document.getElementById('editDiscountDisplay').textContent = 'Rs. ' + discount.toFixed(2);
    document.getElementById('editPaidDisplay').textContent = 'Rs. ' + paid.toFixed(2);
    document.getElementById('editTotalDisplay').textContent = 'Rs. ' + total.toFixed(2);

    var balEl = document.getElementById('editBalanceDisplay');
    balEl.textContent = 'Rs. ' + balance.toFixed(2);
    balEl.style.color = balance < 0 ? '#ff4757' : '#43e97b';
}

function saveEditInvoice() {
    var subTotal = 0;
    var items = [];
    for (var i = 1; i <= editItemCount; i++) {
        var row = document.getElementById('editItem_' + i);
        if (!row) continue;
        var name = document.getElementById('editName_' + i).value.trim();
        var price = parseFloat(document.getElementById('editPrice_' + i).value) || 0;
        var qty = parseInt(document.getElementById('editQty_' + i).value) || 0;
        if (name && price > 0 && qty > 0) {
            items.push({ productName: name, unitPrice: price, qty: qty });
            subTotal += price * qty;
        }
    }

    if (items.length === 0) {
        showAlert('Please add at least one valid item!', 'error');
        return;
    }

    var discount = parseFloat(document.getElementById('editDiscount').value) || 0;
    var paid = parseFloat(document.getElementById('editPaidAmount').value) || 0;
    var total = subTotal - discount;

    var payload = {
        id: parseInt(document.getElementById('editInvoiceId').value),
        customerId: parseInt(document.getElementById('editCustomerId').value),
        paymentMethodId: parseInt(document.getElementById('editPaymentMethodId').value),
        discount: discount,
        totalAmount: total,
        paidAmount: paid,
        invoiceItems: items
    };

    fetch('/api/invoice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(function(r) { return r.json(); })
        .then(function(result) {
            if (result.status) {
                showAlert('Invoice updated successfully!', 'success');
                closeEditModal();
                loadInvoices();
            } else {
                showAlert(result.message, 'error');
            }
        })
        .catch(function() {
            showAlert('Connection error. Please try again!', 'error');
        });
}

function closeEditModal() {
    document.getElementById('editModalOverlay').classList.remove('show');
    editItemCount = 0;
}

var editOverlay = document.getElementById('editModalOverlay');
if (editOverlay) {
    editOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
    });
}



loadInvoices();