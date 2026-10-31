const bcrypt = require('bcryptjs');

const initialMovies = [
  // --- INDIAN BLOCKBUSTERS (NOW SHOWING) ---
  {
    _id: '671d1001a1b2c3d4e5f60020',
    title: 'Kalki 2898 AD',
    description:
      'A modern avatar of Vishnu, a Hindu god, is believed to have descended to the earth to protect the world from evil forces in a dystopian post-apocalyptic future set in the year 2898 AD.',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    duration: 181,
    language: 'Hindi, Telugu',
    releaseDate: new Date('2024-06-27'),
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    rating: 8.4,
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    formats: ['IMAX 3D', '3D', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60021',
    title: 'Stree 2: Sarkate Ka Aatank',
    description:
      'After the terrifying events of Stree, the town of Chanderi is being haunted again. This time, women are mysteriously abducted by a headless ghost named Sarkata, and Vicky and his gang must unite to save their town.',
    genre: ['Horror', 'Comedy', 'Mystery'],
    duration: 147,
    language: 'Hindi',
    releaseDate: new Date('2024-08-15'),
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhefZ_M4U',
    rating: 8.2,
    director: 'Amar Kaushik',
    cast: ['Rajkummar Rao', 'Shraddha Kapoor', 'Pankaj Tripathi', 'Abhishek Banerjee'],
    formats: ['2D', '4DX'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60022',
    title: 'Jawan',
    description:
      'A high-octane emotional action thriller that outlines the journey of a man who is set out to rectify the wrongs in society with a team of fearless women soldiers.',
    genre: ['Action', 'Thriller', 'Drama'],
    duration: 169,
    language: 'Hindi',
    releaseDate: new Date('2023-09-07'),
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    rating: 8.0,
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    formats: ['IMAX 2D', '4DX', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60023',
    title: 'RRR: Rise Roar Revolt',
    description:
      'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspiring path of freedom against the despotic rulers.',
    genre: ['Action', 'Drama', 'Epic'],
    duration: 187,
    language: 'Hindi, Telugu',
    releaseDate: new Date('2022-03-25'),
    posterUrl: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy3986',
    rating: 8.8,
    director: 'S.S. Rajamouli',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    formats: ['IMAX 3D', '3D', '2D'],
    status: 'now_showing',
  },

  // --- UPCOMING INDIAN BLOCKBUSTERS (COMING SOON) ---
  {
    _id: '671d1001a1b2c3d4e5f60030',
    title: 'Pushpa 2: The Rule',
    description:
      'The clash heats up as Pushpa Raj expands his syndicate rule and faces off against IPS Bhanwar Singh Shekhawat in an explosive confrontation for regional supremacy.',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 175,
    language: 'Hindi, Telugu',
    releaseDate: new Date('2024-12-06'),
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=g3JUbgJBfnM',
    rating: 9.3,
    director: 'Sukumar',
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'],
    formats: ['IMAX 2D', '4DX', '2D'],
    status: 'coming_soon',
  },
  {
    _id: '671d1001a1b2c3d4e5f60031',
    title: 'Singham Again',
    description:
      'Bajirao Singham joins forces with the entire YRF and Rohit Shetty cop universe including Sooryavanshi, Simmba, and Shakti Shetty to combat an international terrorist syndicate.',
    genre: ['Action', 'Drama', 'Crime'],
    duration: 162,
    language: 'Hindi',
    releaseDate: new Date('2024-11-01'),
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    rating: 8.5,
    director: 'Rohit Shetty',
    cast: ['Ajay Devgn', 'Kareena Kapoor', 'Ranveer Singh', 'Deepika Padukone', 'Akshay Kumar'],
    formats: ['IMAX 2D', '2D'],
    status: 'coming_soon',
  },
  {
    _id: '671d1001a1b2c3d4e5f60032',
    title: 'War 2',
    description:
      'Major Kabir Dhaliwal returns for another adrenaline-fueled international espionage mission where secrets run deep and allies become deadly rivals.',
    genre: ['Action', 'Spy Thriller'],
    duration: 156,
    language: 'Hindi',
    releaseDate: new Date('2025-08-14'),
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=tQ0mzXRk-oM',
    rating: 8.9,
    director: 'Ayan Mukerji',
    cast: ['Hrithik Roshan', 'Jr. NTR', 'Kiara Advani'],
    formats: ['IMAX 3D', '4DX', '2D'],
    status: 'coming_soon',
  },
  {
    _id: '671d1001a1b2c3d4e5f60033',
    title: 'Kantara: A Legend Chapter 1',
    description:
      'The ancient origins of the demigod Panjurli and the folklore forest tribe that sparked a centuries-old spiritual warfare between mortals and divine forces.',
    genre: ['Action', 'Mythology', 'Thriller'],
    duration: 152,
    language: 'Kannada, Hindi',
    releaseDate: new Date('2025-10-02'),
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=8mrVmf24_dA',
    rating: 9.1,
    director: 'Rishab Shetty',
    cast: ['Rishab Shetty', 'Kishore', 'Sapthami Gowda'],
    formats: ['IMAX 2D', '2D'],
    status: 'coming_soon',
  },

  // --- HOLLYWOOD BLOCKBUSTERS ---
  {
    _id: '671d1001a1b2c3d4e5f60001',
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    duration: 166,
    language: 'English',
    releaseDate: new Date('2024-03-01'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520QIe.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.6,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    formats: ['IMAX 3D', '4DX', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60002',
    title: 'Deadpool & Wolverine',
    description:
      'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: 128,
    language: 'English',
    releaseDate: new Date('2024-07-26'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/9l1eZiJHmhr5jA625egvdngLwUT.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    rating: 8.0,
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    formats: ['IMAX 3D', '3D', '4DX', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60003',
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the deep moral and geopolitical consequences that followed.',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: 'English',
    releaseDate: new Date('2023-07-21'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    rating: 8.9,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    formats: ['IMAX 2D', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60004',
    title: 'Avatar: The Way of Water',
    description:
      'Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, and the battles they fight to stay alive.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    duration: 192,
    language: 'English',
    releaseDate: new Date('2022-12-16'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZIMQvRjrqqw.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    rating: 7.7,
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang'],
    formats: ['IMAX 3D', '4DX', '3D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60007',
    title: 'Interstellar',
    description:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: 169,
    language: 'English',
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/rAiYTsqzrxtvoUw85mbtx1qmgr2.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    formats: ['IMAX 2D', '2D'],
    status: 'now_showing',
  },
  {
    _id: '671d1001a1b2c3d4e5f60006',
    title: 'Gladiator II',
    description:
      'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genre: ['Action', 'Drama', 'History'],
    duration: 148,
    language: 'English',
    releaseDate: new Date('2024-11-22'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL69ovr.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    rating: 7.5,
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    formats: ['IMAX 2D', '4DX', '2D'],
    status: 'now_showing',
  },
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const todayStr = today.toISOString().split('T')[0];
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const theatres = [
  { name: 'PVR ICON: Gold Class', location: 'Phoenix Mall, Downtown' },
  { name: 'Cinepolis IMAX 3D', location: 'Grand Galleria' },
  { name: 'INOX Megaplex 4DX', location: 'City Center Mall' },
];

const initialShows = [];
let showIdCounter = 1;

initialMovies.forEach((movie, idx) => {
  const theatre = theatres[idx % theatres.length];
  const formatsAvailable = movie.formats || ['2D', 'IMAX 3D'];

  // Add 2 showtimes today
  initialShows.push({
    _id: `671d2001a1b2c3d4e5f6${String(showIdCounter++).padStart(4, '0')}`,
    movie: movie,
    theatreName: theatre.name,
    theatreLocation: theatre.location,
    screenType: formatsAvailable[0] || '2D',
    showDate: todayStr,
    showTime: idx % 2 === 0 ? '02:00 PM' : '04:15 PM',
    ticketPrice: { regular: 220, premium: 380, vip: 550 },
    totalSeats: 60,
    bookedSeats: ['B3', 'B4', 'C5'],
  });

  initialShows.push({
    _id: `671d2001a1b2c3d4e5f6${String(showIdCounter++).padStart(4, '0')}`,
    movie: movie,
    theatreName: theatre.name,
    theatreLocation: theatre.location,
    screenType: formatsAvailable[1] || formatsAvailable[0] || '2D',
    showDate: todayStr,
    showTime: '07:30 PM',
    ticketPrice: { regular: 250, premium: 420, vip: 600 },
    totalSeats: 60,
    bookedSeats: ['D1', 'D2', 'E4'],
  });

  // Add 1 showtime tomorrow
  initialShows.push({
    _id: `671d2001a1b2c3d4e5f6${String(showIdCounter++).padStart(4, '0')}`,
    movie: movie,
    theatreName: theatre.name,
    theatreLocation: theatre.location,
    screenType: formatsAvailable[0] || '2D',
    showDate: tomorrowStr,
    showTime: '06:00 PM',
    ticketPrice: { regular: 240, premium: 400, vip: 580 },
    totalSeats: 60,
    bookedSeats: ['A1', 'C2'],
  });
});

const initialUsers = [
  {
    _id: '671d3001a1b2c3d4e5f60001',
    name: 'System Admin',
    email: 'admin@imovies.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+1 800 555 0199',
  },
  {
    _id: '671d3001a1b2c3d4e5f60002',
    name: 'John Doe',
    email: 'demo@imovies.com',
    password: bcrypt.hashSync('demo123', 10),
    role: 'user',
    phone: '+1 555 123 4567',
  },
];

const initialBookings = [
  {
    _id: '671d4001a1b2c3d4e5f60001',
    user: initialUsers[1],
    show: initialShows[0],
    movie: initialMovies[0],
    seats: ['B3', 'B4'],
    seatDetails: [
      { seatNumber: 'B3', tier: 'VIP', price: 550 },
      { seatNumber: 'B4', tier: 'VIP', price: 550 },
    ],
    totalAmount: 1100,
    bookingReference: 'CV-DEMO-9901',
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date(),
  },
];

const mockStore = {
  movies: [...initialMovies],
  shows: [...initialShows],
  users: [...initialUsers],
  bookings: [...initialBookings],
};

module.exports = mockStore;
