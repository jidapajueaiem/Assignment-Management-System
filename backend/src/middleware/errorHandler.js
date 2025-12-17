export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Rate limit error
  if (err.status === 429) {
    return res.status(429).json({
      error: err.message || 'Too many requests'
    });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error'
  });
};
