<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice System</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="assets/css/index.css">
</head>
<body>

<nav class="navbar">
    <div class="logo">Invoice<span>System</span></div>
    <nav>
        <a href="index.jsp" class="active">Dashboard</a>
        <a href="customer.jsp">Customers</a>
        <a href="create-invoice.jsp">Create Invoice</a>
        <a href="view-invoice.jsp">View Invoices</a>
    </nav>
</nav>

<div class="hero">
    <h1>Welcome to <span>Invoice</span> System</h1>
</div>

<!-- Stats -->
<div class="stats">
    <div class="stat-card blue">
        <div class="stat-label">Total Customers</div>
        <div class="stat-value" id="customerCount">—</div>
    </div>
    <div class="stat-card pink">
        <div class="stat-label">Total Invoices</div>
        <div class="stat-value" id="invoiceCount">—</div>
    </div>
    <div class="stat-card green">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value" id="totalRevenue">—</div>
    </div>
</div>

<!-- Quick Access Cards -->
<div class="cards-section">
    <div class="section-title">Quick Access</div>
    <div class="cards">
        <a href="customer.jsp" class="card blue">
            <div>
                <h3>Customers</h3>
                <p>Add, edit, view and delete customers in the system.</p>
            </div>
            <div class="card-arrow">→</div>
        </a>
        <a href="create-invoice.jsp" class="card pink">
            <div>
                <h3>Create Invoice</h3>
                <p>Generate a new invoice for a customer with items.</p>
            </div>
            <div class="card-arrow">→</div>
        </a>
        <a href="view-invoice.jsp" class="card green">
            <div>
                <h3>View Invoices</h3>
                <p>Browse all invoices and manage existing records.</p>
            </div>
            <div class="card-arrow">→</div>
        </a>
    </div>
</div>

<!-- Recent Invoices -->
<div class="recent-section">
    <div class="recent-header">
        <div class="section-title" style="margin:0">Recent Invoices</div>
        <a href="view-invoice.jsp">View all →</a>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Balance</th>
            </tr>
            </thead>
            <tbody id="recentInvoices">
            <tr><td colspan="6" class="loading">Loading...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script src="assets/js/index.js"></script>

</body>
</html>