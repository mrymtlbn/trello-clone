# Trello Clone

A modern, responsive Trello clone built with Next.js 14, TypeScript, and SCSS. This project demonstrates clean architecture, drag-and-drop functionality, and client-side state management.

## 🚀 Features

### Core Functionality

- **Board Management**: Create, edit, delete, and switch between boards
- **List Management**: Create, edit, delete, and reorder lists within boards
- **Card Management**: Create, edit, delete, and move cards between lists
- **Drag & Drop**: Smooth drag-and-drop for both lists and cards using @dnd-kit
- **Modal System**: Detailed card editing with modal interface
- **Inline Editing**: Quick editing of titles and descriptions
- **Data Persistence**: All data stored in localStorage

### UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark theme with smooth animations
- **Real-time Updates**: Instant updates with optimistic UI
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Accessibility**: ARIA labels and keyboard navigation

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **SCSS**: Modular SCSS architecture with variables and mixins
- **Zustand**: Lightweight state management with persistence
- **Next.js 14**: Latest Next.js with App Router
- **Clean Architecture**: SOLID principles and separation of concerns

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Utilities**: clsx, nanoid
- **Build Tool**: Vite (via Next.js)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd trello-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   npm run export
   ```
2. Deploy the `out` folder to any static hosting service

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Board.tsx          # Main board component
│   ├── List.tsx           # List component
│   ├── Card.tsx           # Card component
│   ├── CardModal.tsx      # Card details modal
│   ├── Modal.tsx          # Generic modal
│   └── InlineEditor.tsx   # Inline editing component
├── store/                 # State management
│   └── useAppStore.ts     # Zustand store
├── styles/                # SCSS styles
│   ├── main.scss          # Main SCSS file
│   ├── _variables.scss    # SCSS variables
│   ├── _mixins.scss       # SCSS mixins
│   ├── _globals.scss      # Global styles
│   ├── _layout.scss       # Layout styles
│   └── _components.scss   # Component styles
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── utils/                 # Utility functions
    ├── storage.ts         # localStorage utilities
    └── helpers.ts         # Helper functions
```

## 🎯 Key Features Explained

### Drag & Drop

- **Lists**: Drag to reorder lists within a board
- **Cards**: Drag cards between lists or reorder within the same list
- **Visual Feedback**: Smooth animations and visual cues during drag operations

### State Management

- **Zustand Store**: Centralized state management with persistence
- **Optimistic Updates**: UI updates immediately for better UX
- **Error Handling**: Graceful error handling with user feedback

### Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Breakpoints**: Responsive breakpoints for different screen sizes
- **Touch Support**: Full touch support for mobile devices

### Data Persistence

- **localStorage**: All data persisted in browser's localStorage
- **Automatic Sync**: Changes automatically saved to localStorage
- **Data Migration**: Handles data migration for future updates

## 🎨 Customization

### Colors

Edit `src/styles/_variables.scss` to customize the color scheme:

```scss
$primary: #0ea5e9; // Primary blue
$bg: #0b1020; // Background
$surface: #111836; // Card surfaces
$muted: #94a3b8; // Muted text
$accent: #22d3ee; // Accent color
```

### Spacing

Customize spacing throughout the app:

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 24px;
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **SCSS**: BEM methodology for class naming
- **Components**: Functional components with hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Trello](https://trello.com) for the inspiration
- [Next.js](https://nextjs.org) for the amazing framework
- [@dnd-kit](https://dndkit.com) for the drag-and-drop functionality
- [Zustand](https://zustand-demo.pmnd.rs) for state management

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and SCSS**
