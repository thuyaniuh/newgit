@extends('admin.layout.master')
@section('title', 'Quản lý mua hàng')
@section('content')

<!-- Thông báo thành công -->
<div id="alertSuccess" class="alert alert-success d-none" role="alert">
    <strong>Thành công!</strong> Giao dịch đã được xử lý thành công.
</div>

<h2>Quản lý mua hàng</h2>

<!-- Nút mở modal thêm giao dịch -->
<button class="btn btn-primary btn-sm mb-2" data-bs-toggle="modal" data-bs-target="#purchaseModal">
    <i class="fa-solid fa-plus" style="color: #ffffff;"></i> Thêm mua hàng
</button>

<!-- Modal thêm/sửa giao dịch -->
<div class="modal fade" id="purchaseModal" tabindex="-1" aria-labelledby="purchaseModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="purchaseModalLabel">Thêm/Sửa Giao Dịch Mua Hàng</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="purchaseForm">
                    <input type="hidden" id="purchaseId">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="projectName" class="form-label">Dự án</label>
                                <select class="form-select" id="projectName" required></select>
                            </div>
                            <div class="mb-3">
                                <label for="supplierName" class="form-label">Nhà cung cấp</label>
                                <select class="form-select" id="supplierName" required></select>
                            </div>
                            <div class="mb-3">
                                <label for="userName" class="form-label">Người dùng</label>
                                <select class="form-select" id="userName" required></select>
                            </div>
                            <div class="mb-3">
                                <label for="purchaseDate" class="form-label">Ngày mua</label>
                                <input type="date" class="form-control" id="purchaseDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="additionalCost" class="form-label">Chi phí phát sinh</label>
                                <input type="number" class="form-control" id="additionalCost" placeholder="Nhập chi phí phát sinh (nếu có)">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="materialsList" class="form-label">Danh sách vật tư</label>
                                <div id="materialsList">
                                    <div class="input-group mb-2">
                                        <select class="form-select" id="materialSelect"></select>
                                        <input type="number" class="form-control" placeholder="Số lượng" id="materialQuantity">
                                        <input type="number" class="form-control" placeholder="Giá" id="materialPrice">
                                        <button type="button" class="btn btn-primary" onclick="addMaterial()">Thêm</button>
                                    </div>
                                </div>
                                <ul id="selectedMaterials" class="list-group"></ul>
                            </div>
                            <div class="mb-3">
                                <label for="purchaseImages" class="form-label">Ảnh hóa đơn</label>
                                <input type="file" class="form-control" id="purchaseImages" multiple accept="image/*">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="savePurchase()">Lưu giao dịch</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal xem chi tiết giao dịch -->
<div class="modal fade" id="purchaseDetailModal" tabindex="-1" aria-labelledby="purchaseDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="purchaseDetailModalLabel">Chi tiết giao dịch mua</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="purchaseDetailContent"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>

<!-- Bảng danh sách mua hàng -->
<table class="table table-bordered" id="purchases-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Dự án</th>
            <th>Nhà cung cấp</th>
            <th>Người dùng</th>
            <th>Ngày mua</th>
            <th>Tổng giá</th>
            <th>Mặt hàng đã mua</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody id="purchases-body"></tbody>
