class ValidationContract {
  // Constructor initializes an empty array to store error messages
  constructor() {
    this.errors = [];
  }

  // Checks if the value is provided and not empty
  isRequired(value, message) {
    if (!value || value.length <= 0) {
      // If validation fails, the error message is pushed into the 'errors' array
      this.errors.push({ message });
    }
  }

  // Checks if the value meets the minimum length requirement
  hasMinLen(value, min, message) {
    if (!value || value.length < min) {
      // If validation fails, the error message is pushed into the 'errors' array
      this.errors.push({ message });
    }
  }

  // Checks if the value exceeds the maximum length
  hasMaxLen(value, max, message) {
    if (!value || value.length > max) {
      // If validation fails, the error message is pushed into the 'errors' array
      this.errors.push({ message });
    }
  }

  // Checks if the value has exactly the specified length
  isFixedLen(value, len, message) {
    if (value.length !== len) {
      // If validation fails, the error message is pushed into the 'errors' array
      this.errors.push({ message });
    }
  }

  // Validates if the value is in a valid email format
  isEmail(value, message) {
    // Regular expression to validate an email format
    const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);

    if (!reg.test(value)) {
      // If validation fails, the error message is pushed into the 'errors' array
      this.errors.push({ message });
    }
  }

  // Returns the accumulated error messages
  errors() {
    return this.errors;
  }

  // Clears the error messages array, effectively resetting the validation state
  clear() {
    this.errors = [];
  }

  // Checks if there are no errors, i.e., validation is successful
  isValid() {
    return this.errors.length === 0;
  }
}

// Exporting the ValidationContract class for use in other files
export default ValidationContract;
