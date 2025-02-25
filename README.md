# Plexifly - Real-time Collaboration Platform

Plexifly is a modern real-time collaboration platform built with Next.js, enabling teams to work together seamlessly on shared whiteboards and projects.

<img src="./public/logo.png" alt="Plexifly" width="200"/>

## ✨ Features

- **Real-time Collaboration**: Work together with your team in real-time
- **Interactive Whiteboard**: Draw, add text, shapes, and notes
- **Multi-user Cursors**: See where others are working
- **Organization Management**: Create and manage teams and projects
- **Responsive Design**: Works seamlessly across devices
- **Modern UI**: Built with a clean, intuitive interface

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/plexifly.git
cd plexifly/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the frontend directory with your environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Liveblocks](https://liveblocks.io/) - Real-time collaboration
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Clerk](https://clerk.com/) - Authentication

## 📁 Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── (dashboard)/    # Dashboard routes
│   ├── board/          # Board routes
│   └── api/            # API routes
├── components/         # Reusable components
├── lib/                # Utilities and helpers
└── public/            # Static assets
```

## 🔧 Development

- The project uses the Next.js App Router
- Components are built using TypeScript and Tailwind CSS
- Real-time features are powered by Liveblocks

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Liveblocks for real-time collaboration features
- Shadcn for the beautiful UI components

---

Made with ❤️ by [Abu Jobayer](https://www.linkedin.com/in/abutalhamdjobayer)

Need help? [Open an Issue](https://github.com/abujobayer0/Zyler/issues)
