const advancedResults = (Model, populate) => async (req, res, next) => {
  let query;

  //copy req.quer
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // loop over request query fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create Quuery string
  let queryString = JSON.stringify(reqQuery);

  //creating operators ($gte etc)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Model.find(JSON.parse(queryString));

  // SELECT FIELDS
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // SORT
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  // adding Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startingIndex = (page - 1) * limit;
  const endingIndex = page * limit;
  const total = await Model.countDocuments();

  query = query.skip(startingIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // executing the query
  const results = await query;

  // pagination results
  const Pagination = {};

  if (endingIndex < total) {
    Pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startingIndex > 0) {
    Pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (!results) {
    return res.status(401).json({ success: false, data: {} });
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    Pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
