import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./../components/Navbar.tsx";
import PostCard from "./../components/PostCard.tsx";
import PostFilter from "./../components/PostFilter.tsx"; // Import PostFilter component
import { Skeleton, Row, Col, Empty } from "antd";
import { formatDate, getLocalStorageItem } from "../utils/utils";
import {
  handleSearch,
  handleUpvote,
  handleDownvote,
} from "../utils/postActions";
import { Post } from "../types/Post";

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableBusinesses, setAvailableBusinesses] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  const statusColors: Record<string, string> = {
    draft: "#4D4D4D", // Dark gray: Represents unfinished, neutral state.
    "in review": "#B47300", // Amber: Caution, reflects evaluation or pending action.
    approved: "#1B5E20", // Dark green: Positivity, success, and approval.
    "in development": "#004B8D", // Navy blue: Progress, professional, and active work.
    testing: "#8B4500", // Brownish orange: Critical stage and focus on finding errors.
    completed: "#4A0072", // Deep purple: Finality and elegance for completed tasks.
    archived: "#5D4037", // Earthy brown: Historical, inactive, and stored items.
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log("GETTING MY POSTS");
        const token = getLocalStorageItem("authToken");
        const userId = getLocalStorageItem("userId");

        const response = await API.get("/api/posts/myposts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
        });

        if (response.data.message === "No posts found for this user") {
          setPosts([]);
          setFilteredPosts([]);
        } else {
          setPosts(response.data);
          setFilteredPosts(response.data);

          // Extract tags and businesses for filter options
          const tags = Array.from(
            new Set(response.data.flatMap((post: Post) => post.tags || []))
          ) as string[];
          const businesses = Array.from(
            new Set(response.data.flatMap((post: Post) => post.business || []))
          ) as string[];

          setAvailableTags(tags);
          setAvailableBusinesses(businesses);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleSearchPosts = (query: string) => {
    setFilteredPosts(handleSearch(posts, query));
  };

  const applyFilters = (
    selectedTags: string[],
    selectedBusinesses: string[]
  ) => {
    const filtered = posts.filter(
      (post) =>
        (selectedTags.length === 0 ||
          (post.tags && post.tags.some((tag) => selectedTags.includes(tag)))) &&
        (selectedBusinesses.length === 0 ||
          (post.business &&
            post.business.some((business) =>
              selectedBusinesses.includes(business)
            )))
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return (
      <>
        <Navbar expandFilter={() => {}} />
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Col>
          ))}
        </Row>
      </>
    );
  }

  return (
    <>
      <Navbar
        onSearch={handleSearchPosts}
        expandFilter={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      {isFilterExpanded && (
        <PostFilter
          tags={availableTags}
          businesses={availableBusinesses}
          onApplyFilters={applyFilters}
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(false)}
        />
      )}

      <div
        style={{
          padding: "20px",
          marginLeft: isFilterExpanded ? "300px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {filteredPosts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                index={index}
                statusColors={statusColors}
                formatDate={formatDate}
                handleUpvote={() =>
                  handleUpvote(
                    post._id,
                    post.isUpvoted,
                    index,
                    filteredPosts,
                    setFilteredPosts
                  )
                }
                handleDownvote={() =>
                  handleDownvote(
                    post._id,
                    post.isDownvoted,
                    index,
                    filteredPosts,
                    setFilteredPosts
                  )
                }
              />
            ))}
          </Row>
        ) : (
          <Empty description="No Posts Found" style={{ marginTop: "20px" }} />
        )}
      </div>
    </>
  );
};

export default MyPosts;
