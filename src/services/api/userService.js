class UserService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'user_c';
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "loyalty_status_c"}},
          {"field": {"Name": "member_since_c"}},
          {"field": {"Name": "total_bookings_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "bed_type_c"}},
          {"field": {"Name": "smoking_preference_c"}},
          {"field": {"Name": "floor_preference_c"}},
          {"field": {"Name": "newsletter_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("User not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch user");
    }
  }

  async getCurrentUser() {
    try {
      // Get current authenticated user's information
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "loyalty_status_c"}},
          {"field": {"Name": "member_since_c"}},
          {"field": {"Name": "total_bookings_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "bed_type_c"}},
          {"field": {"Name": "smoking_preference_c"}},
          {"field": {"Name": "floor_preference_c"}},
          {"field": {"Name": "newsletter_c"}}
        ],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("User not found");
      }

      return response.data[0];
    } catch (error) {
      console.error("Error fetching current user:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch current user");
    }
  }

  async updateProfile(id, updates) {
    try {
      // Only include updateable fields
      const updateData = {};
      if (updates.first_name_c !== undefined) updateData.first_name_c = updates.first_name_c;
      if (updates.last_name_c !== undefined) updateData.last_name_c = updates.last_name_c;
      if (updates.email_c !== undefined) updateData.email_c = updates.email_c;
      if (updates.phone_c !== undefined) updateData.phone_c = updates.phone_c;
      if (updates.avatar_c !== undefined) updateData.avatar_c = updates.avatar_c;
      if (updates.name_c !== undefined) updateData.name_c = updates.name_c;

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
          console.error(`Failed to update user: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Update failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to update profile");
    }
  }

  async updatePreferences(id, preferences) {
    try {
      // Only include updateable preference fields
      const updateData = {};
      if (preferences.room_type_c !== undefined) updateData.room_type_c = preferences.room_type_c;
      if (preferences.bed_type_c !== undefined) updateData.bed_type_c = preferences.bed_type_c;
      if (preferences.smoking_preference_c !== undefined) updateData.smoking_preference_c = preferences.smoking_preference_c;
      if (preferences.floor_preference_c !== undefined) updateData.floor_preference_c = preferences.floor_preference_c;
      if (preferences.newsletter_c !== undefined) updateData.newsletter_c = preferences.newsletter_c;

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
          console.error(`Failed to update preferences: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Update failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating preferences:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to update preferences");
    }
  }

  async uploadAvatar(id, avatarUrl) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          avatar_c: avatarUrl
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
          console.error(`Failed to upload avatar: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Upload failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to upload avatar");
    }
  }

  async authenticate(email, password) {
    // Authentication is handled by ApperUI - this method is no longer needed
    // but kept for backward compatibility
    throw new Error("Authentication is handled by ApperUI SDK");
  }

  async register(userData) {
    // Registration is handled by ApperUI - this method is no longer needed
    // but kept for backward compatibility  
    throw new Error("Registration is handled by ApperUI SDK");
  }

  async create(userData) {
    try {
      // Only include updateable fields
      const createData = {};
      if (userData.Name !== undefined) createData.Name = userData.Name;
      if (userData.first_name_c !== undefined) createData.first_name_c = userData.first_name_c;
      if (userData.last_name_c !== undefined) createData.last_name_c = userData.last_name_c;
      if (userData.email_c !== undefined) createData.email_c = userData.email_c;
      if (userData.phone_c !== undefined) createData.phone_c = userData.phone_c;
      if (userData.avatar_c !== undefined) createData.avatar_c = userData.avatar_c;
      if (userData.name_c !== undefined) createData.name_c = userData.name_c;
      if (userData.loyalty_status_c !== undefined) createData.loyalty_status_c = userData.loyalty_status_c;
      if (userData.member_since_c !== undefined) createData.member_since_c = userData.member_since_c;
      if (userData.total_bookings_c !== undefined) createData.total_bookings_c = parseInt(userData.total_bookings_c);
      if (userData.room_type_c !== undefined) createData.room_type_c = userData.room_type_c;
      if (userData.bed_type_c !== undefined) createData.bed_type_c = userData.bed_type_c;
      if (userData.smoking_preference_c !== undefined) createData.smoking_preference_c = userData.smoking_preference_c;
      if (userData.floor_preference_c !== undefined) createData.floor_preference_c = userData.floor_preference_c;
      if (userData.newsletter_c !== undefined) createData.newsletter_c = userData.newsletter_c;

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
          console.error(`Failed to create user: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Creation failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to create user");
    }
  }
}

export default new UserService();