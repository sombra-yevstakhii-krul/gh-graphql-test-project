require('@rckeller/cypress-unfetch');

describe('Github graphql test project', function() {
  it("Goes through the app and doesn't throw", function() {
    cy.visit('localhost:3000');
    cy.contains('Login using github');

    cy.server();
    cy.route('POST', '**/graphql').as('graphql');

    cy.visit('localhost:3000', {
      onBeforeLoad: win => {
        win.localStorage.setItem('token', Cypress.env('TOKEN'));
      },
    });

    cy.contains('.MuiChip-root', 'sombra-yuriy').as('chip');
    cy.get('@chip').then(chip => {
      if (!chip.hasClass('MuiChip-colorPrimary')) {
        chip.click();
      }
    });

    cy.contains('.MuiPaper-root', 'sombra-yuriy').within(() => {
      cy.contains('.MuiChip-root', 'Follow').as('followButton');
      cy.get('@followButton').then(followButtonElement => {
        if (!followButtonElement.hasClass('MuiChip-colorPrimary')) {
          followButtonElement.click();
          cy.wait('@graphql'); // Mutation
          cy.wait('@graphql'); // Refetch
          cy.get('@followButton').should('have.class', 'MuiChip-colorPrimary');
        }
      });

      cy.contains('.repo', 'js_engineer_evaluation_poc').within(() => {
        cy.contains('.MuiChip-root', 'Stars').as('starButton');
        cy.get('@starButton').then(starButtonElement => {
          if (!starButtonElement.hasClass('MuiChip-colorPrimary')) {
            starButtonElement.click();
            cy.wait('@graphql'); // Mutation
            cy.wait('@graphql'); // Refetch
            cy.get('@starButton').should('have.class', 'MuiChip-colorPrimary');
          }
        });

        cy.contains('.MuiChip-root', 'Watching').as('watchButton');
        cy.get('@watchButton').then(watchButtonElement => {
          if (!watchButtonElement.hasClass('MuiChip-colorPrimary')) {
            watchButtonElement.click();
            cy.wait('@graphql'); // Mutation
            cy.wait('@graphql'); // Refetch
            cy.get('@watchButton').should('have.class', 'MuiChip-colorPrimary');
          }
        });

        cy.contains('View README.md').as('readmeButton');
      });
    });

    cy.get('@readmeButton').click();
    cy.contains('h1', 'JS Engineer Promotion').as('renderedMarkdown');
    cy.get('.MuiDialog-container').trigger('keydown', { key: 'Escape' });
    cy.contains('h1', 'JS Engineer Promotion').should('not.exist');
  });
});
