<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Invoices | Invoice System</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="assets/css/view-invoice.css">
</head>
<body>

<nav class="navbar">
    <div class="logo">Invoice<span>System</span></div>
    <nav>
        <a href="index.jsp">Dashboard</a>
        <a href="customer.jsp">Customers</a>
        <a href="create-invoice.jsp">Create Invoice</a>
        <a href="view-invoice.jsp" class="active">View Invoices</a>
    </nav>
</nav>

<div class="container">
    <div class="page-header">
        <h1>View <span>Invoices</span></h1>
        <a href="create-invoice.jsp" class="btn btn-primary">+ Create Invoice</a>
    </div>

    <div class="alert" id="alertBox"></div>

    <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search by invoice number or customer name..." oninput="filterInvoices()">
        <span class="search-count" id="searchCount"></span>
    </div>

    <div class="table-wrap">
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Payment</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody id="invoiceTable">
            <tr><td colspan="8" class="loading">Loading...</td></tr>
            </tbody>
        </table>
    </div>
</div>


<div class="modal-overlay" id="modalOverlay">
    <div class="modal">
        <div class="modal-header">
            <h2>Invoice <span id="modalInvoiceId"></span></h2>
            <div class="modal-header-actions">

                <button class="btn btn-pdf btn-sm" onclick="downloadPDF()">⬇ Download PDF</button>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <label>Customer</label>
                <span id="modalCustomer"></span>
            </div>
            <div class="info-item">
                <label>Payment Method</label>
                <span id="modalPayment"></span>
            </div>
            <div class="info-item">
                <label>Invoice Date</label>
                <span id="modalDate"></span>
            </div>
            <div class="info-item">
                <label>Discount</label>
                <span id="modalDiscount"></span>
            </div>
        </div>

        <table class="items-table">
            <thead>
            <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Sub Total</th>
            </tr>
            </thead>
            <tbody id="modalItems"></tbody>
        </table>

        <div class="modal-summary">
            <div class="modal-summary-row total-row">
                <span class="lbl">Total Amount</span>
                <span id="modalTotal"></span>
            </div>
            <div class="modal-summary-row">
                <span class="lbl">Paid Amount</span>
                <span id="modalPaid"></span>
            </div>
            <div class="modal-summary-row">
                <span class="lbl">Balance</span>
                <span id="modalBalance"></span>
            </div>
        </div>
    </div>
</div>

<div class="modal-overlay" id="editModalOverlay">
    <div class="modal" style="width:720px;">
        <div class="modal-header">
            <h2>Edit <span id="editInvoiceTitle"></span></h2>
            <button class="modal-close" onclick="closeEditModal()">&#x2715;</button>
        </div>

        <input type="hidden" id="editInvoiceId">

        <div class="edit-section-label">Invoice Details</div>
        <div class="edit-form-row">
            <div class="edit-form-group">
                <label>Customer</label>
                <select id="editCustomerId"></select>
            </div>
            <div class="edit-form-group">
                <label>Payment Method</label>
                <select id="editPaymentMethodId"></select>
            </div>
        </div>
        <div class="edit-form-row" style="margin-bottom:24px;">
            <div class="edit-form-group">
                <label>Discount (Rs.)</label>
                <input type="number" id="editDiscount" min="0" value="0" oninput="calcEditTotal()">
            </div>
            <div class="edit-form-group">
                <label>Paid Amount (Rs.)</label>
                <input type="number" id="editPaidAmount" min="0" value="0" oninput="calcEditTotal()">
            </div>
        </div>

        <div class="edit-items-header">
            <div class="edit-section-label" style="margin:0; border:none; padding:0;">Invoice Items</div>
            <button class="btn btn-add btn-sm" onclick="addEditItem()">+ Add Item</button>
        </div>
        <table class="edit-items-table">
            <thead>
            <tr>
                <th style="width:40%">Product Name</th>
                <th style="width:22%">Unit Price (Rs.)</th>
                <th style="width:15%">Qty</th>
                <th style="width:18%">Sub Total</th>
                <th style="width:5%"></th>
            </tr>
            </thead>
            <tbody id="editItemsBody"></tbody>
        </table>

        <div class="edit-summary-box">
            <div class="edit-summary-row">
                <span class="lbl">Sub Total</span>
                <span class="val" id="editSubTotal">Rs. 0.00</span>
            </div>
            <div class="edit-summary-row">
                <span class="lbl">Discount</span>
                <span class="val" id="editDiscountDisplay">Rs. 0.00</span>
            </div>
            <div class="edit-summary-row">
                <span class="lbl">Paid Amount</span>
                <span class="val" id="editPaidDisplay">Rs. 0.00</span>
            </div>
            <div class="edit-summary-row edit-total-row">
                <span class="lbl">Total Amount</span>
                <span class="val" id="editTotalDisplay">Rs. 0.00</span>
            </div>
            <div class="edit-summary-row">
                <span class="lbl">Balance</span>
                <span class="val" id="editBalanceDisplay">Rs. 0.00</span>
            </div>
        </div>

        <div class="edit-modal-actions">
            <button class="btn btn-primary" onclick="closeEditModal()">Cancel</button>
            <button class="btn btn-success" onclick="saveEditInvoice()">Save Changes</button>
        </div>
    </div>
</div>



<script src="assets/js/view-invoice.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</body>
</html>