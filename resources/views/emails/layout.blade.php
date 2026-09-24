<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Notifikasi Replate' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f3f4f6;
            padding: 40px 0;
        }
        .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #e5e7eb;
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
            padding: 32px 30px;
            text-align: center;
        }
        .logo-text {
            color: #ffffff;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 0;
        }
        .tagline {
            color: #d1fae5;
            font-size: 13px;
            margin-top: 6px;
            font-weight: 500;
        }
        .content {
            padding: 32px 30px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            font-size: 12px;
            color: #6b7280;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background-color: #059669;
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
        }
        .btn:hover {
            background-color: #047857;
        }
        .card-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 18px;
            margin: 20px 0;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .badge-success { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .badge-info { background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .badge-warning { background-color: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .badge-danger { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        table.detail-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        table.detail-table td {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        table.detail-table td.label {
            color: #6b7280;
            width: 40%;
        }
        table.detail-table td.val {
            color: #111827;
            font-weight: 600;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1 class="logo-text">🌱 Replate</h1>
                <div class="tagline">Sistem Sirkular Penyelamatan Pangan Desa</div>
            </div>

            <!-- Content Area -->
            <div class="content">
                @yield('content')
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="margin: 0 0 6px 0;"><strong>Replate Desa</strong> — Gerakan Bersama Mencegah Food Waste & Menjaga Ketahanan Pangan Lokal</p>
                <p style="margin: 0;">Email otomatis dikirim oleh sistem. Mohon tidak membalas email ini secara langsung.</p>
            </div>
        </div>
    </div>
</body>
</html>
