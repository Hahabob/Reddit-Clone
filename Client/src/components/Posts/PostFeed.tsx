import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { PostCard } from "./PostCard";
import { SearchResults } from "../Search/SearchResults";
import { SortDropdown } from "./SortDropdown";
import { ViewDropdown } from "./ViewDropdown";
import { LocationDropdown } from "./LocationDropdown";
import { SortDropdown } from "./SortDropdown";
import { ViewDropdown } from "./ViewDropdown";
import { LocationDropdown } from "./LocationDropdown";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { redditApiService } from "../../services/redditApi";
import type { RedditPost } from "../../types/reddit";
import { cn } from "../../lib/utils";

export interface PostFeedRef {
  handleSearch: (
    query: string,
    sort?: "relevance" | "hot" | "top" | "new" | "comments",
    time?: "hour" | "day" | "week" | "month" | "year" | "all"
  ) => void;
  goToHome: () => void;
}

export const PostFeed = forwardRef<PostFeedRef>((_, ref) => {
  const { isDarkMode } = useTheme();
  const { socket, isConnected } = useSocket();
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "best" | "hot" | "new" | "top" | "rising"
  >("best");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");
  const [location, setLocation] = useState<string>("everywhere");
    "best" | "hot" | "new" | "top" | "rising"
  >("best");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");
  const [location, setLocation] = useState<string>("everywhere");
  const [after, setAfter] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RedditPost[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (sort: typeof sortBy, loadMore: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

      // Map "best" to "hot" for API call
      const apiSort = sort === "best" ? "hot" : sort;

      // Filter posts by location (simulate location-based filtering)
      const [response] = await Promise.all([
        redditApiService.posts.getHomePosts(apiSort, {
          limit: 25,
          after: loadMore ? after : undefined,
        }),
        new Promise((resolve) => setTimeout(resolve, 300)), // Minimum 300ms loading
      ]);

      let filteredPosts = response.data.children.map((child) => child.data);

      // Apply location-based filtering
      if (location !== "everywhere") {
        const locationSubreddits = {
          "united-states": [
            "AskAnAmerican",
            "mildlyinfuriating",
            "WhitePeopleTwitter",
            "PublicFreakout",
            "unpopularopinion",
            "AmItheAsshole",
            "tifu",
            "LifeProTips",
            "Showerthoughts",
            "memes",
            "funny",
            "gaming",
            "pics",
            "videos",
            "worldnews",
            "news",
            "politics",
            "AskReddit",
            "explainlikeimfive",
            "todayilearned",
          ],
          israel: [
            "Israel",
            "israel",
            "hebrew",
            "Judaism",
            "Jewish",
            "TelAviv",
            "Jerusalem",
            "IsraelPalestine",
            "IsraelConflict",
            "IsraelNews",
            "IsraelPolitics",
          ],
          germany: [
            "de",
            "germany",
            "berlin",
            "munich",
            "hamburg",
            "cologne",
            "frankfurt",
            "AskAGerman",
            "Germany",
            "deutschland",
            "German",
            "Bavaria",
          ],
          france: [
            "france",
            "paris",
            "lyon",
            "marseille",
            "AskFrance",
            "France",
            "french",
            "Rance",
            "frenchmemes",
            "FranceLibre",
          ],
          "united-kingdom": [
            "unitedkingdom",
            "AskUK",
            "london",
            "manchester",
            "birmingham",
            "glasgow",
            "liverpool",
            "leeds",
            "sheffield",
            "bristol",
            "edinburgh",
            "scotland",
            "wales",
            "northernireland",
            "britishproblems",
            "casualuk",
          ],
          canada: [
            "canada",
            "AskACanadian",
            "toronto",
            "montreal",
            "vancouver",
            "calgary",
            "ottawa",
            "edmonton",
            "winnipeg",
            "quebec",
            "hamilton",
            "kitchener",
            "canadian",
            "onguardforthee",
            "metacanada",
          ],
          australia: [
            "australia",
            "AskAnAustralian",
            "sydney",
            "melbourne",
            "brisbane",
            "perth",
            "adelaide",
            "goldcoast",
            "newcastle",
            "wollongong",
            "hobart",
            "darwin",
            "australian",
            "straya",
            "AussieMemes",
          ],
          argentina: [
            "argentina",
            "AskArgentina",
            "buenosaires",
            "cordoba",
            "rosario",
            "mendoza",
            "laplata",
            "tucuman",
            "mardelplata",
            "salta",
            "santafe",
            "argentine",
          ],
          bulgaria: [
            "bulgaria",
            "AskBulgaria",
            "sofia",
            "plovdiv",
            "varna",
            "burgas",
            "ruse",
            "starazagora",
            "pleven",
            "sliven",
            "dobrich",
            "shumen",
            "bulgarian",
          ],
        };

        const targetSubreddits =
          locationSubreddits[location as keyof typeof locationSubreddits] || [];

        filteredPosts = filteredPosts.filter((post) => {
          const subredditLower = post.subreddit.toLowerCase();
          const titleLower = post.title.toLowerCase();
          const selftextLower = (post.selftext || "").toLowerCase();

          // Check if post is from a location-specific subreddit
          const isFromLocationSubreddit = targetSubreddits.some((sub) =>
            subredditLower.includes(sub.toLowerCase())
          );

          // Check if post contains location-specific keywords
          const locationKeywords = {
            "united-states": [
              "usa",
              "america",
              "united states",
              "us",
              "texas",
              "california",
              "new york",
              "florida",
              "chicago",
              "miami",
              "los angeles",
              "washington",
              "boston",
              "seattle",
              "trump",
              "biden",
              "congress",
              "senate",
              "house",
              "democrat",
              "republican",
            ],
            israel: [
              "israel",
              "israeli",
              "hebrew",
              "ישראל",
              "tel aviv",
              "jerusalem",
              "haifa",
              "beer sheva",
              "netanyahu",
              "gaza",
              "west bank",
              "palestine",
              "jewish",
              "judaism",
              "orthodox",
              "haredi",
            ],
            germany: [
              "germany",
              "german",
              "deutschland",
              "berlin",
              "munich",
              "hamburg",
              "cologne",
              "frankfurt",
              "stuttgart",
              "merkel",
              "bundestag",
              "bavaria",
              "ruhr",
              "hamburg",
            ],
            france: [
              "france",
              "french",
              "français",
              "paris",
              "lyon",
              "marseille",
              "toulouse",
              "nice",
              "macron",
              "le pen",
              "champs elysees",
              "eiffel",
              "louvre",
            ],
            "united-kingdom": [
              "uk",
              "britain",
              "england",
              "scotland",
              "wales",
              "london",
              "manchester",
              "birmingham",
              "glasgow",
              "liverpool",
              "leeds",
              "sheffield",
              "bristol",
              "edinburgh",
              "boris",
              "johnson",
              "tory",
              "labour",
              "brexit",
            ],
            canada: [
              "canada",
              "canadian",
              "toronto",
              "montreal",
              "vancouver",
              "calgary",
              "ottawa",
              "edmonton",
              "winnipeg",
              "quebec",
              "trudeau",
              "ontario",
              "british columbia",
              "alberta",
            ],
            australia: [
              "australia",
              "australian",
              "sydney",
              "melbourne",
              "brisbane",
              "perth",
              "adelaide",
              "gold coast",
              "newcastle",
              "wollongong",
              "hobart",
              "darwin",
              "scomo",
              "morrison",
              "queensland",
              "victoria",
            ],
            argentina: [
              "argentina",
              "argentine",
              "buenos aires",
              "córdoba",
              "rosario",
              "mendoza",
              "la plata",
              "tucumán",
              "mar del plata",
              "salta",
              "santa fe",
              "fernandez",
              "peron",
              "kirchner",
            ],
            bulgaria: [
              "bulgaria",
              "bulgarian",
              "sofia",
              "plovdiv",
              "varna",
              "burgas",
              "ruse",
              "stara zagora",
              "pleven",
              "sliven",
              "dobrich",
              "shumen",
              "borisov",
              "rusev",
            ],
          };

          const keywords =
            locationKeywords[location as keyof typeof locationKeywords] || [];
          const searchText = `${subredditLower} ${titleLower} ${selftextLower}`;

          const hasLocationKeywords = keywords.some((keyword) =>
            searchText.includes(keyword.toLowerCase())
          );

          return isFromLocationSubreddit || hasLocationKeywords;
        });

        console.log(
          `Location: ${location}, Found ${filteredPosts.length} relevant posts out of ${response.data.children.length} total posts`
        );
      }

      if (loadMore) {
        setPosts((prev) => [...prev, ...filteredPosts]);
      } else {
        setPosts(filteredPosts);
      }

        setAfter(response.data.after);
        setHasMore(!!response.data.after);
      } catch {
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [location, after]
  );

  // Load posts on component mount and when sort or location changes
  useEffect(() => {
    loadPosts(sortBy);
  }, [sortBy, location]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (socket) {
      socket.on("newPost", (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
      });

      socket.on("postUpdate", (updatedPost) => {
        setPosts((prev) =>
          prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      });

      return () => {
        socket.off("newPost");
        socket.off("postUpdate");
      };
    }
  }, [socket]);

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setAfter(undefined);
    setHasMore(true);
  };

  const handleViewChange = (newView: typeof viewMode) => {
    setViewMode(newView);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // Reload posts when location changes
    setAfter(undefined);
    setHasMore(true);
    loadPosts(sortBy);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPosts(sortBy, true);
    }
  };

  const handleSearch = async (
    query: string,
    sort: "relevance" | "hot" | "top" | "new" | "comments" = "relevance",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all"
  ) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchQuery(query);

      const response = await redditApiService.posts.searchPosts(
        query,
        sort,
        time,
        25
      );

      const searchPosts = response.data.children.map((child) => child.data);
      setSearchResults(searchPosts);
    } catch {
      setSearchError("Failed to search posts. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetrySearch = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const goToHome = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    loadPosts(sortBy);
  };

  useImperativeHandle(ref, () => ({
    handleSearch,
    goToHome,
  }));

  if (error) {
    return (
      <div
        className={cn(
          "p-8 text-center",
          isDarkMode ? "text-red-400" : "text-red-600"
        )}
      >
        <p className="text-lg font-medium">Error loading posts: {error}</p>
        <button
          onClick={() => loadPosts(sortBy)}
          className={cn(
            "mt-4 px-4 py-2 rounded-full",
            "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto lg:max-w-6xl">
      {isSearching || searchQuery ? (
        <SearchResults
          posts={searchResults}
          loading={isSearching}
          error={searchError}
          query={searchQuery}
          onRetry={handleRetrySearch}
        />
      ) : (
        <>
          <div
            className={`p-4 border-b ${
              isDarkMode ? "border-gray-900 bg-black" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-1">
              <SortDropdown
                currentSort={sortBy}
                onSortChange={handleSortChange}
              />
              <LocationDropdown
                currentLocation={location}
                onLocationChange={handleLocationChange}
              />
              <ViewDropdown
                currentView={viewMode}
                onViewChange={handleViewChange}
              />
            <div className="flex items-center space-x-1">
              <SortDropdown
                currentSort={sortBy}
                onSortChange={handleSortChange}
              />
              <LocationDropdown
                currentLocation={location}
                onLocationChange={handleLocationChange}
              />
              <ViewDropdown
                currentView={viewMode}
                onViewChange={handleViewChange}
              />
            </div>
          </div>
          <div className="p-4">
            {loading && posts.length === 0 ? (
              <div
                className={cn(
                  "min-h-screen",
                  isDarkMode ? "bg-gray-900" : "bg-white"
                )}
              ></div>
            ) : (
              <div
                className={viewMode === "compact" ? "space-y-1" : "space-y-4"}
              >
              <div
                className={viewMode === "compact" ? "space-y-1" : "space-y-4"}
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} viewMode={viewMode} />
                  <PostCard key={post.id} post={post} viewMode={viewMode} />
                ))}
                {hasMore && !loading && (
                  <div className="flex justify-center py-4">
                    <button
                      onClick={handleLoadMore}
                      className={cn(
                        "px-6 py-2 rounded-full font-medium",
                        "bg-orange-500 text-white hover:bg-orange-600"
                      )}
                    >
                      Load More
                    </button>
                  </div>
                )}
                {loading && posts.length > 0 && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {!isConnected && (
        <div
          className={cn(
            "fixed bottom-4 right-4 p-3 rounded-lg",
            isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          )}
        >
          <p className="text-sm">Disconnected from server</p>
        </div>
      )}
    </div>
  );
});
