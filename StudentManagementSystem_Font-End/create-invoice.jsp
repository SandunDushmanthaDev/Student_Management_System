<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Invoice | Invoice System</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="assets/css/create-invoice.css">
</head>
<body>

<nav class="navbar">
    <div class="logo">Invoice<span>System</span></div>
    <nav>
        <a href="index.jsp">Dashboard</a>
        <a href="customer.jsp">Customers</a>
        <a href="create-invoice.jsp" class="active">Create Invoice</a>
        <a href="view-invoice.jsp">View Invoices</a>
    </nav>
</nav>

<div class="container">
    <div class="page-header">
        <h1>Create <span>Invoice</span></h1>
    </div>

    <div class="alert" id="alertBox"></div>

    <div class="card">
        <div class="card-title">Invoice Details</div>
        <div class="form-row">
            <div class="form-group">
                <label>Customer *</label>
                <select id="customerId">
                    <option value="">Select Customer</option>
                </select>
                <div class="field-error" id="customerError">⚠ Please select a customer!</div>
            </div>
            <div class="form-group">
                <label>Payment Method *</label>
                <select id="paymentMethodId">
                    <option value="">Select Payment Method</option>
                </select>
                <div class="field-error" id="paymentError">⚠ Please select a payment method!</div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Discount (Rs.)</label>
                <input type="number" id="discount" placeholder="0.00" min="0" value="0" oninput="calculateTotal()">
            </div>
            <div class="form-group">
                <label>Paid Amount (Rs.) *</label>
                <input type="number" id="paidAmount" placeholder="0.00" min="0" value="0" oninput="calculateTotal()">
                <div class="field-error" id="paidError">⚠ Paid Amount cannot be empty or zero!</div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="items-header">
            <div class="card-title" style="margin:0">Invoice Items *</div>
            <button class="btn btn-add" onclick="addItem()">+ Add Item</button>
        </div>
        <!-- ✅ Item errors — title සහ table අතර -->
        <div class="inline-error" id="itemsError">⚠ Please add at least one valid item!</div>
        <div class="inline-error" id="nameError">⚠ Product Name cannot be empty!</div>
        <div class="inline-error" id="priceError">⚠ Unit Price cannot be empty or zero!</div>
        <table class="items-table">
            <thead>
            <tr>
                <th>Product Name</th>
                <th>Unit Price (Rs.)</th>
                <th>Qty</th>
                <th>Sub Total</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="itemsBody"></tbody>
        </table>
    </div>

    <div class="card">
        <div class="card-title">Summary</div>
        <div class="summary">
            <div class="summary-row">
                <div class="label">Sub Total</div>
                <div class="value" id="subTotalDisplay">Rs. 0.00</div>
            </div>
            <div class="summary-row">
                <div class="label">Discount</div>
                <div class="value" id="discountDisplay">Rs. 0.00</div>
            </div>
            <div style="display:none" id="totalDisplay">Rs. 0.00</div>
            <div class="summary-row paid">
                <div class="label">Paid Amount</div>
                <div class="value" id="paidDisplay">Rs. 0.00</div>
            </div>
            <div class="summary-row">
                <div class="label">Balance</div>
                <div class="value" id="balanceDisplay">Rs. 0.00</div>
            </div>
        </div>
        <div class="form-actions">
            <button class="btn btn-primary" onclick="resetForm()">Reset</button>
            <button class="btn btn-success" onclick="saveInvoice()">Save Invoice</button>
        </div>
    </div>
</div>

<script src="assets/js/create-invoice.js"></script>
</body>
</html>