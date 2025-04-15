import moment from 'moment-timezone';

export const STANDARD_DATE_FORMAT = 'DD/MM/YYYY :: HH:mm:ss';
export const TIMEZONE = 'Asia/Kolkata';

// Create the object
const dateUtils = {
    formatToStandard: (date) => {
        if (!date) return '';
        let momentDate = moment(date);
        if (!momentDate.isValid()) {
            momentDate = moment(date, STANDARD_DATE_FORMAT);
        }
        return momentDate.tz(TIMEZONE).format(STANDARD_DATE_FORMAT);
    },

    parseFromStandard: (dateString) => {
        if (!dateString) return null;
        const momentDate = moment(dateString, STANDARD_DATE_FORMAT).tz(TIMEZONE);
        return momentDate.isValid() ? momentDate.toDate() : null;
    },

    convertToBackendDateTime: function(inputDate) {
        return this.fromInputFormat(inputDate);
    },  

    toInputFormat: (dateString) => {
        if (!dateString) return '';
        const date = moment(dateString, STANDARD_DATE_FORMAT).tz(TIMEZONE);
        return date.isValid() ? date.format('YYYY-MM-DDTHH:mm:ss') : '';
    },

    fromInputFormat: (inputDate) => {
        if (!inputDate) return '';
        return moment(inputDate).tz(TIMEZONE).format(STANDARD_DATE_FORMAT);
    },

    getCurrentDate: () => {
        return moment().tz(TIMEZONE).format(STANDARD_DATE_FORMAT);
    },

    formatForDisplay: (dateString) => {
        if (!dateString) return '';
        
        // Check if the input is already in our display format (MMMM D, YYYY h:mm A)
        const displayFormatRegex = /^[A-Z][a-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M$/;
        if (displayFormatRegex.test(dateString)) {
            return dateString; // Return as is if already in display format
        }

        // Try parsing with our standard format first
        let date = moment(dateString, STANDARD_DATE_FORMAT, true);
        
        // If that fails, try parsing as ISO format
        if (!date.isValid()) {
            date = moment(dateString, moment.ISO_8601, true);
        }
        
        // As a last resort, try general parsing
        if (!date.isValid()) {
            date = moment(dateString);
        }

        return date.isValid() 
            ? date.tz(TIMEZONE).format('MMMM D, YYYY h:mm A')
            : 'Invalid Date';
    },

    isValidDate: (dateString) => {
        return moment(dateString, STANDARD_DATE_FORMAT, true).isValid();
    }
};

// Export as both named and default export
export { dateUtils };  // Named export for backwards compatibility
export default dateUtils;  // Default export for new code