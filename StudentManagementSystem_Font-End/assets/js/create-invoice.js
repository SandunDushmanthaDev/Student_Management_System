var itemCount = 0;

fetch('/api/customer')
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.status) {
            var sel = document.getElementById('customerId');
            for (var i = 0; i < data.data.length; i++) {
                var opt = document.createElement('option');
                opt.value = data.data[i].id;
                opt.text = data.data[i].customerName;
                sel.appendChild(opt);
            }
        }
    });

fetch('/api/payment-method')
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.status) {
            var sel = document.getElementById('paymentMethodId');
            for (var i = 0; i < data.data.length; i++) {
                var opt = document.createElement('option');
                opt.value = data.data[i].id;
                opt.text = data.data[i].method;
                sel.appendChild(opt);
            }
        }
    });

function addItem() {
    itemCount++;
    var tbody = document.getElementById('itemsBody');
    var row = document.createElement('tr');
    row.id = 'item_' + itemCount;
    row.innerHTML =
        '<td><input type="text" id="name_' + itemCount + '" placeholder="Product name" oninput="calculateTotal()"></td>' +
        '<td><input type="number" id="price_' + itemCount + '" placeholder="0.00" min="0" value="0" oninput="calculateTotal()"></td>' +
        '<td><input type="number" class="qty-input" id="qty_' + itemCount + '" min="1" value="1" oninput="calculateTotal()"></td>' +
        '<td><input type="text" id="sub_' + itemCount + '" readonly style="color:var(--accent3)"></td>' +
        '<td><button class="btn-remove" onclick="removeItem(' + itemCount + ')">✕</button></td>';
    tbody.appendChild(row);
    calculateTotal();
}

function removeItem(id) {
    document.getElementById('item_' + id).remove();
    calculateTotal();
}

function calculateTotal() {
    var subTotal = 0;
    for (var i = 1; i <= itemCount; i++) {
        var row = document.getElementById('item_' + i);
        if (!row) continue;
        var price = parseFloat(document.getElementById('price_' + i).value) || 0;
        var qty = parseInt(document.getElementById('qty_' + i).value) || 0;
        var sub = price * qty;
        document.getElementById('sub_' + i).value = 'Rs. ' + sub.toFixed(2);
        subTotal += sub;
    }
    var discount = parseFloat(document.getElementById('discount').value) || 0;
    var paid = parseFloat(document.getElementById('paidAmount').value) || 0;
    var total = subTotal - discount;
    var balance = total - paid;

    document.getElementById('subTotalDisplay').textContent = 'Rs. ' + subTotal.toFixed(2);
    document.getElementById('discountDisplay').textContent = 'Rs. ' + discount.toFixed(2);
    document.getElementById('totalDisplay').textContent = 'Rs. ' + total.toFixed(2);
    document.getElementById('paidDisplay').textContent = 'Rs. ' + paid.toFixed(2);

    var balEl = document.getElementById('balanceDisplay');
    balEl.textContent = 'Rs. ' + balance.toFixed(2);
    balEl.style.color = balance < 0 ? 'var(--danger)' : 'var(--accent3)';
}

function clearErrors() {
    document.getElementById('customerError').style.display = 'none';
    document.getElementById('paymentError').style.display = 'none';
    document.getElementById('paidError').style.display = 'none';
    document.getElementById('itemsError').style.display = 'none';
    document.getElementById('nameError').style.display = 'none';
    document.getElementById('priceError').style.display = 'none';
}

function validate() {
    clearErrors();
    var valid = true;


    if (!document.getElementById('customerId').value) {
        document.getElementById('customerError').style.display = 'block';
        valid = false;
    }


    if (!document.getElementById('paymentMethodId').value) {
        document.getElementById('paymentError').style.display = 'block';
        valid = false;
    }


    var paidVal = document.getElementById('paidAmount').value.trim();
    var paid = parseFloat(paidVal);
    if (paidVal === '' || isNaN(paid) || paid <= 0) {
        document.getElementById('paidError').style.display = 'block';
        valid = false;
    }


    var hasItem = false;
    for (var i = 1; i <= itemCount; i++) {
        var row = document.getElementById('item_' + i);
        if (!row) continue;

        var nameVal = document.getElementById('name_' + i).value.trim();
        var priceVal = document.getElementById('price_' + i).value.trim();
        var price = parseFloat(priceVal);

        if (nameVal === '') {
            document.getElementById('nameError').style.display = 'block';
            valid = false;
            return valid;
        }

        if (priceVal === '' || isNaN(price) || price <= 0) {
            document.getElementById('priceError').style.display = 'block';
            valid = false;
            return valid;
        }

        hasItem = true;
    }

    if (!hasItem) {
        document.getElementById('itemsError').style.display = 'block';
        valid = false;
    }

    return valid;
}

function getItems() {
    var items = [];
    for (var i = 1; i <= itemCount; i++) {
        var row = document.getElementById('item_' + i);
        if (!row) continue;
        var name = document.getElementById('name_' + i).value.trim();
        var price = parseFloat(document.getElementById('price_' + i).value) || 0;
        var qty = parseInt(document.getElementById('qty_' + i).value) || 0;
        if (name && price > 0 && qty > 0) {
            items.push({ productName: name, unitPrice: price, qty: qty });
        }
    }
    return items;
}

function showAlert(message, type) {
    var el = document.getElementById('alertBox');
    el.textContent = message;
    el.className = 'alert ' + type;
    el.style.display = 'block';
    window.scrollTo(0, 0);
    setTimeout(function() { el.style.display = 'none'; }, 5000);
}

function saveInvoice() {
    if (!validate()) return;

    var total = parseFloat(document.getElementById('totalDisplay').textContent.replace('Rs. ', ''));
    var payload = {
        customerId: parseInt(document.getElementById('customerId').value),
        paymentMethodId: parseInt(document.getElementById('paymentMethodId').value),
        discount: parseFloat(document.getElementById('discount').value) || 0,
        totalAmount: total,
        paidAmount: parseFloat(document.getElementById('paidAmount').value) || 0,
        invoiceItems: getItems()
    };

    fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(function(r) { return r.json(); })
        .then(function(result) {
            if (result.status) {
                showAlert('Invoice saved successfully!', 'success');
                resetForm();
            } else {
                showAlert(result.message, 'error');
            }
        })
        .catch(function() {
            showAlert('Connection error. Please try again!', 'error');
        });
}

function resetForm() {
    clearErrors();
    document.getElementById('customerId').value = '';
    document.getElementById('paymentMethodId').value = '';
    document.getElementById('discount').value = '0';
    document.getElementById('paidAmount').value = '0';
    document.getElementById('itemsBody').innerHTML = '';
    itemCount = 0;
    calculateTotal();
    addItem();
}

addItem();