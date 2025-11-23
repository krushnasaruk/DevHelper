# DevConnect - Developer Community Platform

A modern developer community platform where developers can ask questions, upload code, get AI-powered answers, and receive help from fellow developers.

## 🌟 Features

- **AI-Powered Answers**: Get instant, intelligent answers to coding questions
- **Community Q&A**: Ask questions and get help from experienced developers
- **Code Sharing**: Upload and share code snippets with syntax highlighting
- **User Authentication**: Secure JWT-based authentication system
- **Reputation System**: Build your reputation by helping others
- **Modern UI**: Beautiful light theme with premium design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` and configure your settings:
```env
PORT=3000
JWT_SECRET=your_secret_key_here
AI_SERVICE=openai
OPENAI_API_KEY=your_api_key_here
```

4. **Start the server**
```bash
npm start
```

5. **Open your browser**

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
DevConnect/
├── index.html              # Main HTML file
├── styles.css              # Complete design system
├── app.js                  # Main application logic
├── server.js               # Express backend server
├── package.json            # Dependencies
├── .env.example            # Environment variables template
│
├── components/             # Reusable components
│   ├── modals.js          # Modal functionality
│   ├── navbar.js          # Navigation bar
│   └── code-editor.js     # Code editor component
│
├── pages/                  # Page modules
│   ├── home.js            # Landing page
│   ├── questions.js       # Questions browser
│   ├── question-detail.js # Question details & answers
│   ├── ask-question.js    # Ask question form
│   ├── upload-code.js     # Code upload form
│   └── profile.js         # User profile
│
└── data/                   # JSON data storage
    ├── users.json         # User accounts
    ├── questions.json     # Questions database
    └── code-snippets.json # Code uploads
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (requires auth)
- `POST /api/questions/:id/answers` - Add answer (requires auth)
- `PUT /api/questions/:id/vote` - Vote on question (requires auth)

### Code Uploads
- `POST /api/code/upload` - Upload code (requires auth)
- `GET /api/code/:id` - Get code snippet
- `GET /api/code/user/:userId` - Get user's code snippets

## 🤖 AI Integration

The platform supports AI-powered features:

1. **AI Answers**: When asking a question, enable "Get instant AI answer" to receive an AI-generated response
2. **Code Review**: When uploading code, enable "Get AI code review" for automated feedback

### Configuring AI Service

**For OpenAI (GPT):**
```env
AI_SERVICE=openai
OPENAI_API_KEY=your_openai_api_key
```

**For Google Gemini:**
```env
AI_SERVICE=gemini
GEMINI_API_KEY=your_gemini_api_key
```

> **Note**: AI integration currently returns simulated responses. To enable real AI answers, implement the actual API calls in `server.js` using your chosen AI service.

## 🎨 Design System

The platform uses a modern light theme with:

- **Colors**: Soft whites, modern blues, and vibrant accents
- **Typography**: Inter for UI, JetBrains Mono for code
- **Components**: Buttons, cards, forms, modals, badges, tags
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 💾 Data Storage

Data is stored in JSON files in the `data/` directory:

- **users.json**: User accounts (passwords are hashed with bcrypt)
- **questions.json**: Questions, answers, and metadata
- **code-snippets.json**: Code uploads and reviews

> **Note**: For production use, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Token expiration (7 days)
- Protected routes require authentication
- Input validation on both client and server

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Code Structure Guidelines

- Keep components reusable and modular
- Follow the existing naming conventions
- Update the design system for new components
- Test on multiple screen sizes

## 📝 License

MIT

## 🤝 Contributing

This is a portfolio/demo project. Feel free to fork and customize for your own use!

## 💡 Future Enhancements

- Real-time notifications
- Private messaging between users
- Advanced search with filters
- Code syntax highlighting themes
- Markdown support for rich text
- User badges and achievements
- Email notifications
- OAuth login (Google, GitHub)
- Database migration (MongoDB/PostgreSQL)
- WebSocket for live updates

## 📧 Support

For questions or issues, please open an issue on the repository or contact the developer.

---

Built with ❤️ for the developer community
