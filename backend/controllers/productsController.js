import express from "express";
export const getProducts = async (req, res) => {
  req.status(200).json({
    Message: "GET Products",
  });
};
