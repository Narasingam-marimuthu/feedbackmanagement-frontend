import axios from "axios";

export const getFeedbacks = async () => {
    try {
        const response = await axios.get("http://localhost:3001/api/feedbacks");
        console.log(response.data,"response");
        
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        throw error;
    }
};

export const addFeedback = async (feedback) => {
    try {
        console.log(feedback, "feedback1");
        const response = await axios.post("http://localhost:3001/api/feedbacks", feedback);
        console.log(response.data,"add response");
        return response.data;
    } catch (error) {
        console.error("Error adding feedback:", error);
        throw error;
    }
}

export const getFeedbackById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/feedbacks/${id}`);
        console.log(response.data,"get response");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        throw error;
    }
}

export const updateFeedback = async (id, feedback) => {
    try {
        console.log(feedback, "feedback2");
        
        const response = await axios.put(`http://localhost:3001/api/feedbacks/${id}`, feedback);
        return response.data;
    } catch (error) {
        console.error("Error updating feedback:", error);
        throw error;
    }
}


export const deleteFeedback = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3001/api/feedbacks/${id}`);
        console.log(response.data,"delete response");
        
        return response.data.data;
    } catch (error) {
        console.error("Error deleting feedback:", error);
        throw error;
    }
}