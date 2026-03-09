<%--
  Created by IntelliJ IDEA.
  User: sandu
  Date: 2/21/2026
  Time: 10:59 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customers | Invoice System</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="assets/css/customer.css"/>
</head>
<body>

<nav class="navbar">
    <div class="logo">Invoice<span>System</span></div>
    <nav>
        <a href="index.jsp">Dashboard</a>
        <a href="customer.jsp" class="active">Customers</a>
        <a href="create-invoice.jsp">Create Invoice</a>
        <a href="view-invoice.jsp">View Invoices</a>
    </nav>
</nav>

<div class="container">
    <div class="page-header">
        <h1>Manage <span>Customers</span></h1>
        <button class="btn btn-primary" onclick="openAddModal()">+ Add Customer</button>
    </div>

    <div class="alert" id="alert"></div>

    <div class="table-wrap">
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody id="customerTable">
            <tr><td colspan="6" class="loading">Loading...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Add/Edit Modal -->
<div class="modal-overlay" id="modalOverlay">
    <div class="modal">
        <h2 id="modalTitle">Add <span>Customer</span></h2>
        <input type="hidden" id="customerId">

        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="customerName" placeholder="Nimal Perera">
            <div class="error" id="nameError">Please enter a valid name!</div>
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" id="customerEmail" placeholder="nimal@gmail.com">
            <div class="error" id="emailError">Please enter a valid email!</div>
        </div>
        <div class="form-group">
            <label>Mobile</label>
            <input type="text" id="customerMobile" placeholder="0771234567">
            <div class="error" id="mobileError">Please enter a valid mobile number!</div>
        </div>
        <div class="form-group">
            <label>Address</label>
            <input type="text" id="customerAddress" placeholder="25 Galle Road, Colombo">
            <div class="error" id="addressError">Please enter a valid address!</div>
        </div>

        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveCustomer()">Save Customer</button>
        </div>
    </div>
</div>

<script src="assets/js/customer.js"></script>

</body>
</html>
