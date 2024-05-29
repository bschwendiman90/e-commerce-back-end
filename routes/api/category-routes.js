const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
    try {
      // Find all categories and include associated products
      const categories = await Category.findAll({
        include: [{ model: Product }],
      });
      
      // Send the categories as a response
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching categories' });
    }
  });


  router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      // Find the category by its ID and include associated products
      const category = await Category.findOne({
        where: { id: categoryId },
        include: [{ model: Product }],
      });
  
      // If the category with the given ID doesn't exist, return 404
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Send the category as a response
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the category' });
    }
  });


  router.post('/', async (req, res) => {
    try {
      // Extract category data from the request body
      const { category_name } = req.body;
  
      // Check if the category_name is provided
      if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
  
      // Create a new category in the database
      const newCategory = await Category.create({
        category_name,
      });
  
      // Send the newly created category as a response
      res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the category' });
    }
  });

  router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      // Check if the category with the given ID exists
      const categoryToUpdate = await Category.findByPk(categoryId);
      if (!categoryToUpdate) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Extract updated category name from the request body
      const { category_name } = req.body;
  
      // Check if the category name is provided
      if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
  
      // Update the category's name in the database
      await categoryToUpdate.update({ category_name });
  
      // Send a success response
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the category' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      // Check if the category with the given ID exists
      const categoryToDelete = await Category.findByPk(categoryId);
      if (!categoryToDelete) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Delete the category from the database
      await categoryToDelete.destroy();
  
      // Send a success response
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the category' });
    }
  });

module.exports = router;
