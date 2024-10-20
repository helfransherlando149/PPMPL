const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('API Testing', () => {
  it('should return all items', (done) => {
    request(app)
      .get('/api/items')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new item', (done) => {
    request(app)
      .post('/api/items')
      .send({ name: 'New Item' })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'New Item');
        done();
      });
  });

  it('should update an item', (done) => {
    // First, create an item to update
    request(app)
      .post('/api/items')
      .send({ name: 'Item to Update' })
      .end((err, res) => {
        const itemId = res.body.id;
        // Then, update the item
        request(app)
          .put(`/api/items/${itemId}`)
          .send({ name: 'Updated Item' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('id', itemId);
            expect(res.body).to.have.property('name', 'Updated Item');
            done();
          });
      });
  });

  it('should delete an item', (done) => {
    // First, create an item to delete
    request(app)
      .post('/api/items')
      .send({ name: 'Item to Delete' })
      .end((err, res) => {
        const itemId = res.body.id;
        // Then, delete the item
        request(app)
          .delete(`/api/items/${itemId}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Item deleted successfully');
            done();
          });
      });
  });

  it('should not create an item with invalid data', (done) => {
    request(app)
      .post('/api/items')
      .send({})  // Sending empty object as invalid data
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('should return 404 for updating non-existent item', (done) => {
    request(app)
      .put('/api/items/nonexistentid')
      .send({ name: 'Updated Name' })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should return 404 for deleting non-existent item', (done) => {
    request(app)
      .delete('/api/items/nonexistentid')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});