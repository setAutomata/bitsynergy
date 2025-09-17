import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const handleError = (error: unknown) => {
  let errorMessage = "An unexpected error occurred.";

  if (error instanceof Error) {
    // For general errors (like JS errors)
    errorMessage = error.message;
  } else if (error instanceof AxiosError) {
    if (error.response) {
      // Request was made and server responded with a status code
      errorMessage = `API Error: ${error.response.data?.message || "An error occurred"}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from the server.";
    } else {
      // Something happened in setting up the request
      errorMessage = `Request Error: ${error.message}`;
    }
  }
  toast.error(errorMessage);
};
