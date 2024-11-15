@extends('admin.layout.master')

@section('title', 'Dashboard')

@section('content')
<div class="row">
    <!-- Project Box -->
    <div class="col-lg-3 col-6">
        <div class="small-box bg-info">
            <div class="inner">
                <h3 id="count-project">
                    <div class="spinner-border text-light"></div>
                </h3>
                <p>Project</p>
            </div>
            <div class="icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>

    <!-- Bounce Rate Box -->
    <div class="col-lg-3 col-6">
        <div class="small-box bg-success">
            <div class="inner">
                <h3>53<sup style="font-size: 20px">%</sup></h3>
                <p>Bounce Rate</p>
            </div>
            <div class="icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>

    <!-- User Box -->
    <div class="col-lg-3 col-6">
        <div class="small-box bg-warning">
            <div class="inner">
                <h3 id="count-user">
                    <div class="spinner-border text-light"></div>
                </h3>
                <p>User</p>
            </div>
            <div class="icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>

    <!-- Supplier Box -->
    <div class="col-lg-3 col-6">
        <div class="small-box bg-danger">
            <div class="inner">
                <h3 id='count-supplier'>
                    <div class="spinner-border text-light"></div>
                </h3>
                <p>Supplier</p>
            </div>
            <div class="icon">
                <i class="fas fa-chart-pie"></i>
            </div>
            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
</div>

<!-- Load dữ liệu từ API -->
<script>
    const apiUrl = "{{ config('app.api_url') }}";
    const token = localStorage.getItem('token');
    console.log(token);

    function loadAllData() {
        axios.get(`${apiUrl}/counts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function(response) {
                document.getElementById('count-user').innerHTML = response.data.countUsers;
                document.getElementById('count-project').innerHTML = response.data.countProjects;
                document.getElementById('count-supplier').innerHTML = response.data.countSuppliers;
            })
            .catch(function(error) {
                console.error("Error loading data:", error);
                alert("Error loading data. Check console for details.");
            });
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadAllData();
    });
</script>
@endsection