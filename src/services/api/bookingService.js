class BookingService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'booking_c';
  }

  async getAll(userId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_details_email_c"}},
          {"field": {"Name": "guest_details_first_name_c"}},
          {"field": {"Name": "guest_details_last_name_c"}},
          {"field": {"Name": "guest_details_phone_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "hotel_image_c"}},
          {"field": {"Name": "hotel_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "nights_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      if (userId) {
        params.where = [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching bookings:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch bookings");
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_details_email_c"}},
          {"field": {"Name": "guest_details_first_name_c"}},
          {"field": {"Name": "guest_details_last_name_c"}},
          {"field": {"Name": "guest_details_phone_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "hotel_image_c"}},
          {"field": {"Name": "hotel_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "nights_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Booking not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch booking");
    }
  }

  async create(bookingData) {
    try {
      // Only include updateable fields
      const createData = {};
      if (bookingData.Name !== undefined) createData.Name = bookingData.Name;
      if (bookingData.check_in_c !== undefined) createData.check_in_c = bookingData.check_in_c;
      if (bookingData.check_out_c !== undefined) createData.check_out_c = bookingData.check_out_c;
      if (bookingData.confirmation_number_c !== undefined) createData.confirmation_number_c = bookingData.confirmation_number_c;
      if (bookingData.guest_details_email_c !== undefined) createData.guest_details_email_c = bookingData.guest_details_email_c;
      if (bookingData.guest_details_first_name_c !== undefined) createData.guest_details_first_name_c = bookingData.guest_details_first_name_c;
      if (bookingData.guest_details_last_name_c !== undefined) createData.guest_details_last_name_c = bookingData.guest_details_last_name_c;
      if (bookingData.guest_details_phone_c !== undefined) createData.guest_details_phone_c = bookingData.guest_details_phone_c;
      if (bookingData.guests_c !== undefined) createData.guests_c = parseInt(bookingData.guests_c);
      if (bookingData.hotel_id_c !== undefined) createData.hotel_id_c = parseInt(bookingData.hotel_id_c);
      if (bookingData.hotel_image_c !== undefined) createData.hotel_image_c = bookingData.hotel_image_c;
      if (bookingData.hotel_name_c !== undefined) createData.hotel_name_c = bookingData.hotel_name_c;
      if (bookingData.location_c !== undefined) createData.location_c = bookingData.location_c;
      if (bookingData.nights_c !== undefined) createData.nights_c = parseInt(bookingData.nights_c);
      if (bookingData.room_type_c !== undefined) createData.room_type_c = bookingData.room_type_c;
      if (bookingData.status_c !== undefined) createData.status_c = bookingData.status_c;
      if (bookingData.total_price_c !== undefined) createData.total_price_c = parseFloat(bookingData.total_price_c);
      if (bookingData.user_id_c !== undefined) createData.user_id_c = parseInt(bookingData.user_id_c);

      // Generate confirmation number if not provided
      if (!createData.confirmation_number_c) {
        createData.confirmation_number_c = `STY-${Date.now()}-2024`;
      }

      // Set default status
      if (!createData.status_c) {
        createData.status_c = "confirmed";
      }

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
          console.error(`Failed to create booking: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Creation failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to create booking");
    }
  }

  async update(id, updates) {
    try {
      // Only include updateable fields
      const updateData = {};
      if (updates.check_in_c !== undefined) updateData.check_in_c = updates.check_in_c;
      if (updates.check_out_c !== undefined) updateData.check_out_c = updates.check_out_c;
      if (updates.confirmation_number_c !== undefined) updateData.confirmation_number_c = updates.confirmation_number_c;
      if (updates.guest_details_email_c !== undefined) updateData.guest_details_email_c = updates.guest_details_email_c;
      if (updates.guest_details_first_name_c !== undefined) updateData.guest_details_first_name_c = updates.guest_details_first_name_c;
      if (updates.guest_details_last_name_c !== undefined) updateData.guest_details_last_name_c = updates.guest_details_last_name_c;
      if (updates.guest_details_phone_c !== undefined) updateData.guest_details_phone_c = updates.guest_details_phone_c;
      if (updates.guests_c !== undefined) updateData.guests_c = parseInt(updates.guests_c);
      if (updates.hotel_id_c !== undefined) updateData.hotel_id_c = parseInt(updates.hotel_id_c);
      if (updates.hotel_image_c !== undefined) updateData.hotel_image_c = updates.hotel_image_c;
      if (updates.hotel_name_c !== undefined) updateData.hotel_name_c = updates.hotel_name_c;
      if (updates.location_c !== undefined) updateData.location_c = updates.location_c;
      if (updates.nights_c !== undefined) updateData.nights_c = parseInt(updates.nights_c);
      if (updates.room_type_c !== undefined) updateData.room_type_c = updates.room_type_c;
      if (updates.status_c !== undefined) updateData.status_c = updates.status_c;
      if (updates.total_price_c !== undefined) updateData.total_price_c = parseFloat(updates.total_price_c);
      if (updates.user_id_c !== undefined) updateData.user_id_c = parseInt(updates.user_id_c);

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
          console.error(`Failed to update booking: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Update failed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to update booking");
    }
  }

  async cancel(id) {
    return await this.update(id, { status_c: "cancelled" });
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
          console.error(`Failed to delete booking: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Deletion failed");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting booking:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to delete booking");
    }
  }

  async getByStatus(status, userId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_details_email_c"}},
          {"field": {"Name": "guest_details_first_name_c"}},
          {"field": {"Name": "guest_details_last_name_c"}},
          {"field": {"Name": "guest_details_phone_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "hotel_image_c"}},
          {"field": {"Name": "hotel_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "nights_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}
        ]
      };

      if (userId) {
        params.where.push({"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]});
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching bookings by status:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch bookings by status");
    }
  }

  async getUpcoming(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_details_email_c"}},
          {"field": {"Name": "guest_details_first_name_c"}},
          {"field": {"Name": "guest_details_last_name_c"}},
          {"field": {"Name": "guest_details_phone_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "hotel_image_c"}},
          {"field": {"Name": "hotel_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "nights_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {"FieldName": "check_in_c", "Operator": "GreaterThanOrEqualTo", "Values": [today]},
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["cancelled"]}
        ]
      };

      if (userId) {
        params.where.push({"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]});
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch upcoming bookings");
    }
  }

  async getRecent(userId, limit = 5) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_details_email_c"}},
          {"field": {"Name": "guest_details_first_name_c"}},
          {"field": {"Name": "guest_details_last_name_c"}},
          {"field": {"Name": "guest_details_phone_c"}},
          {"field": {"Name": "guests_c"}},
          {"field": {"Name": "hotel_id_c"}},
          {"field": {"Name": "hotel_image_c"}},
          {"field": {"Name": "hotel_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "nights_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      if (userId) {
        params.where = [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent bookings:", error?.response?.data?.message || error.message);
      throw new Error(error.message || "Failed to fetch recent bookings");
    }
  }
}

export default new BookingService();