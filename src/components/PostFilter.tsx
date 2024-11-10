// src/components/PostFilter.tsx

import React, { useState } from 'react';
import './PostFilter.scss';

interface PostFilterProps {
  tags: string[];
  businesses: string[];
  onApplyFilters: (selectedTags: string[], selectedBusinesses: string[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const PostFilter: React.FC<PostFilterProps> = ({ tags, businesses, onApplyFilters, isExpanded, onToggleExpand }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleBusinessChange = (business: string) => {
    setSelectedBusinesses((prev) =>
      prev.includes(business) ? prev.filter((b) => b !== business) : [...prev, business]
    );
  };

  const applyFilters = () => {
    onApplyFilters(selectedTags, selectedBusinesses);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedBusinesses([]);
    onApplyFilters([], []); // Automatically show all posts
  };

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBusinesses = businesses.filter((business) =>
    business.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isExpanded) return null; // Render nothing if the filter is not expanded

  return (
    <div className="post-filter-container">
      <div className="filter-header">
        <span>Filters</span>
        <button className="clear-filters-btn" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search filters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filter-content">
        <div className="filter-section">
          <h3>Tags</h3>
          {filteredTags.map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h3>Businesses</h3>
          {filteredBusinesses.map((business) => (
            <label key={business}>
              <input
                type="checkbox"
                checked={selectedBusinesses.includes(business)}
                onChange={() => handleBusinessChange(business)}
              />
              {business}
            </label>
          ))}
        </div>
      </div>

      <div className="apply-button-container">
        <button className="apply-button" onClick={applyFilters}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default PostFilter;
