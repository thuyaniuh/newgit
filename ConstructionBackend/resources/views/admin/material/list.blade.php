@extends('admin.layout.master')
@section('title','Danh sách vật tư')
@section('content')

<div class="d-flex justify-content-between align-items-center mb-3">
    <h2 class="mb-0">Thông tin vật tư</h2>
    <div class="input-group" style="width: 300px;">
        <input type="text" id="searchInput" class="form-control" placeholder="Tìm kiếm vật tư...">
        <button class="btn btn-primary" onclick="searchMaterials()">
            <i class="fas fa-search"></i>
        </button>
    </div>
</div>

<button class="btn btn-primary btn-sm mb-2" onclick="showCreateMaterialModal()">
    <i class="fa-solid fa-plus" style="color: #ffffff;"></i> Thêm vật tư
</button>

<div id="alertSuccess" class="alert alert-success d-none" role="alert">
    <strong>Thành công!</strong> Vật tư đã được xử lý thành công.
</div>

<!-- Modal để thêm và sửa vật tư -->
<div class="modal fade" id="materialModal" tabindex="-1" aria-labelledby="materialModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="materialModalLabel">Thêm/Sửa Vật tư</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="materialForm">
                    <input type="hidden" id="materialId">
                    <div class="mb-3">
                        <label for="materialName" class="form-label">Tên vật tư</label>
                        <input type="text" class="form-control" id="materialName" required>
                    </div>
                    <div class="mb-3">
                        <label for="materialPrice" class="form-label">Giá tham chiếu</label>
                        <input type="number" class="form-control" id="materialPrice" required>
                    </div>
                    <div class="mb-3">
                        <label for="materialUnit" class="form-label">Đơn vị</label>
                        <input type="text" class="form-control" id="materialUnit" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveMaterial()">Lưu vật tư</button>
            </div>
        </div>
    </div>
</div>

<table class="table table-bordered" id="materials-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Tên vật tư</th>
            <th>Giá tham chiếu</th>
            <th>Đơn vị</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody id="materials-body">
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

    function loadMaterials(page = 1, search = '') {
        const token = localStorage.getItem('token');
        currentPage = page;

        if (!token) {
            alert('Vui lòng đăng nhập lại để tiếp tục.');
            window.location.href = '/login';
            return;
        }

        axios.get(`${apiUrl}/materials?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function(response) {
                let materials = response.data.data;
                let tableBody = document.getElementById('materials-body');
                tableBody.innerHTML = '';

                materials.forEach(material => {
                    let row = `
                    <tr>
                        <td>${material.material_id}</td>
                        <td>${material.material_name}</td>
                        <td>${parseFloat(material.price).toLocaleString()}</td>
                        <td>${material.unit}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editMaterial(${material.material_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteMaterial(${material.material_id})">
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
                loadMaterials(page, document.getElementById('searchInput').value);
            };

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    function showCreateMaterialModal() {
        document.getElementById('materialForm').reset();
        document.getElementById('materialId').value = '';
        var myModal = new bootstrap.Modal(document.getElementById('materialModal'));
        myModal.show();
    }

    function saveMaterial() {
        const token = localStorage.getItem('token');
        let materialId = document.getElementById('materialId').value;
        let data = {
            material_name: document.getElementById('materialName').value,
            price: document.getElementById('materialPrice').value,
            unit: document.getElementById('materialUnit').value
        };

        if (materialId) {
            axios.put(`${apiUrl}/materials/update/${materialId}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Cập nhật vật tư thành công');
                    loadMaterials(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('materialModal'));
                    myModal.hide();
                })
                .catch(function(error) {
                    console.error('Có lỗi khi cập nhật vật tư:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        } else {
            axios.post(`${apiUrl}/materials/store`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Thêm vật tư thành công');
                    loadMaterials(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('materialModal'));
                    myModal.hide();
                })
                .catch(function(error) {
                    console.error('Có lỗi khi thêm vật tư:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        }
    }

    function editMaterial(id) {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/materials/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function(response) {
                let material = response.data;
                document.getElementById('materialId').value = material.material_id;
                document.getElementById('materialName').value = material.material_name;
                document.getElementById('materialPrice').value = material.price;
                document.getElementById('materialUnit').value = material.unit;

                var myModal = new bootstrap.Modal(document.getElementById('materialModal'));
                myModal.show();
            })
            .catch(function(error) {
                console.error('Có lỗi khi lấy dữ liệu vật tư:', error);
                alert('Không thể lấy thông tin vật tư.');
            });
    }

    function deleteMaterial(id) {
        const token = localStorage.getItem('token');
        if (confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
            axios.delete(`${apiUrl}/materials/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    alert('Xóa vật tư thành công');
                    loadMaterials(currentPage);
                })
                .catch(function(error) {
                    console.error('Có lỗi khi xóa vật tư:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                });
        }
    }

    function searchMaterials() {
        let searchQuery = document.getElementById('searchInput').value;
        loadMaterials(1, searchQuery);
    }

    window.onload = function() {
        loadMaterials();
    };
</script>

@endsection