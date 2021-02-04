// Pagination, Select und sortieren
import { NextFunction, Request, Response } from "express";

const advancedResults = (model: any, populate?: string) => async (
  req: Request,
  res: Response | any,
  next: NextFunction
) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Remove fields to exclude von url bar
  const removeFields = ["select", "sort", "page", "limit"];
  // Looping over them
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query String
  let queryStr = JSON.stringify(reqQuery);

  // Finding ressource
  query = model.find(JSON.parse(queryStr));

  // SELECT
  if (req.query.select) {
    const fields = (req.query.select as string).split(",").join(" ");
    query = query.select(fields);
  }
  //   SORT
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //   Pagination
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  //   Executing query
  const results = await query;

  // Pagination result
  interface Pagination {
    next: {
      page: number;
      limit: number;
    };
    prev: {
      page: number;
      limit: number;
    };
  }
  const pagination: Partial<Pagination> = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};
export default advancedResults;
