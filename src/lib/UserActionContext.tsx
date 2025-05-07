
import React, { createContext, useContext, useState, ReactNode } from 'react';

type VisitedAttraction = {
  attractionId: string;
  visitDate: Date;
  hasRated: boolean;
  hasUploaded: boolean;
};

type Review = {
  id: string;
  attractionId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
};

type UploadedImage = {
  id: string;
  attractionId: string;
  url: string;
  uploadDate: Date;
};

interface UserActionContextType {
  visitedAttractions: Record<string, VisitedAttraction>;
  reviews: Review[];
  uploadedImages: UploadedImage[];
  registerVisit: (attractionId: string) => void;
  hasVisited: (attractionId: string) => boolean;
  markAsRated: (attractionId: string) => void;
  markAsUploaded: (attractionId: string) => void;
  getVisitInfo: (attractionId: string) => VisitedAttraction | null;
  addReview: (attractionId: string, userName: string, rating: number, comment: string) => void;
  getReviewsForAttraction: (attractionId: string) => Review[];
  addUploadedImage: (attractionId: string, url: string) => void;
  getImagesForAttraction: (attractionId: string) => UploadedImage[];
}

const UserActionContext = createContext<UserActionContextType | undefined>(undefined);

export const UserActionProvider = ({ children }: { children: ReactNode }) => {
  const [visitedAttractions, setVisitedAttractions] = useState<Record<string, VisitedAttraction>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const registerVisit = (attractionId: string) => {
    setVisitedAttractions(prev => ({
      ...prev,
      [attractionId]: {
        attractionId,
        visitDate: new Date(),
        hasRated: false,
        hasUploaded: false,
      },
    }));
  };

  const hasVisited = (attractionId: string) => {
    return attractionId in visitedAttractions;
  };

  const markAsRated = (attractionId: string) => {
    if (hasVisited(attractionId)) {
      setVisitedAttractions(prev => ({
        ...prev,
        [attractionId]: {
          ...prev[attractionId],
          hasRated: true,
        },
      }));
    }
  };

  const markAsUploaded = (attractionId: string) => {
    if (hasVisited(attractionId)) {
      setVisitedAttractions(prev => ({
        ...prev,
        [attractionId]: {
          ...prev[attractionId],
          hasUploaded: true,
        },
      }));
    }
  };

  const getVisitInfo = (attractionId: string): VisitedAttraction | null => {
    return visitedAttractions[attractionId] || null;
  };

  const addReview = (attractionId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      attractionId,
      userName,
      rating,
      comment,
      date: new Date(),
    };

    setReviews(prev => [...prev, newReview]);
    markAsRated(attractionId);
  };

  const getReviewsForAttraction = (attractionId: string): Review[] => {
    return reviews.filter(review => review.attractionId === attractionId);
  };

  const addUploadedImage = (attractionId: string, url: string) => {
    const newImage: UploadedImage = {
      id: `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      attractionId,
      url,
      uploadDate: new Date(),
    };

    setUploadedImages(prev => [...prev, newImage]);
    markAsUploaded(attractionId);
  };

  const getImagesForAttraction = (attractionId: string): UploadedImage[] => {
    return uploadedImages.filter(image => image.attractionId === attractionId);
  };

  return (
    <UserActionContext.Provider
      value={{
        visitedAttractions,
        reviews,
        uploadedImages,
        registerVisit,
        hasVisited,
        markAsRated,
        markAsUploaded,
        getVisitInfo,
        addReview,
        getReviewsForAttraction,
        addUploadedImage,
        getImagesForAttraction,
      }}
    >
      {children}
    </UserActionContext.Provider>
  );
};

export const useUserActions = () => {
  const context = useContext(UserActionContext);
  if (context === undefined) {
    throw new Error('useUserActions must be used within a UserActionProvider');
  }
  return context;
};