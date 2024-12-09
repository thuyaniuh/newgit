<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Document</title>
    <style>
        /* Định dạng bảng */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        /* Định dạng các ô trong bảng */
        td,
        th {
            border: 1px solid #000;
            /* Thêm border cho các ô */
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body style="font-family: DejaVu Sans, sans-serif;">
    <div>
        <h1>Chấm công</h1>
    </div>
    <div>
        <b>Ngày xuất: {{ $start }}</b>
    </div>
    <div>
        <b>Họ tên: {{ $user->name }}</b>
    </div>
    <div>
        <b>Email: {{ $user->email }}</b>
    </div>
    <div style="margin-top: 20px;">
        <table>
            <tr>
                <th>Dự án</th>
                <th>Sô tiên</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
            </tr>
            @foreach ($data as $value)
                <tr>
                    <td>{{ $value['name'] }}</td>
                    <td>{{ $value['money'] }}</td>
                    <td>
                        @if ($value['status'] == 1)
                            {{ 'Có mặt' }}
                        @elseif ($value['status'] == 2)
                            {{ 'Trễ' }}
                        @else
                            {{ 'Nghỉ' }}
                        @endif
                    </td>
                    <td>{{ date('d/m/y', strtotime($value['created_at'])) }}</td>
                </tr>
            @endforeach
        </table>
    </div>

    <div style="padding-left: 70%; margin-top: 40px;">
        Ký tên xác nhận
    </div>
</body>

</html>
