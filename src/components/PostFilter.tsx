import React, { useState, useEffect } from "react";
import "./PostFilter.scss";
import { Input, Checkbox } from "antd";
const { Search } = Input;
import type { CheckboxProps } from "antd";

interface PostFilterProps {
  tags: string[];
  businesses: string[];
  onApplyFilters: (
    selectedTags: string[],
    selectedBusinesses: string[]
  ) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const PostFilter: React.FC<PostFilterProps> = ({
  tags,
  businesses,
  onApplyFilters,
  isExpanded,
  onToggleExpand,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Applied tags
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]); // Applied businesses

  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>([]); // Temporary tags
  const [tempSelectedBusinesses, setTempSelectedBusinesses] = useState<
    string[]
  >([]); // Temporary businesses
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (isExpanded) {
      // Sync temporary selections with applied filters when the panel is opened
      setTempSelectedTags(selectedTags);
      setTempSelectedBusinesses(selectedBusinesses);
    }
  }, [isExpanded, selectedTags, selectedBusinesses]);

  const handleTagChange = (tag: string) => {
    setTempSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleBusinessChange = (business: string) => {
    setTempSelectedBusinesses((prev) =>
      prev.includes(business)
        ? prev.filter((b) => b !== business)
        : [...prev, business]
    );
  };

  const applyFilters = () => {
    setSelectedTags(tempSelectedTags);
    setSelectedBusinesses(tempSelectedBusinesses);
    onApplyFilters(tempSelectedTags, tempSelectedBusinesses);
  };

  const clearAllFilters = () => {
    setTempSelectedTags([]);
    setTempSelectedBusinesses([]);
    setSearchTerm("");
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
        <h2>Filters</h2>
        <button className="clear-filters-btn" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>
      <Search
        type="search"
        placeholder="Search filters..."
        value={searchTerm}
        style={{ marginRight: "20px", padding: "8px 16px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
      ></Search>

      <div className="filter-content">
        <h3>Tags</h3>
        <div className="filter-section">
          {filteredTags.map((tag) => (
            <Checkbox
              checked={tempSelectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
            >
              {tag}
            </Checkbox>
          ))}
        </div>

        <h3>Businesses</h3>
        <div className="filter-section">
          {filteredBusinesses.map((business) => (
            <Checkbox
              checked={tempSelectedBusinesses.includes(business)}
              onChange={() => handleBusinessChange(business)}
            >
              {business}
            </Checkbox>
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
