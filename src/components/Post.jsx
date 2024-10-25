// // src/components/Post.jsx
// import React, { useState } from 'react';
// import { Button, Input, Comment, Tooltip } from 'antd';
// import { 
//   ArrowUpOutlined, 
//   ArrowDownOutlined, 
//   CommentOutlined, 
//   ShareAltOutlined 
// } from '@ant-design/icons';
// import '../App.css';

// function Post({ post }) {
//   const [upvotes, setUpvotes] = useState(post.upvotes);
//   const [downvotes, setDownvotes] = useState(post.downvotes);
//   const [comments, setComments] = useState(post.comments || []);
//   const [newComment, setNewComment] = useState('');
//   const [showCommentBox, setShowCommentBox] = useState(false);

//   const handleUpvote = () => setUpvotes(upvotes + 1);
//   const handleDownvote = () => setDownvotes(downvotes + 1);

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       setComments([...comments, newComment]);
//       setNewComment('');
//     }
//   };

//   const toggleCommentBox = () => setShowCommentBox(!showCommentBox);

//   return (
//     <div className="post">
//       {/* Post Content */}
//       <div className="post-content">
//         <h3>{post.title}</h3>
//         <p>{post.description}</p>
//       </div>

//       {/* Upvote/Downvote Section */}
//       <div className="post-actions">
//         <div className="vote-buttons">
//           <Tooltip title="Upvote">
//             <Button type="text" icon={<ArrowUpOutlined />} onClick={handleUpvote} />
//           </Tooltip>
//           <span className="vote-count">{upvotes - downvotes}</span>
//           <Tooltip title="Downvote">
//             <Button type="text" icon={<ArrowDownOutlined />} onClick={handleDownvote} />
//           </Tooltip>
//         </div>

//         {/* Comment Button */}
//         <Button 
//           type="text" 
//           icon={<CommentOutlined />} 
//           onClick={toggleCommentBox}
//         >
//           {comments.length} Comments
//         </Button>

//         {/* Share Button */}
//         <Button type="text" icon={<ShareAltOutlined />}>
//           Share
//         </Button>
//       </div>

//       {/* Comment Section */}
//       {showCommentBox && (
//         <div className="comments-section">
//           <div className="add-comment">
//             <Input 
//               value={newComment} 
//               onChange={(e) => setNewComment(e.target.value)} 
//               placeholder="Add a comment..."
//               onPressEnter={handleAddComment}
//             />
//             <Button onClick={handleAddComment}>Post</Button>
//           </div>
//           {comments.map((comment, index) => (
//             <Comment key={index} content={comment} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Post;

// src/components/Post.jsx
import React, { useState } from 'react';
import API from '../api';
import { Button, Input, Tooltip } from 'antd';
// import { Comment } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import './Post.css';

function Post({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleUpvote = () => setUpvotes(upvotes + 1);
  const handleDownvote = () => setDownvotes(downvotes + 1);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, newComment];
      await API.put(`/api/posts/${post.id}`, { comments: updatedComments });
      setComments(updatedComments);
      setNewComment('');
    }
  };

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div className="post-actions">
        <Tooltip title="Upvote">
          <Button icon={<ArrowUpOutlined />} onClick={handleUpvote} />
        </Tooltip>
        <span>{upvotes - downvotes}</span>
        <Tooltip title="Downvote">
          <Button icon={<ArrowDownOutlined />} onClick={handleDownvote} />
        </Tooltip>
        <Button icon={<CommentOutlined />}>{comments.length} Comments</Button>
        <Button icon={<ShareAltOutlined />}>Share</Button>
      </div>

      <div className="comments-section">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          onPressEnter={handleAddComment}
        />
        {comments.map((comment, index) => (
          <Comment key={index} content={comment} />
        ))}
      </div>
    </div>
  );
}

export default Post;
