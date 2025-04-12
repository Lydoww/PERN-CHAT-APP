// components/AvatarWithSkeleton.tsx
import { useState } from "react";

type AvatarWithSkeletonProps = {
  src: string;
  isOnline?: boolean;
  size?: "sm" | "md";
};

const AvatarWithSkeleton = ({ src, isOnline = false, size = "md" }: AvatarWithSkeletonProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-12 h-12";

  return (
    <div className={`avatar relative ${sizeClasses}`}>
      <div className={`rounded-full overflow-hidden ${sizeClasses}`}>
        {!imageLoaded && (
          <div className={`bg-gray-600 animate-pulse ${sizeClasses} rounded-full`}></div>
        )}
        <img
          src={src}
          alt="user avatar"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover ${sizeClasses} ${imageLoaded ? "block" : "hidden"}`}
        />
      </div>
      {isOnline && imageLoaded && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default AvatarWithSkeleton;