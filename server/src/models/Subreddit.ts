import { Document, Schema, model, ObjectId } from "mongoose";

interface ISubreddit extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  topics: string[];
  moderators: ObjectId[];
  members: ObjectId[];
  isNSFW: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CommunityTopic {
  Anime = "Anime",
  Arts = "Arts",
  Business = "Business",
  Education = "Education",
  Collectibles = "Collectibles & Other",
  EducationCareer = "Education & Career",
  FashionBeauty = "Fashion & Beauty",
  FoodDrinks = "Food & Drinks",
  HomeGarden = "Home & Garden",
  HumanitiesLaw = "Humanities & Law",
  Music = "Music",
  NatureOutdoors = "Nature & Outdoors",
  NewsPolitics = "News & Politics",
  PlacesTravel = "Places & Travel",
  Science = "Science",
  Sports = "Sports",
  Spooky = "Spooky",
  Vehicles = "Vehicles",
  Wellness = "Wellness",

  // Internet Culture
  Amazing = "Amazing",
  AnimalsPets = "Animals & Pets",
  CringeFacepalm = "Cringe & Facepalm",
  Funny = "Funny",
  Interesting = "Interesting",
  OddlySatisfying = "Oddly Satisfying",
  RedditMeta = "Reddit Meta",
  Wholesome = "Wholesome & Heartwarming",

  // Games
  Gaming = "Gaming",
  ActionGames = "Action Games",
  AdventureGames = "Adventure Games",
  Esports = "Esports",
  GamingConsoles = "Gaming Consoles & Gear",
  GamingNewsDiscussion = "Gaming News & Discussion",
  MobileGames = "Mobile Games",
  OtherGames = "Other Games",
  RPGames = "Role-Playing Games",
  SimulationGames = "Simulation Games",
  SportsRacingGames = "Sports & Racing Games",
  StrategyGames = "Strategy Games",
  TabletopGames = "Tabletop Games",

  // Q&As
  QAs = "Q&As",
  StoriesConfessions = "Stories & Confessions",

  // Technology
  Technology = "Technology",
  Printing3D = "3D Printing",
  AI_ML = "Artificial Intelligence & Machine Learning",
  ComputersHardware = "Computers & Hardware",
  ConsumerElectronics = "Consumer Electronics",
  DIYElectronics = "DIY Electronics",
  Programming = "Programming",
  Databases = "Databases",
  SoftwareApps = "Software & Apps",
  StreamingServices = "Streaming Services",
  TechNewsDiscussion = "Tech News & Discussion",
  VirtualAR = "Virtual & Augmented Reality",

  // Pop Culture
  Celebrities = "Celebrities",
  CreatorsInfluencers = "Creators & Influencers",
  GenerationsNostalgia = "Generations & Nostalgia",
  Podcasts = "Podcasts",
  Streamers = "Streamers",
  TarotAstrology = "Tarot & Astrology",

  // Movies & TV
  ActionMovies = "Action Movies & Series",
  AnimatedMovies = "Animated Movies & Series",
  ComedyMovies = "Comedy Movies & Series",
  CrimeThriller = "Crime, Mystery & Thriller Movies & Series",
  DocumentaryMovies = "Documentary Movies & Series",
  DramaMovies = "Drama Movies & Series",
  FantasyMovies = "Fantasy Movies & Series",
  HorrorMovies = "Horror Movies & Series",
  MoviesNewsDiscussion = "Movies News & Discussion",
  RealityTV = "Reality TV",
  RomanceMovies = "Romance Movies & Series",
  SciFiMovies = "Sci-Fi Movies & Series",
  SuperheroMovies = "Superhero Movies & Series",
  TVNewsDiscussion = "TV News & Discussion",
}

const subredditSchema = new Schema<ISubreddit>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    iconUrl: {
      type: String,
      default: "",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    topics: {
      type: [
        {
          type: String,
          enum: Object.values(CommunityTopic),
        },
      ],
      validate: [
        {
          validator: (arr: string[]) => arr.length <= 3,
          message: "A subreddit can have at most 3 topics.",
        },
      ],
      default: [],
    },
    moderators: [
      {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    members: [
      {
        type: Schema.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    isNSFW: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Subreddit = model<ISubreddit>("Subreddit", subredditSchema);
export default Subreddit;
