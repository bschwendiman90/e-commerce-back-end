const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
    try {
      // Find all products and include associated category and tag data
      const products = await Product.findAll({
        include: [
          { model: Category },
          { model: Tag }
        ],
      });
      
      // Send the products as a response
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching products' });
    }
  });

// get one product
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      // Find the product by its ID and include associated category and tag data
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          { model: Category },
          { model: Tag }
        ],
      });
  
      // If the product with the given ID doesn't exist, return 404
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Send the product as a response
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
  });

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      // Check if the product with the given ID exists
      const productToDelete = await Product.findByPk(productId);
      if (!productToDelete) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Delete the product from the database
      await productToDelete.destroy();
  
      // Send a success response
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
  });

module.exports = router;
