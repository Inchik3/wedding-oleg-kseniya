# 📋 Полная инструкция по запуску свадебного сайта

Сайт Олега и Ксении - 17 июля 2027

## ✅ Что уже сделано:
- ✓ Сайт с всплывающими окнами реализован
- ✓ Анкета гостя с выбором алкоголя реализована
- ✓ Адаптивный дизайн (ПК и мобильные)
- ✓ Ваши данные установлены (Олег и Ксения, 17.07.2027, кафе Светлояр)
- ✓ Музыка заменена на "Нежная Любовь 2.0 - Beautiful Boys, Boostereo"
- ✓ GitHub Actions настроен для деплоя

---

## 🎵 Шаг 1: Замените фотографии (если нужно)

Текущие фотографии находятся в папке `public/wedding/`:
- `hero.jpg` - фоновое изображение на главном экране
- `countdown.jpg` - фоновое изображение таймера
- `location.jpg` - фоновое изображение локации
- `g1.jpg` - `g6.jpg` - фотографии для галереи

Чтобы заменить их:
1. Подготовьте свои фотографии в формате JPG
2. Переименуйте их как указано выше
3. Замените файлы в папке `public/wedding/`

---

## 📊 Шаг 2: Настройте Google Apps Script для анкеты

### 2.1 Создайте Google Таблицу

1. Откройте [Google Sheets](https://sheets.google.com)
2. Создайте новую таблицу
3. В первой строке создайте заголовки колонок:
   - A: `fullName` (Имя и фамилия)
   - B: `attendance` (Присутствие)
   - C: `attendanceValue` (Значение присутствия)
   - D: `drinks` (Напитки)
   - E: `drinksText` (Напитки текстом)
   - F: `comment` (Комментарий)
   - G: `submittedAt` (Дата отправки)

### 2.2 Создайте Apps Script

1. В таблице: **Расширения** → **Apps Script**
2. Удалите всё и вставьте этот код:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.fullName,
      data.attendance,
      data.attendanceValue,
      JSON.stringify(data.drinks),
      data.drinksText,
      data.comment,
      data.submittedAt
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Сохраните скрипт (Ctrl+S)
4. Нажмите **Развернуть** → **Новое развертывание**
5. Выберите тип: **Веб-приложение**
6. Настройки:
   - Описание: `RSVP Form`
   - Кто имеет доступ: **Любой пользователь**
7. Нажмите **Развернуть**
8. Скопируйте URL веб-приложения (заканчивается на `/exec`)

### 2.3 Вставьте ссылку в код

1. Откройте файл `src/lib/wedding.ts`
2. В строке 13 замените:
   ```typescript
   export const GOOGLE_APPS_SCRIPT_URL = "";
   ```
   на:
   ```typescript
   export const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/ВАШ_ID/exec";
   ```
3. Сохраните файл

---

## 🚀 Шаг 3: Деплой на GitHub Pages

### 3.1 Создайте репозиторий на GitHub

1. Зайдите на [GitHub](https://github.com) и войдите в аккаунт
2. Нажмите **+** → **New repository**
3. Заполните:
   - Repository name: `wedding-oleg-kseniya` (или любое другое имя)
   - Description: `Свадебный сайт Олега и Ксении`
   - Public: ✅ (обязательно)
   - ❌ Add a README file (не отмечайте)
4. Нажмите **Create repository**

### 3.2 Инициализируйте git и загрузите код

Откройте командную строку (PowerShell) и выполните:

```bash
cd "C:\Users\ivanm\OneDrive\Рабочий стол\all"
git init
git add .
git commit -m "Initial commit - wedding site"
git branch -M main
git remote add origin https://github.com/ВАШ_НИКНЕЙМ/wedding-oleg-kseniya.git
git push -u origin main
```

⚠️ Замените `ВАШ_НИКНЕЙМ` на ваш никнейм в GitHub

### 3.3 Настройте GitHub Pages

1. Откройте созданный репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Build and deployment**:
   - Source: выберите **GitHub Actions**
4. Всё! GitHub Actions автоматически соберёт и опубликует сайт

### 3.4 Дождитесь завершения деплоя

1. Перейдите во вкладку **Actions** в репозитории
2. Дождитесь завершения процесса (обычно 2-3 минуты)
3. После успешного деплоя появится зелёная галочка
4. Ссылка на сайт будет доступна в **Settings** → **Pages**

---

## 🎨 Шаг 4: Настройка карт в Twitter/Facebook (опционально)

Для красивых превью при шаринге можно настроить OG-карты:
1. Откройте файл `public/og.jpg`
2. Замените на свою картинку (рекомендуемый размер: 1200x630px)

---

## 📱 Шаг 5: Тестирование

После деплоя:
1. Откройте сайт по ссылке GitHub Pages
2. Проверьте на ПК (Chrome, Firefox, Safari)
3. Проверьте на телефоне (можно через инспектор в браузере: F12 → иконка телефона)
4. Откройте анкету и попробуйте отправить ответ
5. Проверьте Google Таблицу — должен появиться новый ответ

---

## 🔧 Если что-то не работает

### Анкета не отправляет ответы:
- Проверьте, что вставили правильную ссылку на Apps Script
- Проверьте, что в Apps Script выбран доступ "Любой пользователь"
- Проверьте консоль браузера (F12 → Console) на наличие ошибок

### Сайт не открывается:
- Проверьте, что репозиторий Public (не Private)
- Проверьте Actions — там должен быть успешный билд
- Подождите несколько минут после первого деплоя

### Музыка не играет:
- Проверьте, что файл `music.mp3` находится в папке `public/wedding/`
- Нажмите кнопку музыки в левом верхнем углу сайта

---

## 📞 Нужно изменить данные после деплоя?

1. Откройте файл в папке проекта
2. Внесите изменения
3. Выполните в терминале:
   ```bash
   git add .
   git commit -m "Описание изменений"
   git push
   ```
4. GitHub Actions автоматически задеплоит новую версию

---

## 🎉 Готово!

Ваш свадебный сайт готов к использованию! Поделитесь ссылкой с гостями.
