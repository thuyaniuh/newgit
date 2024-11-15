<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isLogin ? 'Member Login' : 'Register Account' }}</title>

    <!-- Bootstrap và Axios -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    @include('auth.styles')
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>

<body>
    <div class="auth-container">
        <div class="auth-content">
            <div class="auth-image">
                <img src="{{ asset('storage/images/logo.jpg') }}" alt="Logo" class="logo">
            </div>
            <div class="auth-box">
                <h2 class="title">{{ $isLogin ? 'Member Login' : 'Register Account' }}</h2>

                <div id="error-message" style="color: red; margin-bottom: 10px;"></div>

                @if ($isLogin)
                <!-- Form Đăng Nhập -->
                <form id="login-form">
                    <input type="email" id="email" placeholder="Email" required class="form-control mb-2">
                    <input type="password" id="password" placeholder="Password" required class="form-control mb-2">
                    <button type="button" class="btn btn-warning w-100" onclick="login()">LOGIN</button>
                </form>
                <p><a href="{{ route('register') }}">Create your Account →</a></p>
                @else
                <!-- Form Đăng Ký -->
                <form id="register-form">
                    <input type="text" id="name" placeholder="Full Name" required class="form-control mb-2">
                    <input type="email" id="email" placeholder="Email" required class="form-control mb-2">
                    <input type="password" id="password" placeholder="Password" required class="form-control mb-2">
                    <input type="password" id="password_confirmation" placeholder="Confirm Password" required class="form-control mb-2">
                    <input type="date" id="birth" placeholder="Birth Date" required class="form-control mb-2">
                    <button type="button" class="btn btn-warning w-100" onclick="register()">REGISTER</button>
                </form>
                <p><a href="{{ route('login') }}">Already have an account? Login</a></p>
                @endif
            </div>
        </div>
    </div>

    <script>
        const apiUrl = "{{ config('app.api_url') }}"; // API URL của backend
        console.log("API URL:", apiUrl); // Kiểm tra URL API
        // Hàm đăng nhập
        function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            axios.post(`${apiUrl}/login`, {
                    email,
                    password
                })
                .then(response => {
                    const token = response.data.access_token;
                    const role = response.data.role;

                    // Lưu token và thiết lập cho các yêu cầu tiếp theo
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Điều hướng dựa trên vai trò người dùng
                    if (role === 'admin') {
                        window.location.href = '/admin/';
                    } else if (role === 'worker') {
                        window.location.href = '/worker/';
                    } else {
                        window.location.href = '/';
                    }
                })
                .catch(error => {
                    console.error("Login error:", error);
                    document.getElementById('error-message').innerText = error.response?.data?.error || 'Login failed';
                });
        }

        // Hàm đăng ký
        function register() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const password_confirmation = document.getElementById('password_confirmation').value;
            const birth = document.getElementById('birth').value;

            axios.post(`${apiUrl}/register`, {
                    name,
                    email,
                    password,
                    password_confirmation,
                    birth
                })
                .then(response => {
                    alert('Registration successful');
                    window.location.href = '/login';
                })
                .catch(error => {
                    console.error("Registration error:", error);
                    document.getElementById('error-message').innerText = error.response?.data?.message || 'Registration failed';
                });
        }
    </script>
</body>

</html>