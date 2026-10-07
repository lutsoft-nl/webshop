describe('product list', () => {
  const products = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    title: `Product ${index + 1}`,
    price: (index + 1) * 5,
    thumbnail: `/product-${index + 1}.jpg`,
  }));

  beforeEach(() => {
    cy.intercept('GET', 'https://dummyjson.com/products*', (request) => {
      const order = request.query['order'];
      const sortedProducts = [...products].sort((left, right) =>
        order === 'asc' ? left.price - right.price : right.price - left.price,
      );

      request.reply({
        products: order ? sortedProducts : products,
        total: products.length,
        skip: 0,
        limit: 10,
      });
    }).as('getProducts');

    cy.visit('/products');
    cy.wait('@getProducts')
      .its('request.query')
      .should('include', { limit: '10', skip: '0', select: 'title,price,thumbnail' });
  });

  it('renders mocked products and sorts them by price', () => {
    cy.get('.product-card').should('have.length', 25);
    cy.get('.product-card').eq(0).should('contain.text', 'Product 1');
    cy.get('.product-card').eq(24).should('contain.text', 'Product 25');

    cy.get('#sort-order').select('asc');
    cy.wait('@getProducts')
      .its('request.query')
      .should('include', { sortBy: 'price', order: 'asc' });
    cy.get('.product-card').eq(0).should('contain.text', 'Product 1');
    cy.get('.product-card').eq(24).should('contain.text', 'Product 25');

    cy.get('#sort-order').select('desc');
    cy.wait('@getProducts')
      .its('request.query')
      .should('include', { sortBy: 'price', order: 'desc' });
    cy.get('.product-card').eq(0).should('contain.text', 'Product 25');
    cy.get('.product-card').eq(24).should('contain.text', 'Product 1');
  });
});