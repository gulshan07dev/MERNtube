# MERNtube

MERNtube is a complete full fledge web application similar to YouTube, built with the MERN stack. It offers many of the same features as YouTube, but it currently lacks a video recommendation system, a feature planned for future integration as the project evolves.

<!-- However, we're actively working on integrating new feature to further enrich the user experience. Stay tuned for updates as the project evolves! -->

![MERNtube Home Page](https://res.cloudinary.com/dhwbyshmo/image/upload/v1714387898/merntube-project/MERNtube-home-page.png)

## Features

### Authentication

- **Login:** Secure authentication system allowing users to log in to their accounts.
- **Signup:** Registration process for new users.
- **Logout:** Log out functionality for user sessions.

### Channel

The Channel section provides users with a personalized space for managing their content and interactions:

1. **Home:** User-specific homepage.
2. **Videos:** Display of the user's uploaded videos, with options to filter by latest, oldest, and popularity.
3. **Tweets:** Access to tweets posted by the user, with editing, deleting, and updating capabilities.
4. **Playlists:** Management of created playlists, including creation, editing, updating, and deletion.
5. **Subscribers:** Overview of the user's subscriber base.

### Video

Comprehensive features for managing and viewing video content:

- **Video Feed:** Infinite scroll pagination-enabled feed for browsing videos.
- **Sorting:** Sorting options based on latest and oldest uploads.
- **Publishing:** Ability to publish new videos.
- **Management:** Options to remove, update, and modify video publish status.
- **Watch Later:** Bookmarking feature for saving videos to watch later.
- **Playlist Integration:** Adding videos to playlists.

### Tweets

Social media-style functionalities for posting and interacting with tweets:

- **Posting:** Users can post tweets.
- **Interaction:** Like, comment, and like comments on tweets.
- **Comments:** View and interact with comments, with infinite scroll pagination.

### Subscriptions

Effortless management of channel subscriptions:

- **Subscribe/Unsubscribe:** Option to subscribe and unsubscribe from channels.
- **Subscription List:** Access to a list of subscribed channels for easy management.

### Watch History

Tracking and management of user watch history:

- **History View:** View watch history with infinite scroll pagination.
- **Management:** Options to remove individual videos or clear the entire history.
- **Pause/Resume:** Ability to pause or resume history tracking.

### Watch Later

Bookmarking feature for saving videos to watch later:

- **Watch Later List:** Access to watch later list with infinite scroll pagination.
- **Management:** Options to remove individual videos.

### Liked Videos

Access and management of liked videos:

- **Liked Video List:** View liked videos with infinite scroll pagination.

### Playlist Videos

Access and management of videos within playlists:

- **Playlist Video View:** View all videos within a playlist with filtering options and infinite scroll pagination.

### Video Player

Enhanced video viewing experience with interactive features:

- **Video Information:** Display of video title, description, views, and upload date.
- **Interaction:** Like, unlike, and comment on videos.
- **Comments:** View and interact with comments, with infinite scroll pagination.

### Settings

Effortless management of user settings.

### Dashboard

Insightful overview of channel statistics and video management tools.

## Frontend Tech Stack

- React.js
- TypeScript
- Tailwind CSS
- react-router-dom
- Redux Toolkit
- react-redux
- axios
- js-abbreviation-number
- react-hot-toast
- react-icons
- react-timeago
- tailwind-merge

## Backend Tech Stack

- Node.js
- Express.js
- Mongoose
- mongoose-aggregate-paginate-v2
- Multer
- JSON Web Token
- dotenv
- CORS
- Cookie-parser
- bcrypt
- Cloudinary

---

## Getting Started

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/gulshan07dev/MERNtube.git
   cd MERNtube
   ```

2. Set up the backend:
   - Navigate to the backend folder: `cd backend`.
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.sample` file.
   - Start the backend server: `npm start`

3. Set up the frontend:
   - Navigate to the client folder: `cd client`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.sample` file.
   - Start the client development server: `npm run dev`

4. Access the application:
   - Open your browser and visit: `http://localhost:5173`


---

_Made with ❤️ by [Gulshan Kumar](https://www.linkedin.com/in/gulshan07dev/)_