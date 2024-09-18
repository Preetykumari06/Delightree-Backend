// 1. Question: Calculate the total number of posts, comments, likes, and views for each user, grouped by age range.
// "18-24"
// "25-34" 
// "35-44" 
// “45+"

/* answer */

db.users.aggregate([
    // 1. Group users by age range
    {
      $addFields: {
        ageRange: {
          $switch: {
            branches: [
              { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: "18-24" },
              { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 34] }] }, then: "25-34" },
              { case: { $and: [{ $gte: ["$age", 35] }, { $lte: ["$age", 44] }] }, then: "35-44" }
            ],
            default: "45+"
          }
        }
      }
    },
    
    // 2. Lookup posts by user (authorId),comments by user (userId),likes by user (userId),views by user (userId),
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "authorId",
        as: "userPosts"
      }
    },
    
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "userId",
        as: "userComments"
      }
    },
    
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "userId",
        as: "userLikes"
      }
    },
    
    {
      $lookup: {
        from: "views",
        localField: "_id",
        foreignField: "userId",
        as: "userViews"
      }
    },
    
    // 3. Add fields for total counts for posts, comments, likes, and views
    {
      $addFields: {
        totalPosts: { $size: "$userPosts" },
        totalComments: { $size: "$userComments" },
        totalLikes: { $size: "$userLikes" },
        totalViews: { $size: "$userViews" }
      }
    },
    
    // 4. Group by age range and sum the totals
    {
      $group: {
        _id: "$ageRange",
        totalPosts: { $sum: "$totalPosts" },
        totalComments: { $sum: "$totalComments" },
        totalLikes: { $sum: "$totalLikes" },
        totalViews: { $sum: "$totalViews" }
      }
    }
  ]);

