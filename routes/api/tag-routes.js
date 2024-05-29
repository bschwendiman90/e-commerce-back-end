const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
    try {
      const tags = await Tag.findAll({
        include: [{
          model: Product,
        }],
      });
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tags.' });
    }
  });

  router.get('/:id', async (req, res) => {
    const tagId = req.params.id;
    try {
      const tag = await Tag.findOne({
        where: { id: tagId },
        include: [{
          model: Product,
        }],
      });
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(tag);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the tag.' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      // Extract tag data from the request body
      const { tag_name } = req.body;
  
      // Check if the tag_name is provided
      if (!tag_name) {
        return res.status(400).json({ error: 'Tag name is required' });
      }
  
      // Create a new tag in the database
      const newTag = await Tag.create({
        tag_name,
      });
  
      // Send the newly created tag as a response
      res.status(201).json(newTag);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the tag' });
    }
  });

  router.put('/:id', async (req, res) => {
    const tagId = req.params.id;
    try {
      // Check if the tag with the given ID exists
      const tagToUpdate = await Tag.findByPk(tagId);
      if (!tagToUpdate) {
        return res.status(404).json({ error: 'Tag not found' });
      }
  
      // Extract updated tag name from the request body
      const { tag_name } = req.body;
  
      // Check if the tag name is provided
      if (!tag_name) {
        return res.status(400).json({ error: 'Tag name is required' });
      }
  
      // Update the tag's name in the database
      await tagToUpdate.update({ tag_name });
  
      // Send a success response
      res.json({ message: 'Tag updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the tag' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const tagId = req.params.id;
    try {
      // Check if the tag with the given ID exists
      const tagToDelete = await Tag.findByPk(tagId);
      if (!tagToDelete) {
        return res.status(404).json({ error: 'Tag not found' });
      }
  
      // Delete the tag from the database
      await tagToDelete.destroy();
  
      // Send a success response
      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the tag' });
    }
  });

module.exports = router;
