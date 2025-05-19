# Environment Setup

## Backend Setup

1. Install dependencies:

```bash
cd backend/whatsapp_api
poetry install
```

2. Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=whatsapp_api
SECRET_KEY=your-secret-key-here
```

3. Start MongoDB (if running locally):

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. Run the development server:

```bash
poetry run uvicorn app.main:app --reload
```

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm start
```

## iOS App Setup

1. Open the Xcode project:

```bash
cd ios-app
open WhatsAppCompanion.xcodeproj
```

2. Configure the bundle identifier to `com.iprod.terminal`

3. Set the version to `1.0.0`

4. Build and run the app in the simulator or on a device

## AI Assistant Setup

1. Install additional dependencies:

```bash
cd backend/whatsapp_api
poetry add transformers torch
```

2. Download pre-trained models:

```bash
python -c "from transformers import AutoModel, AutoTokenizer; AutoModel.from_pretrained('bert-base-uncased'); AutoTokenizer.from_pretrained('bert-base-uncased')"
```
