import React, { useState } from "react";
import { BackIcon, HeartIcon, CommentIcon, ShareIcon } from "../svgIcons";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";

interface PinDetailsProps {
  pinId: string;
}

interface PinData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
}

// Mock data for now - this would come from your API
const mockPinData: PinData = {
  id: "1",
  imageUrl:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  title: "Minimalist Living Room Design",
  description:
    "A beautiful minimalist living room featuring clean lines, neutral colors, and modern furniture. Perfect inspiration for creating a serene and organized living space that promotes calm and focus.",
  author: "Design Studio",
  authorAvatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  tags: [
    "interior design",
    "minimalist",
    "living room",
    "modern",
    "neutral colors",
  ],
  likes: 1247,
  isLiked: false,
  comments: [
    {
      id: "1",
      author: "Sarah Johnson",
      content: "Love this aesthetic! Where can I find similar furniture?",
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      author: "Mike Chen",
      content:
        "The lighting in this room is perfect. Really creates a warm atmosphere.",
      createdAt: "5 hours ago",
    },
    {
      id: "3",
      author: "Emma Wilson",
      content: "This is exactly the vibe I want for my new apartment!",
      createdAt: "1 day ago",
    },
  ],
  createdAt: "3 days ago",
};

export const PinDetails: React.FC<PinDetailsProps> = ({ pinId }) => {
  // In a real app, you'd fetch the pin data based on pinId
  const pin = mockPinData;

  const [isLiked, setIsLiked] = useState(pin.isLiked || false);
  const [likesCount, setLikesCount] = useState(pin.likes);

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          icon={<BackIcon className="h-5 w-5" />}
          onClick={() => window.history.back()}
          className="text-text-secondary hover:text-text-primary">
          Back to Gallery
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-card">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-auto object-cover"
            />
            {/* Like Button Overlay */}
            <div className="absolute top-4 right-4">
              <Button
                variant={isLiked ? "primary" : "secondary"}
                size="md"
                icon={
                  <HeartIcon
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                }
                className={`rounded-full shadow-lg ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                onClick={handleLikeToggle}>
                {isLiked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                icon={
                  <HeartIcon
                    className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`}
                  />
                }
                className="text-text-secondary hover:text-primary"
                onClick={handleLikeToggle}>
                {likesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<CommentIcon className="h-5 w-5" />}
                className="text-text-secondary hover:text-primary">
                {pin.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<ShareIcon className="h-5 w-5" />}
                className="text-text-secondary hover:text-primary">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Pin Info */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              {pin.title}
            </h1>
            <p className="text-text-secondary leading-relaxed">
              {pin.description}
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
            <Avatar src={pin.authorAvatar} name={pin.author} size="lg" />
            <div>
              <h3 className="font-semibold text-text-primary">{pin.author}</h3>
              <p className="text-sm text-text-secondary">
                Posted {pin.createdAt}
              </p>
            </div>
            <div className="ml-auto">
              <Button variant="primary" size="sm">
                Follow
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {pin.tags.map((tag, index) => (
                <Tag
                  key={index}
                  variant="default"
                  clickable
                  onClick={() => console.log(`Clicked tag: ${tag}`)}>
                  #{tag}
                </Tag>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">
              Comments ({pin.comments.length})
            </h3>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <Avatar name="User" size="sm" />
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="primary" size="sm">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {pin.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar name={comment.author} size="sm" />
                  <div className="flex-1">
                    <div className="bg-card rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-text-primary text-sm">
                          {comment.author}
                        </h4>
                        <span className="text-xs text-text-tertiary">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
