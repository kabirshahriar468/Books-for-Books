# BooksForBooks 📚

A comprehensive book exchange platform that connects readers, authors, and publishers in a seamless ecosystem for buying, selling, and exchanging books.

## 🌟 Overview

BooksForBooks is a web-based platform designed to facilitate book exchanges and sales between users, while providing dedicated portals for authors and publishers to manage their book listings and interact with readers.

## ✨ Features

### For Users
- **Book Exchange**: Browse and exchange books with other users
- **Book Purchase**: Buy books directly from the platform
- **Search & Explore**: Discover new books and authors
- **Notifications**: Stay updated on exchange requests and activities

### For Authors
- **Author Dashboard**: Manage your published works
- **Book Management**: Add, edit, and track your books
- **Reader Interaction**: Connect with your audience
- **Profile Management**: Maintain your author profile

### For Publishers
- **Publisher Portal**: Dedicated dashboard for publishing houses
- **Catalog Management**: Organize and manage book catalogs
- **Author Relations**: Connect with authors and manage publications

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: Oracle Database
- **View Engine**: EJS (Embedded JavaScript)
- **Authentication**: Express Session with bcrypt password hashing
- **File Upload**: Multer for handling book covers and profile pictures
- **Frontend**: HTML5, CSS3, JavaScript with Bootstrap
- **Security**: Session-based authentication with encrypted passwords

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Oracle Database](https://www.oracle.com/database/) (with PDB configuration)
- npm (comes with Node.js)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BooksForBooks-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Configuration**
   - Ensure Oracle Database is running
   - Update database credentials in `db.js`:
     ```javascript
     user: "BOOKSFORBOOKS",
     password: "123",
     connectString: "localhost/orclpdb"
     ```

4. **Set up the database schema**
   - Create the required tables for Users, Authors, Publishers, Books, etc.
   - Ensure proper relationships are established

5. **Start the application**
   ```bash
   node index.js
   ```
   
   Or for development with auto-restart:
   ```bash
   npx nodemon index.js
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
BooksForBooks/
├── db.js                   # Database connection and queries
├── index.js               # Main application server
├── package.json           # Project dependencies
├── public/                # Static files (CSS, JS, Images)
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── Images/           # Uploaded images (books, profiles)
├── Routes/               # Express route handlers
│   ├── User/            # User-related routes
│   ├── Author/          # Author-related routes
│   └── Publisher/       # Publisher-related routes
└── views/               # EJS templates
    ├── dashboard_*.ejs  # Dashboard views
    ├── index_*.ejs      # Login/signup pages
    └── *.ejs           # Other page templates
```

## 🔗 API Routes

### User Routes
- `/userindex` - User login/signup page
- `/userdashboard` - User dashboard
- `/userexplore` - Browse available books
- `/mybooks` - User's book collection
- `/search` - Search functionality
- `/notifications` - User notifications

### Author Routes
- `/authorindex` - Author login/signup page
- `/authordashboard` - Author dashboard
- `/authorbooks` - Manage author's books

### Publisher Routes
- `/publisherindex` - Publisher login/signup page
- `/publisherdashboard` - Publisher dashboard

## 🎨 User Interface

The platform features a modern, responsive design with:
- Clean and intuitive navigation
- Mobile-friendly responsive layout
- Interactive carousels and animations
- Professional styling with Bootstrap integration

## 🔒 Security Features

- **Password Encryption**: Uses bcrypt for secure password hashing
- **Session Management**: Express-session for user authentication
- **File Upload Security**: Multer configuration for safe file handling
- **Input Validation**: Server-side validation for all user inputs

## 📱 User Roles

1. **Users**: Can browse, buy, and exchange books
2. **Authors**: Can manage their book publications and profiles
3. **Publishers**: Can manage catalogs and author relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

**BooksForBooks** - Connecting readers, authors, and publishers in the digital age! 📖✨
