import React from "react";
import { BlurHashImage, BlurHashImageWithCrossfade } from "../ui/BlurHashImage";

// Test component to verify BlurHash integration
export const BlurHashTest: React.FC = () => {
  // Sample blur hash from Unsplash for testing
  const testBlurHash = "LGF5?xYk^6#M@-5c,1J5@[or[Q6.";
  const testImageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4";

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">BlurHash Test Components</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic BlurHashImage</h3>
          <BlurHashImage
            src={testImageUrl}
            alt="Test Image"
            blurHash={testBlurHash}
            className="w-full h-64 rounded-lg"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            BlurHashImage with Crossfade
          </h3>
          <BlurHashImageWithCrossfade
            src={testImageUrl}
            alt="Test Image"
            blurHash={testBlurHash}
            className="w-full h-64 rounded-lg"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Without BlurHash (fallback)
        </h3>
        <BlurHashImageWithCrossfade
          src={testImageUrl}
          alt="Test Image"
          className="w-full h-64 rounded-lg"
        />
      </div>
    </div>
  );
};
