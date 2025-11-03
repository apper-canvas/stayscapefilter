class HotelService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'hotel_c';
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "available_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_coordinates_lat_c"}},
          {"field": {"Name": "location_coordinates_lng_c"}},
          {"field": {"Name": "location_country_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "star_rating_c"}}
        ]
      };

      // Apply filters
      const whereConditions = [];

      if (filters.destination) {
        // Use OR conditions for destination search
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "location_city_c", "operator": "Contains", "values": [filters.destination]}], "operator": ""},
            {"conditions": [{"fieldName": "location_state_c", "operator": "Contains", "values": [filters.destination]}], "operator": ""},
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [filters.destination]}], "operator": ""}
          ]
        }];
      }

      if (filters.minPrice) {
        whereConditions.push({"FieldName": "price_per_night_c", "Operator": "GreaterThanOrEqualTo", "Values": [parseFloat(filters.minPrice)]});
      }

      if (filters.maxPrice) {
        whereConditions.push({"FieldName": "price_per_night_c", "Operator": "LessThanOrEqualTo", "Values": [parseFloat(filters.maxPrice)]});
      }

      if (filters.starRating && filters.starRating.length > 0) {
        whereConditions.push({"FieldName": "star_rating_c", "Operator": "EqualTo", "Values": filters.starRating.map(r => parseInt(r))});
      }

      if (filters.rating) {
        whereConditions.push({"FieldName": "rating_c", "Operator": "GreaterThanOrEqualTo", "Values": [parseFloat(filters.rating)]});
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy = [{"fieldName": "price_per_night_c", "sorttype": "ASC"}];
            break;
          case "price-high":
            params.orderBy = [{"fieldName": "price_per_night_c", "sorttype": "DESC"}];
            break;
          case "rating":
            params.orderBy = [{"fieldName": "rating_c", "sorttype": "DESC"}];
            break;
          case "name":
            params.orderBy = [{"fieldName": "name_c", "sorttype": "ASC"}];
            break;
          default:
            params.orderBy = [{"fieldName": "Id", "sorttype": "ASC"}];
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching hotels:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch hotels");
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "available_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_coordinates_lat_c"}},
          {"field": {"Name": "location_coordinates_lng_c"}},
          {"field": {"Name": "location_country_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "star_rating_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Hotel not found");
      }

      const hotel = response.data;

      // Get review statistics
      try {
        const reviewService = await import("@/services/api/reviewService.js");
        const reviewStats = await reviewService.default.getHotelStats(parseInt(id));
        
        return { 
          ...hotel, 
          rating_c: reviewStats.averageRating || hotel.rating_c,
          review_count_c: reviewStats.totalReviews || hotel.review_count_c || 0,
          reviewStats: reviewStats.ratingDistribution
        };
      } catch (err) {
        // Fallback to original hotel data if review service fails
        return hotel;
      }
    } catch (error) {
      console.error("Error fetching hotel:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch hotel");
    }
  }

  async getFeatured() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "available_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_coordinates_lat_c"}},
          {"field": {"Name": "location_coordinates_lng_c"}},
          {"field": {"Name": "location_country_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "star_rating_c"}}
        ],
        where: [{"FieldName": "featured_c", "Operator": "EqualTo", "Values": [true]}],
        pagingInfo: {"limit": 4, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured hotels:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch featured hotels");
    }
  }

  async search(query) {
    if (!query || query.trim() === "") {
      return [];
    }

    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "available_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_coordinates_lat_c"}},
          {"field": {"Name": "location_coordinates_lng_c"}},
          {"field": {"Name": "location_country_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "star_rating_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "location_city_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "location_state_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "description_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching hotels:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to search hotels");
    }
  }

  async checkAvailability(hotelId, checkIn, checkOut) {
    try {
      const hotel = await this.getById(hotelId);
      if (!hotel) {
        throw new Error("Hotel not found");
      }

      // Simulate availability check
      const available = hotel.available_c && Math.random() > 0.1;

      return {
        available,
        hotelId: hotel.Id,
        checkIn,
        checkOut,
        rooms: available ? [
          {
            id: `${hotel.Id}_deluxe`,
            type: "Deluxe Room",
            capacity: 2,
            pricePerNight: hotel.price_per_night_c,
            amenities: ["Free WiFi", "Mini Bar", "City View"],
            available: true
          },
          {
            id: `${hotel.Id}_suite`,
            type: "Executive Suite",
            capacity: 4,
            pricePerNight: hotel.price_per_night_c * 1.5,
            amenities: ["Free WiFi", "Mini Bar", "Ocean View", "Living Area"],
            available: true
          }
        ] : []
      };
    } catch (error) {
      console.error("Error checking availability:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to check availability");
    }
  }

  async create(hotelData) {
    try {
      // Only include updateable fields
      const createData = {};
      if (hotelData.Name !== undefined) createData.Name = hotelData.Name;
      if (hotelData.address_c !== undefined) createData.address_c = hotelData.address_c;
      if (hotelData.available_c !== undefined) createData.available_c = hotelData.available_c;
      if (hotelData.description_c !== undefined) createData.description_c = hotelData.description_c;
      if (hotelData.featured_c !== undefined) createData.featured_c = hotelData.featured_c;
      if (hotelData.location_city_c !== undefined) createData.location_city_c = hotelData.location_city_c;
      if (hotelData.location_coordinates_lat_c !== undefined) createData.location_coordinates_lat_c = parseFloat(hotelData.location_coordinates_lat_c);
      if (hotelData.location_coordinates_lng_c !== undefined) createData.location_coordinates_lng_c = parseFloat(hotelData.location_coordinates_lng_c);
      if (hotelData.location_country_c !== undefined) createData.location_country_c = hotelData.location_country_c;
      if (hotelData.location_state_c !== undefined) createData.location_state_c = hotelData.location_state_c;
      if (hotelData.name_c !== undefined) createData.name_c = hotelData.name_c;
      if (hotelData.price_per_night_c !== undefined) createData.price_per_night_c = parseFloat(hotelData.price_per_night_c);
      if (hotelData.rating_c !== undefined) createData.rating_c = parseFloat(hotelData.rating_c);
      if (hotelData.review_count_c !== undefined) createData.review_count_c = parseInt(hotelData.review_count_c);
      if (hotelData.star_rating_c !== undefined) createData.star_rating_c = parseInt(hotelData.star_rating_c);

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
          console.error(`Failed to create hotel: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Creation failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating hotel:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to create hotel");
    }
  }

  async update(id, updates) {
    try {
      // Only include updateable fields
      const updateData = {};
      if (updates.address_c !== undefined) updateData.address_c = updates.address_c;
      if (updates.available_c !== undefined) updateData.available_c = updates.available_c;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      if (updates.featured_c !== undefined) updateData.featured_c = updates.featured_c;
      if (updates.location_city_c !== undefined) updateData.location_city_c = updates.location_city_c;
      if (updates.location_coordinates_lat_c !== undefined) updateData.location_coordinates_lat_c = parseFloat(updates.location_coordinates_lat_c);
      if (updates.location_coordinates_lng_c !== undefined) updateData.location_coordinates_lng_c = parseFloat(updates.location_coordinates_lng_c);
      if (updates.location_country_c !== undefined) updateData.location_country_c = updates.location_country_c;
      if (updates.location_state_c !== undefined) updateData.location_state_c = updates.location_state_c;
      if (updates.name_c !== undefined) updateData.name_c = updates.name_c;
      if (updates.price_per_night_c !== undefined) updateData.price_per_night_c = parseFloat(updates.price_per_night_c);
      if (updates.rating_c !== undefined) updateData.rating_c = parseFloat(updates.rating_c);
      if (updates.review_count_c !== undefined) updateData.review_count_c = parseInt(updates.review_count_c);
      if (updates.star_rating_c !== undefined) updateData.star_rating_c = parseInt(updates.star_rating_c);

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
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
          console.error(`Failed to update hotel: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Update failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating hotel:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to update hotel");
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
          console.error(`Failed to delete hotel: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Deletion failed");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting hotel:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to delete hotel");
    }
  }
}

export default new HotelService();