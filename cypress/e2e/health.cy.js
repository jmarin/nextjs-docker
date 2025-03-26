describe('Health API Endpoint', () => {
    it('should return status ok', () => {
        cy.request('http://localhost:3001/api/health').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('status', 'ok');
        });
    });
});
