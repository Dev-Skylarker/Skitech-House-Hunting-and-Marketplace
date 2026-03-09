import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS with public key
emailjs.init(PUBLIC_KEY);

export interface EmailData {
  title: string;
  name: string;
  email: string;
  message: string;
  time: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Send email using EmailJS
 * @param data - Email data with required fields
 * @returns Promise with success status and message
 */
export const sendEmail = async (data: EmailData): Promise<EmailResponse> => {
  try {
    // Validate required fields
    if (!data.title || !data.name || !data.email || !data.message) {
      return {
        success: false,
        message: 'Missing required fields',
        error: 'All fields (title, name, email, message) are required'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Invalid email format',
        error: 'Please provide a valid email address'
      };
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        title: data.title,
        name: data.name,
        email: data.email,
        message: data.message,
        time: data.time,
        reply_to: data.email, // For direct replies
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } else {
      return {
        success: false,
        message: 'Failed to send email',
        error: `EmailJS returned status: ${response.status}`
      };
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Send Property Lead Form email
 * @param propertyTitle - Property title
 * @param userName - User's name
 * @param userEmail - User's email
 * @param userMessage - User's message
 * @returns Promise with email response
 */
export const sendPropertyLeadEmail = async (
  propertyTitle: string,
  userName: string,
  userEmail: string,
  userMessage: string
): Promise<EmailResponse> => {
  const currentTime = new Date().toLocaleString();
  
  return sendEmail({
    title: `Property Inquiry: ${propertyTitle}`,
    name: userName,
    email: userEmail,
    message: userMessage,
    time: currentTime
  });
};

/**
 * Send Marketplace Offer Form email
 * @param itemTitle - Marketplace item title
 * @param userName - User's name
 * @param userEmail - User's email
 * @param userMessage - User's message
 * @returns Promise with email response
 */
export const sendMarketplaceOfferEmail = async (
  itemTitle: string,
  userName: string,
  userEmail: string,
  userMessage: string
): Promise<EmailResponse> => {
  const currentTime = new Date().toLocaleString();
  
  return sendEmail({
    title: `Marketplace Inquiry: ${itemTitle}`,
    name: userName,
    email: userEmail,
    message: userMessage,
    time: currentTime
  });
};

/**
 * Send Support Ticket email
 * @param userName - User's name
 * @param userEmail - User's email
 * @param supportMessage - Support message
 * @returns Promise with email response
 */
export const sendSupportTicketEmail = async (
  userName: string,
  userEmail: string,
  supportMessage: string
): Promise<EmailResponse> => {
  const currentTime = new Date().toLocaleString();
  
  return sendEmail({
    title: 'Support Ticket Request',
    name: userName,
    email: userEmail,
    message: supportMessage,
    time: currentTime
  });
};

// Export the service
export const emailjsService = {
  sendEmail,
  sendPropertyLeadEmail,
  sendMarketplaceOfferEmail,
  sendSupportTicketEmail
};

export default emailjsService;
