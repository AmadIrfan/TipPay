const getEnvVar = (varName) => {
    const value = process.env[varName];
    if (!value) {
      throw new Error(`Environment variable ${varName} is missing`);
    }
    return value;
  };
  
  // Load and validate environment variables
  exports.mongoDBUrl = getEnvVar('MONGO_URL');
  exports.serverPort = getEnvVar('PORT');
  exports.jsonWebTokenSecret = getEnvVar('JWT_SECRET');
  exports.twilioAccountSid = getEnvVar('TWILIO_ACCOUNT_SID');
  exports.twilioAuthToken = getEnvVar('TWILIO_AUTH_TOKEN');
  exports.twilioPhoneNumber = getEnvVar('TWILIO_PHONE_NUMBER');