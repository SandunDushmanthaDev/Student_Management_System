fetch('/api/customer')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.status) {
            document.getElementById('customerCount').textContent = data.data.length;
        }
    });

fetch('/api/invoice')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.status) {
            var invoices = data.data;
            document.getElementById('invoiceCount').textContent = invoices.length;

            var total = 0;
            for (var i = 0; i < invoices.length; i++) {
                total += invoices[i].totalAmount;
            }
            document.getElementById('totalRevenue').textContent = 'Rs. ' + total.toLocaleString();


            var recent = invoices.slice(-3).reverse();
            var tbody = document.getElementById('recentInvoices');

            if (recent.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="loading">No invoices found</td></tr>';
                return;
            }

            var html = '';
            for (var j = 0; j < recent.length; j++) {
                var inv = recent[j];
                var date = inv.invoiceDate ? inv.invoiceDate.substring(0, 10) : 'N/A';
                var badgeClass = inv.paymentMethod ? inv.paymentMethod.toLowerCase() : '';
                html += '<tr>';
                html += '<td>' + inv.id + '</td>';
                html += '<td>' + inv.customerName + '</td>';
                html += '<td>' + date + '</td>';
                html += '<td>Rs. ' + inv.totalAmount.toLocaleString() + '</td>';
                html += '<td><span class="badge ' + badgeClass + '">' + inv.paymentMethod + '</span></td>';
                html += '<td>Rs. ' + inv.balanceAmount.toLocaleString() + '</td>';
                html += '</tr>';
            }
            tbody.innerHTML = html;
        }
    })
    .catch(function() {
        document.getElementById('recentInvoices').innerHTML =
            '<tr><td colspan="6" class="loading">Failed to load invoices</td></tr>';
    });