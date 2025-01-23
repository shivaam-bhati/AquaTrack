# AquaTrack - Your Water Business Partner 💧

![AquaTrack Preview](https://www.aquatracker.in/preview-image.png)

AquaTrack is the ultimate solution for managing your water jar business. Track water jars, manage customers, and grow your business digitally—all from your phone. Say goodbye to diaries and hello to streamlined operations with AquaTrack.


---

## 🚀 Features

- **Daily Jar Tracking**: Track given and returned jars in real-time.
- **Customer Management**: Maintain digital customer profiles with payment history and delivery addresses.
- **Business Reports**: Generate monthly collection reports, jar balance analysis, and business insights.
- **Mobile Optimized**: Manage your business on the go with a mobile-friendly interface.

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (or any preferred database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aquatrack.git
   cd aquatrack
2. Install dependencies:
   ```bash
    npm install
3. Setup environment variables:
  - create a .env file in root directory
  - add followig variables
    ```bash
    DATABASE_URL=""
    NEXT_PUBLIC_BASE_URL=""
    
    # Auth
    NEXTAUTH_URL=""
    NEXTAUTH_SECRET="" # generate using `openssl rand -base64 32`
    GOOGLE_CLIENT_ID=""
    GOOGLE_CLIENT_SECRET=""  
  
4. Run database migrations:
    ```bash
    npm run db:push

5. Start the development server:
    ```bash
    npm run dev

6. Open your browser and navigate to http://localhost:3000.

### 🛠️ Tech Stack:
  - Frontend: Next.js, Tailwind CSS
  - Backend: Next.js API Routes
  - Database: PostgreSQL (via Drizzle ORM) hosted on Neon
  - Authentication: NextAuth.js
  - Deployment: Vercel


  
