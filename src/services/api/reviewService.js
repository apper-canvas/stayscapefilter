class ReviewService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'review_c';
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "helpful_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stay_date_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "user_avatar_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "verified_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      // Apply filters
      const whereConditions = [];
      
      if (filters.hotelId) {
        whereConditions.push({"FieldName": "hotel_id_c", "Operator": "EqualTo", "Values": [parseInt(filters.hotelId)]});
      }

      if (filters.userId) {
        whereConditions.push({"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(filters.userId)]});
      }

      if (filters.minRating) {
        whereConditions.push({"FieldName": "rating_c", "Operator": "GreaterThanOrEqualTo", "Values": [parseInt(filters.minRating)]});
      }

      if (filters.search) {
        // Use OR conditions for search in title, comment, or user name
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "title_c", "operator": "Contains", "values": [filters.search]}], "operator": ""},
            {"conditions": [{"fieldName": "comment_c", "operator": "Contains", "values": [filters.search]}], "operator": ""},
            {"conditions": [{"fieldName": "user_name_c", "operator": "Contains", "values": [filters.search]}], "operator": ""}
          ]
        }];
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            params.orderBy = [{"fieldName": "CreatedOn", "sorttype": "DESC"}];
            break;
          case "oldest":
            params.orderBy = [{"fieldName": "CreatedOn", "sorttype": "ASC"}];
            break;
          case "rating-high":
            params.orderBy = [{"fieldName": "rating_c", "sorttype": "DESC"}];
            break;
          case "rating-low":
            params.orderBy = [{"fieldName": "rating_c", "sorttype": "ASC"}];
            break;
          default:
            params.orderBy = [{"fieldName": "CreatedOn", "sorttype": "DESC"}];
        }
      } else {
        params.orderBy = [{"fieldName": "CreatedOn", "sorttype": "DESC"}];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch reviews");
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "helpful_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stay_date_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "user_avatar_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "verified_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Review not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching review:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch review");
    }
  }

  async getByHotelId(hotelId) {
    return await this.getAll({ hotelId: parseInt(hotelId) });
  }

  async getByUserId(userId) {
    return await this.getAll({ userId: parseInt(userId) });
  }

  async create(reviewData) {
    try {
      // Validate required fields
      if (!reviewData.hotel_id_c || !reviewData.user_id_c || !reviewData.rating_c || !reviewData.title_c) {
        throw new Error("Missing required fields");
      }

      // Only include updateable fields
      const createData = {};
      if (reviewData.Name !== undefined) createData.Name = reviewData.Name;
      if (reviewData.comment_c !== undefined) createData.comment_c = reviewData.comment_c;
      if (reviewData.helpful_c !== undefined) createData.helpful_c = parseInt(reviewData.helpful_c);
      if (reviewData.hotel_id_c !== undefined) createData.hotel_id_c = parseInt(reviewData.hotel_id_c);
      if (reviewData.rating_c !== undefined) createData.rating_c = parseInt(reviewData.rating_c);
      if (reviewData.stay_date_c !== undefined) createData.stay_date_c = reviewData.stay_date_c;
      if (reviewData.title_c !== undefined) createData.title_c = reviewData.title_c;
      if (reviewData.user_avatar_c !== undefined) createData.user_avatar_c = reviewData.user_avatar_c;
      if (reviewData.user_id_c !== undefined) createData.user_id_c = parseInt(reviewData.user_id_c);
      if (reviewData.user_name_c !== undefined) createData.user_name_c = reviewData.user_name_c;
      if (reviewData.verified_c !== undefined) createData.verified_c = reviewData.verified_c;

      // Set defaults
      if (createData.helpful_c === undefined) createData.helpful_c = 0;
      if (createData.verified_c === undefined) createData.verified_c = true;
      if (createData.stay_date_c === undefined) createData.stay_date_c = new Date().toISOString().split('T')[0];
      if (createData.user_name_c === undefined) createData.user_name_c = "Anonymous";

      const params = {
        records: [createData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create review: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Creation failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to create review");
    }
  }

  async update(id, updateData) {
    try {
      // Only include updateable fields
      const updateFields = {};
      if (updateData.comment_c !== undefined) updateFields.comment_c = updateData.comment_c;
      if (updateData.helpful_c !== undefined) updateFields.helpful_c = parseInt(updateData.helpful_c);
      if (updateData.hotel_id_c !== undefined) updateFields.hotel_id_c = parseInt(updateData.hotel_id_c);
      if (updateData.rating_c !== undefined) updateFields.rating_c = parseInt(updateData.rating_c);
      if (updateData.stay_date_c !== undefined) updateFields.stay_date_c = updateData.stay_date_c;
      if (updateData.title_c !== undefined) updateFields.title_c = updateData.title_c;
      if (updateData.user_avatar_c !== undefined) updateFields.user_avatar_c = updateData.user_avatar_c;
      if (updateData.user_id_c !== undefined) updateFields.user_id_c = parseInt(updateData.user_id_c);
      if (updateData.user_name_c !== undefined) updateFields.user_name_c = updateData.user_name_c;
      if (updateData.verified_c !== undefined) updateFields.verified_c = updateData.verified_c;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update review: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Update failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to update review");
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete review: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Deletion failed");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to delete review");
    }
  }

  async getHotelStats(hotelId) {
    try {
      const params = {
        fields: [{"field": {"Name": "rating_c"}}],
        where: [{"FieldName": "hotel_id_c", "Operator": "EqualTo", "Values": [parseInt(hotelId)]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const reviews = response.data || [];

      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + (review.rating_c || 0), 0);
      const averageRating = totalRating / reviews.length;

      const ratingDistribution = reviews.reduce((dist, review) => {
        const rating = review.rating_c || 0;
        dist[rating] = (dist[rating] || 0) + 1;
        return dist;
      }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        ratingDistribution
      };
    } catch (error) {
      console.error("Error fetching hotel stats:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch hotel stats");
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;