<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Dashboard')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @include('admin.layout.styles')
</head>

<body>
    <!-- Sidebar -->
    <div id="sidebar" class="bg-warning position-fixed h-100" style="width: 250px;">
        <div class="text-white p-3">
            <img src="{{ asset('storage/images/logo.jpg') }}" alt="Logo" style="width: 100%; height: auto;">
        </div>
        @include('admin.layout.navbar')
    </div>

    <!-- Main Content -->
    <div id="main-content" class="transition" style="margin-left: 250px;">
        <nav class="navbar navbar-light bg-warning px-3">
            <button class="btn btn-warning" id="toggleSidebar"><i class="fas fa-bars"></i></button>
            <a href="#" class="text-white me-3 nav-link">Home</a>
            <div class="ms-auto">
                <div class="dropdown d-inline">
                    <button class="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Tài khoản
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item" href="#">Đổi mật khẩu</a></li>
                        <li><a class="dropdown-item" href="#" id="logoutButton">Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container mt-5">
            @yield('content')
        </div>
    </div>

    <script>
        document.getElementById('toggleSidebar').addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('hide');
            document.getElementById('main-content').classList.toggle('expanded');
        });

        // Chức năng đăng xuất
        document.getElementById('logoutButton').addEventListener('click', function() {
            const apiUrl = "{{ config('app.api_url') }}";
            const token = localStorage.getItem('token');

            axios.post(`${apiUrl}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    localStorage.removeItem('token');
                    axios.defaults.headers.common['Authorization'] = '';
                    window.location.href = '/login';
                })
                .catch(error => {
                    console.error("Logout error:", error);
                    alert("Error during logout. Check console for details.");
                });
        });
    </script>

    <!-- Thêm thư viện Axios -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</body>

</html>