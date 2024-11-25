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
