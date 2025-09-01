# Reddit Clone - הוראות התקנה והפעלה

## מבנה הפרויקט

```
Reddit-Clone/
├── Client/          # React + TypeScript + Vite
├── server/          # Node.js + Express + Socket.io
└── README.md
```

## התקנה והפעלה

### 1. התקנת תלויות

#### Client (Frontend)

```bash
cd Client
npm install
```

#### Server (Backend)

```bash
cd server
npm install
```

### 2. הפעלת השרת

```bash
cd server
npm run dev
```

השרת יפעל על פורט 5000

### 3. הפעלת הלקוח

```bash
cd Client
npm run dev
```

הלקוח יפעל על פורט 5173

## תכונות שהושלמו

### ✅ Frontend

- **Layout מלא**: Header, Sidebar שמאל, תוכן מרכזי, Sidebar ימין
- **Dark Mode**: מעבר בין מצב בהיר לכהה עם שמירה ב-localStorage
- **SVG Icons**: תמיכה באייקונים עם שינוי צבע אוטומטי ב-dark mode
- **Post Feed**: תצוגת פוסטים עם אפשרויות הצבעה, תגובות ושיתוף
- **Responsive Design**: עיצוב מותאם למסכים שונים
- **WebSocket Integration**: חיבור לשרת בזמן אמת

### ✅ Backend

- **Socket.io Server**: שרת WebSocket עם תמיכה באירועים בזמן אמת
- **CORS Configuration**: הגדרה נכונה ל-CORS
- **Event Handling**: טיפול באירועי פוסטים, תגובות ועדכונים

## קבצים שנוצרו

### Frontend Components

- `src/contexts/ThemeContext.tsx` - ניהול מצב dark mode
- `src/contexts/SocketContext.tsx` - ניהול חיבור WebSocket
- `src/components/Layout/Header.tsx` - כותרת עליונה
- `src/components/Layout/Sidebar.tsx` - סרגל צד שמאל
- `src/components/Layout/RightSidebar.tsx` - סרגל צד ימין
- `src/components/Layout/MainLayout.tsx` - פריסה ראשית
- `src/components/Posts/PostCard.tsx` - כרטיס פוסט
- `src/components/Posts/PostFeed.tsx` - רשימת פוסטים
- `src/components/Icons/IconWrapper.tsx` - עטיפה לאייקונים

### Backend

- `server/src/index.ts` - שרת Express עם Socket.io

## אייקונים זמינים

כל האייקונים נמצאים בתיקייה `Client/src/assets/`:

- `reddit-logo.svg` - לוגו Reddit
- `home-icon.svg` - אייקון בית
- `popular-logo.svg` - אייקון פופולרי
- `all-logo.svg` - אייקון הכל
- `search-bar-icon.svg` - אייקון חיפוש
- `dark-mode-icon.svg` - אייקון מצב כהה
- `like-post-icon.svg` - אייקון לייק
- `dislike-post-icon.svg` - אייקון דיסלייק
- `comment-icon.svg` - אייקון תגובה
- `share-icon.svg` - אייקון שיתוף
- ועוד רבים אחרים...

## איך להחליף אייקונים

1. העתק את ה-SVG שלך לתיקייה `Client/src/assets/`
2. עדכן את הקומפוננט הרלוונטי:

```tsx
import YourIcon from "../../assets/your-icon.svg";

// בתוך הקומפוננט
<IconWrapper>
  <YourIcon />
</IconWrapper>;
```

## WebSocket Events

### Client → Server

- `createPost` - יצירת פוסט חדש
- `updatePost` - עדכון פוסט
- `createComment` - יצירת תגובה

### Server → Client

- `newPost` - פוסט חדש
- `postUpdate` - עדכון פוסט
- `newComment` - תגובה חדשה

## צבעים ועיצוב

הפרויקט משתמש ב-Tailwind CSS עם תמיכה מלאה ב-dark mode:

- **Light Mode**: רקע לבן, טקסט כהה
- **Dark Mode**: רקע כהה, טקסט בהיר
- **Accent Color**: כתום (#f97316) - צבע Reddit המקורי

## השלבים הבאים

1. **החלפת אייקונים**: החלף את האייקונים הזמניים באייקונים האמיתיים מ-assets
2. **הוספת API**: חיבור למסד נתונים אמיתי
3. **אימות משתמשים**: הוספת מערכת התחברות
4. **תגובות**: הוספת מערכת תגובות מלאה
5. **תת-רדיטים**: הוספת ניהול קהילות
6. **העלאות**: הוספת העלאת תמונות וסרטונים

## פתרון בעיות

### שגיאות CORS

ודא שהשרת רץ על פורט 5000 והלקוח על פורט 5173

### WebSocket לא מתחבר

בדוק שהשרת רץ ושה-CORS מוגדר נכון

### אייקונים לא מוצגים

ודא שהנתיב ל-SVG נכון ושהקובץ קיים
