const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

const sampleMovies = [
  {
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
    title: 'Avatar: The Way of Water',
    description:
      'Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
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
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    language: 'English',
    releaseDate: new Date('2023-06-02'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 8.7,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    formats: ['IMAX 3D', '3D', '2D'],
    status: 'now_showing',
  },
  {
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
  {
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
    title: 'Top Gun: Maverick',
    description:
      'After more than thirty years of service as one of the Navy’s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.',
    genre: ['Action', 'Drama'],
    duration: 130,
    language: 'English',
    releaseDate: new Date('2022-05-27'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/AaV1YIdWKnjAiaOe0UUK23Luvio.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=giXco2nxYKg',
    rating: 8.3,
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm'],
    formats: ['IMAX 2D', '4DX', '2D'],
    status: 'now_showing',
  },
  {
    title: 'The Batman',
    description:
      'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 176,
    language: 'English',
    releaseDate: new Date('2022-03-04'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    rating: 7.8,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    formats: ['IMAX 2D', '2D'],
    status: 'now_showing',
  },
  {
    title: 'Avengers: Endgame',
    description:
      'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos’ actions and restore balance to the universe.',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    duration: 181,
    language: 'English',
    releaseDate: new Date('2019-04-26'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    rating: 8.4,
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    formats: ['IMAX 3D', '3D', '4DX', '2D'],
    status: 'now_showing',
  },
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    language: 'English',
    releaseDate: new Date('2010-07-16'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    formats: ['IMAX 2D', '2D'],
    status: 'now_showing',
  },
  {
    title: 'Joker: Folie à Deux',
    description:
      'Failed comedian Arthur Fleck meets the love of his life, Harley Quinn, while incarcerated at Arkham State Hospital. Upon his release, the two embark on a doomed, musical romantic misadventure.',
    genre: ['Crime', 'Drama', 'Musical'],
    duration: 138,
    language: 'English',
    releaseDate: new Date('2024-10-04'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/uGmYqxh8flqkM27zbv457f5Bsao.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=_OKAwz2NiOI',
    rating: 6.8,
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Lady Gaga', 'Brendan Gleeson', 'Catherine Keener'],
    formats: ['IMAX 2D', '2D'],
    status: 'now_showing',
  },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Clearing existing collections...');

    await User.deleteMany({});
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const demoPassword = await bcrypt.hash('demo123', salt);

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@imovies.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1 800 555 0199',
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'demo@imovies.com',
      password: demoPassword,
      role: 'user',
      phone: '+1 555 123 4567',
    });

    console.log('Admin and Demo users created successfully.');
    console.log('Inserting movies...');

    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`Inserted ${insertedMovies.length} blockbuster movies.`);

    // Today & Tomorrow formatted as YYYY-MM-DD
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log('Generating showtimes across cinema multiplexes...');
    const theatres = [
      { name: 'PVR ICON: Gold Class', location: 'Phoenix Mall, Downtown' },
      { name: 'Cinepolis IMAX 3D', location: 'Grand Galleria' },
      { name: 'INOX Megaplex 4DX', location: 'City Center Mall' },
    ];

    const showsToCreate = [];

    insertedMovies.forEach((movie, index) => {
      const theatre = theatres[index % theatres.length];
      const formatsAvailable = movie.formats || ['2D', 'IMAX 3D'];

      // Show 1: Today afternoon
      showsToCreate.push({
        movie: movie._id,
        theatreName: theatre.name,
        theatreLocation: theatre.location,
        screenType: formatsAvailable[0] || '2D',
        showDate: todayStr,
        showTime: '02:00 PM',
        ticketPrice: { regular: 220, premium: 380, vip: 550 },
        totalSeats: 60,
        bookedSeats: ['B3', 'B4', 'C5'],
      });

      // Show 2: Today prime time evening
      showsToCreate.push({
        movie: movie._id,
        theatreName: theatre.name,
        theatreLocation: theatre.location,
        screenType: formatsAvailable[1] || formatsAvailable[0] || '2D',
        showDate: todayStr,
        showTime: '07:30 PM',
        ticketPrice: { regular: 250, premium: 420, vip: 600 },
        totalSeats: 60,
        bookedSeats: ['D1', 'D2', 'E4', 'E5'],
      });

      // Show 3: Tomorrow evening
      showsToCreate.push({
        movie: movie._id,
        theatreName: theatre.name,
        theatreLocation: theatre.location,
        screenType: formatsAvailable[0] || '2D',
        showDate: tomorrowStr,
        showTime: '06:00 PM',
        ticketPrice: { regular: 240, premium: 400, vip: 580 },
        totalSeats: 60,
        bookedSeats: ['A3', 'C3'],
      });
    });

    const createdShows = await Show.insertMany(showsToCreate);
    console.log(`Created ${createdShows.length} showtimes!`);

    // Create a sample booking for demo user
    const sampleShow = createdShows[0];
    await Booking.create({
      user: demoUser._id,
      show: sampleShow._id,
      movie: sampleShow.movie,
      seats: ['B3', 'B4'],
      seatDetails: [
        { seatNumber: 'B3', tier: 'Premium', price: 380 },
        { seatNumber: 'B4', tier: 'Premium', price: 380 },
      ],
      totalAmount: 760,
      bookingReference: 'IM-DEMO-9901',
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    });

    console.log('Sample booking generated.');
    console.log('=============================================');
    console.log('Database Seeding Complete!');
    console.log(`Movies in database: ${insertedMovies.length}`);
    console.log(`Showtimes scheduled: ${createdShows.length}`);
    console.log('Admin Account: admin@imovies.com / admin123');
    console.log('Demo Account:  demo@imovies.com  / demo123');
    console.log('=============================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
