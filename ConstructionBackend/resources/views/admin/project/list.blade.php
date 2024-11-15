@extends('admin.layout.master')
@section('title', 'Quản lý dự án')
@section('content')

<style>
    .project-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: flex-start;
    }

    .project-card {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        width: calc(33% - 15px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .project-card h5 {
        margin-bottom: 10px;
        font-size: 1.1rem;
    }

    .project-info p {
        margin: 5px 0;
        font-size: 0.9rem;
    }

    .project-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .btn {
        font-size: 0.85rem;
        padding: 5px 10px;
    }

    .project-section-title {
        width: 100%;
        margin: 15px 0;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .pagination {
        margin-top: 20px;
    }

    @media (max-width: 768px) {
        .project-card {
            width: calc(50% - 15px);
        }
    }

    @media (max-width: 480px) {
        .project-card {
            width: 100%;
        }
    }
</style>

<div class="container mt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Quản lý dự án</h2>
        <button class="btn btn-primary" onclick="showCreateProjectModal()">
            <i class="fa-solid fa-plus"></i> Thêm dự án
        </button>
    </div>

    <div class="input-group mb-3">
        <input type="text" id="searchInput" class="form-control" placeholder="Tìm kiếm dự án theo tên...">
        <button class="btn btn-primary" onclick="loadProjects()">
            <i class="fas fa-search"></i>
        </button>
    </div>

    <div id="projects-container" class="project-container">
        <!-- Dữ liệu dự án sẽ hiển thị dưới dạng card tại đây -->
    </div>

    <nav>
        <ul class="pagination" id="pagination">
            <!-- Các nút phân trang sẽ được tạo động -->
        </ul>
    </nav>
</div>

<div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="projectModalLabel">Thêm/Sửa Dự án</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="projectForm">
                    <input type="hidden" id="projectId">
                    <div class="mb-3">
                        <label for="projectName" class="form-label">Tên dự án</label>
                        <input type="text" class="form-control" id="projectName" required>
                    </div>
                    <div class="mb-3">
                        <label for="projectBudget" class="form-label">Ngân sách</label>
                        <input type="number" class="form-control" id="projectBudget" required>
                    </div>
                    <div class="mb-3">
                        <label for="projectType" class="form-label">Loại dự án</label>
                        <select class="form-control" id="projectType" required>
                            <option value="Xây dựng">Xây dựng</option>
                            <option value="Thiết kế">Thiết kế</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="projectDescription" class="form-label">Mô tả</label>
                        <textarea class="form-control" id="projectDescription" rows="3" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="projectStartDay" class="form-label">Ngày bắt đầu</label>
                        <input type="date" class="form-control" id="projectStartDay" required>
                    </div>
                    <div class="mb-3">
                        <label for="projectEndDay" class="form-label">Ngày kết thúc</label>
                        <input type="date" class="form-control" id="projectEndDay" required>
                    </div>
                    <div class="mb-3">
                        <label for="projectStatus" class="form-label">Trạng thái</label>
                        <select class="form-control" id="projectStatus" required>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="saveProject()">Lưu dự án</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        loadProjects();
    });

    let currentPage = 1;
    const apiUrl = "{{ config('app.api_url') }}"; // Địa chỉ API
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Vui lòng đăng nhập để tiếp tục');
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập nếu cần
    }

    function loadProjects(page = 1, search = '') {
        currentPage = page;
        axios.get(`${apiUrl}/projects?page=${page}&query=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                let projects = response.data.data;
                let container = document.getElementById('projects-container');
                container.innerHTML = '';

                // Nhóm dự án theo loại
                let buildProjects = projects.filter(p => p.type === 'Xây dựng');
                let designProjects = projects.filter(p => p.type === 'Thiết kế');

                if (buildProjects.length > 0) {
                    container.innerHTML += `<div class="project-section-title">Xây dựng</div>`;
                    buildProjects.forEach(project => {
                        container.innerHTML += createProjectCard(project);
                    });
                }

                if (designProjects.length > 0) {
                    container.innerHTML += `<div class="project-section-title">Thiết kế</div>`;
                    designProjects.forEach(project => {
                        container.innerHTML += createProjectCard(project);
                    });
                }

                createPagination(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi lấy dữ liệu:', error);
                if (error.response && error.response.status === 401) {
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    window.location.href = '/login'; // Chuyển hướng nếu token hết hạn
                }
            });
    }

    function createProjectCard(project) {
        return `
        <div class="project-card">
            <div class="project-info">
                <h5>${project.name}</h5>
                <p><strong>Ngân sách:</strong> ${project.budget}</p>
                <p><strong>Ngày bắt đầu:</strong> ${project.start_day}</p>
                <p><strong>Ngày kết thúc:</strong> ${project.end_day}</p>
                <p><strong>Trạng thái:</strong> ${project.status}</p>
            </div>
            <div class="project-actions">
                <button class="btn btn-warning btn-sm" onclick="editProject('${project.project_id}')">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProject('${project.project_id}')">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>`;
    }

    function showCreateProjectModal() {
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        var myModal = new bootstrap.Modal(document.getElementById('projectModal'));
        myModal.show();
    }

    function saveProject() {
        let projectId = document.getElementById('projectId').value;
        let formData = new FormData();
        formData.append('name', document.getElementById('projectName').value);
        formData.append('budget', document.getElementById('projectBudget').value);
        formData.append('type', document.getElementById('projectType').value);
        formData.append('description', document.getElementById('projectDescription').value);
        formData.append('start_day', document.getElementById('projectStartDay').value);
        formData.append('end_day', document.getElementById('projectEndDay').value);
        formData.append('status', document.getElementById('projectStatus').value);

        if (projectId) {
            axios.put(`${apiUrl}/projects/update/${projectId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    alert('Cập nhật thành công');
                    loadProjects(currentPage);
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
                    myModal.hide();
                })
                .catch(error => {
                    console.error('Có lỗi khi cập nhật dự án:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        } else {
            axios.post(`${apiUrl}/projects/store`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    alert('Thêm dự án thành công');
                    loadProjects();
                    var myModal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
                    myModal.hide();
                })
                .catch(error => {
                    console.error('Có lỗi khi thêm dự án:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        }
    }

    function editProject(id) {
        axios.get(`${apiUrl}/projects/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                let project = response.data;
                document.getElementById('projectId').value = project.project_id;
                document.getElementById('projectName').value = project.name;
                document.getElementById('projectBudget').value = project.budget;
                document.getElementById('projectType').value = project.type;
                document.getElementById('projectDescription').value = project.description;
                document.getElementById('projectStartDay').value = project.start_day;
                document.getElementById('projectEndDay').value = project.end_day;
                document.getElementById('projectStatus').value = project.status;

                var myModal = new bootstrap.Modal(document.getElementById('projectModal'));
                myModal.show();
            })
            .catch(error => {
                console.error('Có lỗi khi lấy dữ liệu dự án:', error);
                alert('Không thể lấy thông tin dự án');
            });
    }

    function deleteProject(id) {
        if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            axios.delete(`${apiUrl}/projects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    alert('Xóa dự án thành công');
                    loadProjects(currentPage);
                })
                .catch(error => {
                    console.error('Có lỗi khi xóa dự án:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại');
                });
        }
    }
</script>

@endsection