# DEMO-FOR-CAR-DETAIL-CENTER

Production-ready Express backend for an autoservice lead form. The API validates leads, protects the endpoint with CORS and rate limiting, and sends every valid lead to Telegram through the Bot API.

## Stack

- Node.js 18+
- Express
- dotenv
- axios

## API

### `POST /api/lead`

Request body:

```json
{
  "name": "Алексей",
  "phone": "+375291112233",
  "vehicle": "BMW 3 Series",
  "time": "Сегодня после 18:00"
}
```

Success response:

```json
{
  "success": true,
  "message": "Lead received. We will contact you soon."
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "Phone must contain at least 5 characters."
  }
}
```

## Environment

Copy `.env.example` to `.env` and fill the values:

```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

Local `.env` is ignored by Git and should not be committed.

## Local Run

```bash
npm install
npm run dev
```

Open the landing page from the backend:

```text
http://localhost:3000/
```

Do not open `index.html` directly as a file for normal testing. The backend now supports that in development, but `http://localhost:3000/` is the clean same-origin flow and matches production more closely.

Health check:

```bash
curl http://localhost:3000/api/health
```

Lead test:

```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Алексей\",\"phone\":\"+375291112233\",\"vehicle\":\"BMW 3 Series\",\"time\":\"Сегодня после 18:00\"}"
```

## Frontend Fetch Example

```html
<form id="leadForm">
  <input name="name" placeholder="Имя" required>
  <input name="phone" placeholder="Телефон" minlength="5" required>
  <input name="vehicle" placeholder="Авто" required>
  <input name="time" placeholder="Удобное время" required>
  <button type="submit">Отправить</button>
</form>

<script>
  const form = document.querySelector('#leadForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = Object.fromEntries(new FormData(form));

    const response = await fetch('http://localhost:3000/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || 'Не удалось отправить заявку');
      return;
    }

    alert('Заявка отправлена');
    form.reset();
  });
</script>
```

## Render Deploy

1. Push the project to GitHub.
2. Open Render and create a new **Web Service** from the repository.
3. Set **Runtime** to Node.
4. Set **Build Command**:

```bash
npm install
```

5. Set **Start Command**:

```bash
npm start
```

6. Add environment variables in Render:

```bash
NODE_ENV=production
PORT=10000
FRONTEND_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

7. Deploy and test:

```bash
curl https://your-render-service.onrender.com/api/health
```
