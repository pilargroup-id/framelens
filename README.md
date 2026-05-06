# Status service
.\framelens-service.exe status
# atau
net status FrameLens

# Start service
.\framelens-service.exe start
# atau
net start FrameLens

# Stop service
.\framelens-service.exe stop
# atau
net stop FrameLens



# 🖼️ FrameLens — AI Image Generator

A web-based AI image generation app powered by Google Gemini, built with a Python backend and React + Vite frontend.

🌐 **Live:** [http://framelens.pilargroup.id](http://framelens.pilargroup.id)

---

## 📁 Project Structure

```
ai-image-generator/
├── backend_ai/
│   ├── app/
│   │   ├── config.py
│   │   ├── gemini_service.py
│   │   └── main.py
│   ├── frontend_dist/       # Auto-generated from FE build (don't edit manually)
│   ├── outputs/
│   ├── venv/                # Virtual environment (not committed)
│   ├── .env                 # Backend env vars (not committed)
│   ├── .env.example
│   └── requirements.txt
├── frontend_ai/
│   └── frontend/            # React + Vite app
│       ├── src/
│       ├── public/
│       ├── .env             # Frontend env vars (not committed)
│       ├── .env.example
│       └── vite.config.js
└── .gitignore
```

---

## ⚙️ Prerequisites

- [Python 3.12+](https://www.python.org/downloads/) — pastikan sudah terinstall
- [pyenv](https://github.com/pyenv-win/pyenv-win) (opsional, untuk manage Python version)
- [Node.js 18+](https://nodejs.org/) & npm
- Google Gemini API Key

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/username/ai-image-generator.git
cd ai-image-generator
```

---

### 2. Setup Backend

#### Masuk ke folder backend
```bash
cd backend_ai
```

#### Buat virtual environment
```bash
python3 -m venv venv
```

#### Aktifkan venv

**Windows:**
```bash
venv\Scripts\activate
```

**Mac / Linux:**
```bash
source venv/bin/activate
```

> Kalau berhasil, terminal kamu akan menampilkan `(venv)` di depan prompt.

#### Install dependencies
```bash
pip install -r app/requirements.txt
```

#### Setup environment variables
```bash
# Copy file contoh
cp .env.example .env
```

Buka file `.env` dan isi dengan nilai yang sesuai:
```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Jalankan backend
```bash
uvicorn app.main:app --reload
```

Backend akan berjalan di `http://localhost:8000`.  
API docs otomatis tersedia di `http://localhost:8000/docs`.

---

### 3. Setup Frontend

#### Buka terminal baru, masuk ke folder frontend
```bash
cd frontend_ai/frontend
```

#### Install dependencies
```bash
npm install
```

#### Setup environment variables
```bash
cp .env.example .env
```

Buka file `.env` dan isi:
```dotenv
VITE_API_URL=http://localhost:8000
```

> Untuk production, ganti dengan URL live: `http://framelens.pilargroup.id`

#### Jalankan frontend (development)
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

---

## 🏗️ Build untuk Production

```bash
cd frontend_ai/frontend
npm run build
```

Hasil build akan otomatis masuk ke `backend_ai/frontend_dist/` — tidak perlu copy manual.

---

## 🔑 Environment Variables

### Backend (`backend_ai/.env`)

| Variable | Keterangan |
|---|---|
| `GEMINI_API_KEY` | API key dari Google AI Studio |

### Frontend (`frontend_ai/frontend/.env`)

| Variable | Keterangan |
|---|---|
| `VITE_API_URL` | URL backend (local atau production) |

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.12, FastAPI, Uvicorn |
| Image Processing | Pillow |
| AI | Google Gemini (`google-genai`) |
| Frontend | React, Vite |
| Deployment | framelens.pilargroup.id |

---

## ❓ FAQ

**Q: Kenapa venv tidak ada di repo?**  
A: Virtual environment tidak di-commit ke Git karena ukurannya besar dan bisa di-generate ulang dengan `pip install -r requirements.txt`.

**Q: Setelah pull perubahan terbaru, frontend tidak update?**  
A: Jalankan ulang `npm run build` di folder `frontend_ai/frontend/` untuk generate ulang `frontend_dist/`.