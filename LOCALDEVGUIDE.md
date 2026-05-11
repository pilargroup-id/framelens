# Local Development Guide

## Prerequisites

IMPORT DATABASE "pilargroup"

Pastiin semua service ini jalan sebelum develop:

| Service | Port | Cara jalanin |
|---|---|---|
| Laragon (MySQL) | 3306 | Buka Laragon → Start |
| Pilargroup BE | 8000 | `php artisan serve --port=8000` |
| BF BE | 8001 | Lihat di bawah |
| BF FE | 5173 | `npm run dev` |

---

## BillForge (BF)

### BE — Setup `.env.local`

Buat file `.env.local` di root folder BE (`backend_invoice/`):

```dotenv
APP_ENV=local

PILARGROUP_API_URL=http://localhost:8000/api

DEV_MOCK_USERNAME=username_kamu
DEV_MOCK_PASSWORD=password_kamu

JWT_SECRET=isi_sama_dengan_jwt_secret_di_pilargroup
```

> ⚠️ `.env.local` tidak di-commit ke git.

### BE — Jalanin server

```cmd
cd D:\Project\invoice\backend_invoice
C:\laragon\bin\python\python-3.10\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### FE — Setup `.env.development`

Buat file `.env.development` di root folder FE:

```dotenv
VITE_API_URL=http://localhost:8001/api
VITE_PILARGROUP_URL=http://localhost:8000
VITE_MOCK_AUTH=true
VITE_MOCK_USERNAME=username_kamu
VITE_MOCK_PASSWORD=password_kamu
```

> ⚠️ `.env.development` tidak di-commit ke git.

### FE — Jalanin dev server

```cmd
cd D:\Project\invoice\frontend
npm run dev
```

Buka `http://localhost:5173` — auto login sebagai user dari `.env.development`.

---

## FrameLens (FL)

### BE — Setup `.env.local`

Buat file `.env.local` di root folder BE (`backend_ai/`):

```dotenv
APP_ENV=local

PILARGROUP_API_URL=http://localhost:8000/api

DEV_MOCK_USERNAME=username_kamu
DEV_MOCK_PASSWORD=password_kamu

JWT_SECRET=isi_sama_dengan_jwt_secret_di_pilargroup
```

> ⚠️ `.env.local` tidak di-commit ke git.

### BE — Jalanin server

```cmd
cd D:\Project\framelens\backend_ai
C:\laragon\bin\python\python-3.10\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### FE — Setup `.env.development`

Buat file `.env.development` di root folder FE:

```dotenv
VITE_API_URL=http://localhost:8001/api
VITE_PILARGROUP_URL=http://localhost:8000
VITE_MOCK_AUTH=true
VITE_MOCK_USERNAME=username_kamu
VITE_MOCK_PASSWORD=password_kamu
```

> ⚠️ `.env.development` tidak di-commit ke git.

### FE — Jalanin dev server

```cmd
cd D:\Project\framelens\frontend
npm run dev
```

Buka `http://localhost:5173` — auto login sebagai user dari `.env.development`.

---

## Flow Mock Auth (Local Only)

```
Buka localhost:5173 (incognito/fresh)
  → ProtectedRoute: localStorage kosong, VITE_MOCK_AUTH=true
  → Hit BE lokal /api/dev/login
  → BE hit pilargroup localhost:8000/api/auth/login
  → Dapat JWT asli + user data
  → Simpen ke localStorage
  → Reload → AuthContext pick up token → masuk app
```

> Mock auth hanya aktif kalau `APP_ENV=local` di BE dan `VITE_MOCK_AUTH=true` di FE.
> Di production kedua env ini tidak ada, jadi route `/api/dev/login` tidak ter-register sama sekali.

---

## Troubleshooting

**503 Service Unavailable saat mock auth**
→ Pastiin `artisan serve` pilargroup jalan di port 8000.

**HTML response dari pilargroup**
→ Pastiin hit dengan header `Accept: application/json`. Sudah di-handle otomatis di `dev_auth.py`.

**Token expired / invalid setelah beberapa waktu**
→ Hapus localStorage (`fl_token`/`fl_user` atau `bf_token`/`bf_user`) lalu reload — mock auth akan inject ulang.

**Loop redirect ke pilargroup**
→ Pastiin username yang dipakai punya akses ke project (`framelens`/`billforge`) di tabel `central_user_projects` DB pilargroup lokal.