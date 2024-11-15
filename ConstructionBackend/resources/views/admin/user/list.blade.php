@extends('admin.layout.master')
@section('title', 'Quản lý người dùng')
@section('content')

<style>
    #users-table th,
    #users-table td {
        text-align: center;
        vertical-align: middle;
    }

    #users-table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .btn {
        margin-right: 5px;
    }

    .pagination .page-item.active .page-link {
        background-color: #007bff;
        color: #ffffff;
    }
</style>

<div class="container mt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Quản lý người dùng</h2>
        <button class="btn btn-primary" onclick="showCreateUserModal()">
            <i class="fa-solid fa-plus"></i> Thêm người dùng
        </button>
    </div>

    <div class="input-group mb-3">
        <input type="text" id="searchInput" class="form-control" placeholder="Tìm kiếm người dùng theo tên hoặc ID...">
        <button class="btn btn-primary" onclick="searchUsers()">
            <i class="fas fa-search"></i>
        </button>
    </div>

    <table class="table table-bordered" id="users-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody id="users-body">
            <!-- Dữ liệu sẽ được hiển thị tại đây -->
        </tbody>
    </table>

    <nav>
        <ul class="pagination" id="pagination">
            <!-- Các nút phân trang sẽ được tạo động -->
        </ul>
    </nav>
</div>

<div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="userModalLabel">Sửa thông tin người dùng</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="userForm" enctype="multipart/form-data">
                    <input type="hidden" id="userId">
                    <div class="mb-3">
                        <label for="userName" class="form-label">Tên người dùng</label>
                        <input type="text" class="form-control" id="userName" required>
                    </div>
                    <div class="mb-3">
                        <label for="userBirth" class="form-label">Ngày sinh</label>
                        <input type="date" class="form-control" id="userBirth" required>
                    </div>
                    <div class="mb-3">
                        <label for="userPhone" class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" id="userPhone" required>
                    </div>
                    <div class="mb-3">
                        <label for="userEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="userEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="userRole" class="form-label">Vai trò</label>
                        <select class="form-control" id="userRole" required>
                            <option value="admin">Admin</option>
                            <option value="worker">Worker</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="userStatus" class="form-label">Trạng thái</label>
                        <select class="form-control" id="userStatus" required>
                            <option value="active">Active</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="userAvatar" class="form-label">Avatar</label>
                        <input type="file" class="form-control" id="userAvatar" accept="image/*">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveUser()">Lưu người dùng</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    let currentPage = 1;
    const apiUrl = "{{ config('app.api_url') }}"; // Địa chỉ API

    function loadUsers(page = 1, search = '') {
        currentPage = page;
        axios.get(`${apiUrl}/users?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                console.log(`${apiUrl}/users`)
                console.log(`Bearer ${localStorage.getItem('token')}`)
                let users = response.data.data;
                let tableBody = document.getElementById('users-body');
                tableBody.innerHTML = '';

                users.forEach(user => {
                    let row = `<tr>
                                <td>${user.user_id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td>${user.active_status}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.user_id})">
                                        <i class="fas fa-edit"></i> Sửa
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.user_id})">
                                        <i class="fas fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>`;
                    tableBody.innerHTML += row;
                });

                createPagination(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi lấy dữ liệu: ', error);
                if (error.response && error.response.status === 401) {
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
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
                loadUsers(page, document.getElementById('searchInput').value);
            };

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    function showCreateUserModal() {
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        var myModal = new bootstrap.Modal(document.getElementById('userModal'));
        myModal.show();
    }

    function saveUser() {
        let userId = document.getElementById('userId').value;
        let formData = new FormData();
        formData.append('name', document.getElementById('userName').value);
        formData.append('birth', document.getElementById('userBirth').value);
        formData.append('phone', document.getElementById('userPhone').value);
        formData.append('email', document.getElementById('userEmail').value);
        formData.append('role', document.getElementById('userRole').value);
        formData.append('active_status', document.getElementById('userStatus').value);
        formData.append('avatar', document.getElementById('userAvatar').files[0]);

        if (userId) {
            axios.put(`${apiUrl}/users/update/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    alert('Cập nhật thành công');
                    loadUsers(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
                    myModal.hide();
                })
                .catch(error => {
                    console.error('Có lỗi khi cập nhật người dùng: ', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        } else {
            axios.post(`${apiUrl}/users`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    alert('Thêm người dùng thành công');
                    loadUsers();
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
                    myModal.hide();
                })
                .catch(error => {
                    console.error('Có lỗi khi thêm người dùng: ', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        }
    }

    function editUser(id) {
        axios.get(`${apiUrl}/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                let user = response.data;
                document.getElementById('userId').value = user.user_id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userBirth').value = user.birth;
                document.getElementById('userPhone').value = user.phone;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userStatus').value = user.active_status;

                var myModal = new bootstrap.Modal(document.getElementById('userModal'));
                myModal.show();
            })
            .catch(error => {
                console.error('Có lỗi khi lấy dữ liệu người dùng: ', error);
                alert('Không thể lấy thông tin người dùng');
            });
    }

    function deleteUser(id) {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            axios.delete(`${apiUrl}/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    alert('Xóa người dùng thành công');
                    loadUsers(currentPage);
                })
                .catch(error => {
                    console.error('Có lỗi khi xóa người dùng: ', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        }
    }

    window.onload = function() {
        loadUsers();
    };
</script>

@endsection