<ul class="list-unstyled menu">
    <li>
        <a href="{{route('admin.index')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-tachometer-alt me-2"></i> Dashboard
        </a>
    </li>
    <li>
        <a href="{{route('admin.user.list')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-user-friends me-2"></i> Quản lí người dùng
        </a>
    </li>
    <li>
        <a href="{{route('admin.material.list')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-cubes me-2"></i> Quản lí vật tư
        </a>
    </li>
    <li>
        <a href="{{route('admin.supplier.list')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-industry me-2"></i> Quản lí nhà cung cấp
        </a>
    </li>
    <li>
        <a href="#" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-chart-pie me-2"></i> Reports
        </a>
    </li>
    <li>
        <a href="{{route('admin.project.list')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-tasks me-2"></i> Quản lí dự án
        </a>
    </li>
    <li>
        <a href="{{route('admin.purchase.list')}}" class="text-white d-block py-2 px-3 nav-link">
            <i class="fas fa-shopping-cart me-2"></i> Quản lí mua hàng
        </a>
    </li>
</ul>