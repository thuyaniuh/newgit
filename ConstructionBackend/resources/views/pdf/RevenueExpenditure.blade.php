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
        <h1>Báo cáo thu chi</h1>
    </div>

    <div>
        <table>
            <tr>
                <th>ID</th>
                <th>Money</th>
                <th>Type Re</th>
                <th>User</th>
                <th>Created At</th>
            </tr>
            @foreach ($data as $value)
                <tr>
                    <td>{{ $value['id'] }}</td>
                    <td>{{ $value['money'] }}</td>
                    <td>
                        @if ($value['type_re'] == 0)
                            {{ 'Phiếu thu' }}
                        @else
                            {{ 'Phiếu chi' }}
                        @endif
                    </td>
                    <td>{{ $value['user']['name'] }}</td>
                    <td>{{ $value['created_at'] }} at</td>
                </tr>
            @endforeach
        </table>
    </div>
</body>

</html>
