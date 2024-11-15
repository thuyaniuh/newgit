@extends('admin.layout.master')
@section('title','Danh sách nhà cung cấp')
@section('content')

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2 class="mb-0">Thông tin nhà cung cấp</h2>
    <div class="input-group" style="width: 300px;">
        <input type="text" id="searchInput" class="form-control" placeholder="Tìm kiếm nhà cung cấp...">
        <button class="btn btn-primary" onclick="searchSuppliers()">
            <i class="fas fa-search"></i>
        </button>
    </div>
</div>

<button class="btn btn-primary btn-sm mb-2" onclick="showCreateSupplierModal()">
    <i class="fa-solid fa-plus" style="color: #ffffff;"></i> Thêm nhà cung cấp
</button>

<div id="alertSuccess" class="alert alert-success d-none" role="alert">
    <strong>Thành công!</strong> Nhà cung cấp đã được xử lý thành công.
</div>

<!-- Modal để thêm và sửa nhà cung cấp -->
<div class="modal fade" id="supplierModal" tabindex="-1" aria-labelledby="supplierModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="supplierModalLabel">Thêm/Sửa Nhà Cung Cấp</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="supplierForm">
                    <input type="hidden" id="supplierId">
                    <div class="mb-3">
                        <label for="supplierName" class="form-label">Tên nhà cung cấp</label>
                        <input type="text" class="form-control" id="supplierName" required>
                    </div>
                    <div class="mb-3">
                        <label for="supplierAddress" class="form-label">Địa chỉ</label>
                        <input type="text" class="form-control" id="supplierAddress" required>
                    </div>
                    <div class="mb-3">
                        <label for="supplierPhone" class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" id="supplierPhone" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveSupplier()">Lưu nhà cung cấp</button>
            </div>
        </div>
    </div>
</div>

<table class="table table-bordered" id="suppliers-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Tên nhà cung cấp</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody id="suppliers-body">
        <!-- Dữ liệu sẽ được hiển thị tại đây -->
    </tbody>
</table>

<nav>
    <ul class="pagination" id="pagination">
        <!-- Nút phân trang sẽ được tạo động -->
    </ul>
</nav>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    let currentPage = 1;
    const apiUrl = "{{ config('app.api_url') }}"; // Địa chỉ API của backend

    function loadSuppliers(page = 1, search = '') {
        const token = localStorage.getItem('token');
        currentPage = page;

        if (!token) {
            alert('Vui lòng đăng nhập lại để tiếp tục.');
            window.location.href = '/login';
            return;
        }

        axios.get(`${apiUrl}/suppliers?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function(response) {
                let suppliers = response.data.data;
                let tableBody = document.getElementById('suppliers-body');
                tableBody.innerHTML = '';

                suppliers.forEach(supplier => {
                    let row = `
                    <tr>
                        <td>${supplier.supplier_id}</td>
                        <td>${supplier.supplier_name}</td>
                        <td>${supplier.address}</td>
                        <td>${supplier.phone}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editSupplier(${supplier.supplier_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.supplier_id})">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });

                createPagination(response.data);
            })
            .catch(function(error) {
                console.error('Có lỗi khi lấy dữ liệu:', error);
                if (error.response && error.response.status === 401) {
                    alert('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
                    window.location.href = '/login';
                } else {
                    alert('Đã xảy ra lỗi trong quá trình tải dữ liệu. Vui lòng thử lại sau.');
                }
            });
    }

    function createPagination(data) {
        let pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        for (let page = 1; page <= data.last_page; page++) {
            let li = document.createElement('li');
            li.classList.add('page-item');
            if (page === data.current_page) {
                li.classList.add('active');
            }

            let a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.innerText = page;
            a.onclick = function(e) {
                e.preventDefault();
                loadSuppliers(page, document.getElementById('searchInput').value);
            };

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    function showCreateSupplierModal() {
        document.getElementById('supplierForm').reset();
        document.getElementById('supplierId').value = '';
        var myModal = new bootstrap.Modal(document.getElementById('supplierModal'));
        myModal.show();
    }

    function saveSupplier() {
        const token = localStorage.getItem('token');
        let supplierId = document.getElementById('supplierId').value;
        let data = {
            supplier_name: document.getElementById('supplierName').value,
            address: document.getElementById('supplierAddress').value,
            phone: document.getElementById('supplierPhone').value
        };

        if (supplierId) {
            axios.put(`${apiUrl}/suppliers/update/${supplierId}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Cập nhật nhà cung cấp thành công');
                    loadSuppliers(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('supplierModal'));
                    myModal.hide();
                })
                .catch(function(error) {
                    console.error('Có lỗi khi cập nhật nhà cung cấp:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        } else {
            axios.post(`${apiUrl}/suppliers/store`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Thêm nhà cung cấp thành công');
                    loadSuppliers(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('supplierModal'));
                    myModal.hide();
                })
                .catch(function(error) {
                    console.error('Có lỗi khi thêm nhà cung cấp:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        }
    }

    function editSupplier(id) {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function(response) {
                let supplier = response.data;
                document.getElementById('supplierId').value = supplier.supplier_id;
                document.getElementById('supplierName').value = supplier.supplier_name;
                document.getElementById('supplierAddress').value = supplier.address;
                document.getElementById('supplierPhone').value = supplier.phone;

                var myModal = new bootstrap.Modal(document.getElementById('supplierModal'));
                myModal.show();
            })
            .catch(function(error) {
                console.error('Có lỗi khi lấy dữ liệu nhà cung cấp:', error);
                alert('Không thể lấy thông tin nhà cung cấp.');
            });
    }

    function deleteSupplier(id) {
        const token = localStorage.getItem('token');
        if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
            axios.delete(`${apiUrl}/suppliers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Xóa nhà cung cấp thành công');
                    loadSuppliers(currentPage);
                })
                .catch(function(error) {
                    console.error('Có lỗi khi xóa nhà cung cấp:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        }
    }

    function searchSuppliers() {
        let searchQuery = document.getElementById('searchInput').value;
        loadSuppliers(1, searchQuery);
    }

    window.onload = function() {
        loadSuppliers();
    };
</script>
@endsection