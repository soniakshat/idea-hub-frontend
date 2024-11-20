import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./../components/Navbar.tsx";
import PostCard from "./../components/PostCard.tsx";
import PostFilter from "./../components/PostFilter.tsx";
import { Skeleton, Row, Col, message } from "antd";
import { formatDate, getLocalStorageItem } from "../utils/utils";
import {
  handleSearch,
  handleUpvote,
  handleDownvote,
} from "../utils/postActions";
import { Post } from "../types/Post";

function Home() {
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
    const fetchPosts = async () => {
      try {
        const token = getLocalStorageItem("authToken");
        if (!token) {
          console.error("Authorization token is missing.");
          return;
        }

        const response = await API.get("/api/posts/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data);
        setFilteredPosts(response.data);

        const tags = Array.from(
          new Set(response.data.flatMap((post: Post) => post.tags || []))
        ) as string[];
        const businesses = Array.from(
          new Set(response.data.flatMap((post: Post) => post.business || []))
        ) as string[];

        setAvailableTags(tags);
        setAvailableBusinesses(businesses);
      } catch (error) {
        console.error("Error fetching posts:", error);
        message.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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

  const handlePostDelete = (deletedPostId: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
    setFilteredPosts((prevFilteredPosts) =>
      prevFilteredPosts.filter((post) => post._id !== deletedPostId)
    );
    message.success("Post deleted successfully!");
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
        expandFilter={() => setIsFilterExpanded(!isFilterExpanded)} // Toggle the filter pane
      />

      {isFilterExpanded && (
        <PostFilter
          tags={availableTags}
          businesses={availableBusinesses}
          onApplyFilters={applyFilters}
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(false)} // Close the filter pane
        />
      )}

      <div
        style={{
          padding: "20px",
          marginLeft: isFilterExpanded ? "300px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
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
              onDelete={handlePostDelete} // Pass post deletion handler to PostCard
            />
          ))}
        </Row>
      </div>
    </>
  );
}

export default Home;