</table>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    const apiUrl = "{{ config('app.api_url') }}";
    document.addEventListener('DOMContentLoaded', function() {
        loadDropdownOptions();
        loadPurchases();

        function loadDropdownOptions() {
            axios.get(`${apiUrl}/projects`).then(response => {
                let projectSelect = document.getElementById('projectName');
                projectSelect.innerHTML = '<option value="">Chọn dự án</option>';
                response.data.forEach(project => {
                    projectSelect.innerHTML += `<option value="${project.project_id}">${project.name}</option>`;
                });
            });

            axios.get(`${apiUrl}/suppliers`).then(response => {
                let supplierSelect = document.getElementById('supplierName');
                supplierSelect.innerHTML = '<option value="">Chọn nhà cung cấp</option>';
                response.data.forEach(supplier => {
                    supplierSelect.innerHTML += `<option value="${supplier.supplier_id}">${supplier.supplier_name}</option>`;
                });
            });

            axios.get(`${apiUrl}/users`).then(response => {
                let userSelect = document.getElementById('userName');
                userSelect.innerHTML = '<option value="">Chọn người dùng</option>';
                response.data.forEach(user => {
                    userSelect.innerHTML += `<option value="${user.user_id}">${user.name}</option>`;
                });
            });

            axios.get(`${apiUrl}/materials`).then(response => {
                let materialSelect = document.getElementById('materialSelect');
                materialSelect.innerHTML = '<option value="">Chọn vật tư</option>';
                response.data.forEach(material => {
                    materialSelect.innerHTML += `<option value="${material.material_id}">${material.material_name} (${material.unit})</option>`;
                });
            });
        }

        function loadPurchases(query = '') {
            axios.get(`${apiUrl}/purchases?query=${query}`).then(response => {
                let purchases = response.data;
                let tableBody = document.getElementById('purchases-body');
                tableBody.innerHTML = '';

                purchases.forEach(purchase => {
                    let materialsList = purchase.materials.map(material => {
                        let materialName = material.material ? material.material.material_name : 'N/A';
                        let unit = material.material ? material.material.unit : 'N/A';
                        return `<li>${materialName} - ${material.quantity} ${unit} x ${parseFloat(material.price).toLocaleString()} đ</li>`;
                    }).join('');

                    let row = `
                        <tr>
                            <td><a href="#" onclick="showPurchaseDetail(${purchase.purchase_id})">${purchase.purchase_id}</a></td>
                            <td>${purchase.project ? purchase.project.name : 'N/A'}</td>
                            <td>${purchase.supplier ? purchase.supplier.supplier_name : 'N/A'}</td>
                            <td>${purchase.user ? purchase.user.name : 'N/A'}</td>
                            <td>${purchase.date}</td>
                            <td>${parseFloat(purchase.total_price).toLocaleString()} đ</td>
                            <td><ul>${materialsList}</ul></td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editPurchase(${purchase.purchase_id})"><i class="fas fa-edit"></i> Sửa</button>
                                <button class="btn btn-danger btn-sm" onclick="deletePurchase(${purchase.purchase_id})"><i class="fas fa-trash"></i> Xóa</button>
                            </td>
                        </tr>`;
                    tableBody.innerHTML += row;
                });
            }).catch(error => {
                console.error('Có lỗi khi lấy dữ liệu:', error);
                alert('Đã xảy ra lỗi trong quá trình tải dữ liệu. Vui lòng thử lại sau.');
            });
        }

        window.showPurchaseDetail = function(id) {
            axios.get(`${apiUrl}/purchases/${id}`).then(response => {
                let purchase = response.data;
                let materialsList = purchase.materials.map(material => {
                    let materialName = material.material ? material.material.material_name : 'N/A';
                    let unit = material.material ? material.material.unit : 'N/A';
                    return `<li>${materialName} - ${material.quantity} ${unit} x ${parseFloat(material.price).toLocaleString()} đ</li>`;
                }).join('');

                let imagesList = purchase.images.map(image => {
                    return `<img src="/storage/${image.image_path}" class="img-fluid m-2" style="max-width: 500px; max-height: 500px;">`;
                }).join('');

                let detailHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID:</strong> ${purchase.purchase_id}</p>
                            <p><strong>Dự án:</strong> ${purchase.project ? purchase.project.name : 'N/A'}</p>
                            <p><strong>Nhà cung cấp:</strong> ${purchase.supplier ? purchase.supplier.supplier_name : 'N/A'}</p>
                            <p><strong>Người dùng:</strong> ${purchase.user ? purchase.user.name : 'N/A'}</p>
                            <p><strong>Ngày mua:</strong> ${purchase.date}</p>
                            <p><strong>Tổng giá:</strong> ${parseFloat(purchase.total_price).toLocaleString()} đ</p>
                            <p><strong>Chi phí phát sinh:</strong> ${purchase.additional_cost ? parseFloat(purchase.additional_cost).toLocaleString() + ' đ' : 'Không'}</p>
                            <p><strong>Mặt hàng đã mua:</strong></p>
                            <ul>${materialsList}</ul>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <div>${imagesList || '<p>Không có hình ảnh</p>'}</div>
                        </div>
                    </div>`;

                document.getElementById('purchaseDetailContent').innerHTML = detailHtml;
                var myModal = new bootstrap.Modal(document.getElementById('purchaseDetailModal'));
                myModal.show();
            }).catch(error => {
                console.error('Có lỗi khi lấy chi tiết giao dịch:', error);
                alert('Đã xảy ra lỗi khi lấy chi tiết giao dịch. Vui lòng thử lại.');
            });
        };

        window.editPurchase = function(id) {
            axios.get(`${apiUrl}/purchases/${id}`).then(response => {
                let purchase = response.data;
                document.getElementById('purchaseId').value = purchase.purchase_id;
                document.getElementById('projectName').value = purchase.project ? purchase.project.project_id : '';
                document.getElementById('supplierName').value = purchase.supplier ? purchase.supplier.supplier_id : '';
                document.getElementById('userName').value = purchase.user ? purchase.user.user_id : '';
                document.getElementById('purchaseDate').value = purchase.date;
                document.getElementById('additionalCost').value = purchase.additional_cost || 0;

                // Cập nhật danh sách vật tư đã chọn
                materialsArray = purchase.materials.map(material => ({
                    material_id: material.material.material_id,
                    quantity: material.quantity,
                    price: material.price
                }));

                let selectedMaterials = document.getElementById('selectedMaterials');
                selectedMaterials.innerHTML = '';
                materialsArray.forEach(material => {
                    let materialName = material.material_id;
                    let li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `${materialName} - ${material.quantity} x ${parseFloat(material.price).toLocaleString()} đ`;
                    selectedMaterials.appendChild(li);
                });

                var myModal = new bootstrap.Modal(document.getElementById('purchaseModal'));
                myModal.show();
            }).catch(error => {
                console.error('Có lỗi khi lấy dữ liệu giao dịch:', error);
                alert('Không thể lấy thông tin giao dịch.');
            });
        };

        window.deletePurchase = function(id) {
            if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
                axios.delete(`${apiUrl}/purchases/${id}`).then(response => {
                    alert('Xóa giao dịch thành công!');
                    loadPurchases();
                }).catch(error => {
                    console.error('Có lỗi khi xóa giao dịch:', error);
                    alert('Đã xảy ra lỗi khi xóa. Vui lòng thử lại.');
                });
            }
        };

        let materialsArray = [];
        window.addMaterial = function() {
            let materialSelect = document.getElementById('materialSelect');
            let materialQuantity = document.getElementById('materialQuantity').value;
            let materialPrice = document.getElementById('materialPrice').value;

            if (materialSelect.value && materialQuantity && materialPrice) {
                materialsArray.push({
                    material_id: materialSelect.value,
                    quantity: materialQuantity,
                    price: materialPrice
                });

                let selectedMaterials = document.getElementById('selectedMaterials');
                let li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${materialSelect.options[materialSelect.selectedIndex].text} - ${materialQuantity} x ${parseFloat(materialPrice).toLocaleString()} đ`;
                selectedMaterials.appendChild(li);

                document.getElementById('materialQuantity').value = '';
                document.getElementById('materialPrice').value = '';
            } else {
                alert('Vui lòng nhập đầy đủ thông tin vật tư.');
            }
        };

        window.savePurchase = function() {
            let purchaseId = document.getElementById('purchaseId').value;
            let formData = new FormData();
            formData.append('project_id', document.getElementById('projectName').value);
            formData.append('supplier_id', document.getElementById('supplierName').value);
            formData.append('user_id', document.getElementById('userName').value);
            formData.append('date', document.getElementById('purchaseDate').value);
            formData.append('additional_cost', document.getElementById('additionalCost').value || 0);

            materialsArray.forEach((material, index) => {
                formData.append(`materials[${index}][material_id]`, material.material_id);
                formData.append(`materials[${index}][quantity]`, material.quantity);
                formData.append(`materials[${index}][price]`, material.price);
            });

            let images = document.getElementById('purchaseImages').files;
            for (let i = 0; i < images.length; i++) {
                formData.append('images[]', images[i]);
            }

            let url = purchaseId ? `${apiUrl}/purchases/update/${purchaseId}` : `${apiUrl}/purchases/store`;
            let method = purchaseId ? 'put' : 'post';

            axios({
                method,
                url,
                data: formData
            }).then(response => {
                alert(purchaseId ? 'Cập nhật giao dịch thành công!' : 'Thêm giao dịch thành công!');
                location.reload();
            }).catch(error => {
                console.error('Có lỗi khi xử lý giao dịch:', error);
                alert('Đã xảy ra lỗi. Vui lòng thử lại.');
            });
        };
    });
</script>
@endsection