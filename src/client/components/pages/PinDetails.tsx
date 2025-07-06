import React from "react";
import { BackIcon, HeartIcon, CommentIcon, ShareIcon } from "../svgIcons";

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

  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors">
          <BackIcon className="h-5 w-5 mr-2" />
          Back to Gallery
        </button>
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
            {/* Save Button Overlay */}
            <div className="absolute top-4 right-4">
              <button className="bg-primary hover:bg-primary-hover text-white rounded-full px-6 py-3 font-bold transition-colors shadow-lg">
                Save
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                <HeartIcon />
                <span>{pin.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                <CommentIcon />
                <span>{pin.comments.length}</span>
              </button>
              <button className="text-text-secondary hover:text-primary transition-colors">
                <ShareIcon />
              </button>
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
            <div className="w-12 h-12 rounded-full bg-gray-500 overflow-hidden">
              {pin.authorAvatar ? (
                <img
                  src={pin.authorAvatar}
                  alt={pin.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {pin.author.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{pin.author}</h3>
              <p className="text-sm text-text-secondary">
                Posted {pin.createdAt}
              </p>
            </div>
            <button className="ml-auto bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full font-medium transition-colors">
              Follow
            </button>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {pin.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-card hover:bg-card-hover rounded-full text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                  #{tag}
                </span>
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
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full font-medium transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {pin.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {comment.author.charAt(0)}
                  </div>
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
