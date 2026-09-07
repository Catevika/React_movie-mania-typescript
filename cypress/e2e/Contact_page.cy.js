import {
	enterTextInput,
	navigateContact,
	send
} from '../page-objects/contact-page';

describe('Contact page spec', () => {
	beforeEach(() => {
		cy.intercept("POST", "https://api.emailjs.com/api/v1.0/email/send-form", {
			statusCode: 200,
			body: { status: 200, text: "OK" },
		}).as("emailjs");

		navigateContact();
	});

	it("send the form when filled in correctly", () => {
		enterTextInput(/full name/i, "John Doe");
		enterTextInput(/email/i, "catevika@gmail.com");
		enterTextInput(/subject/i, "Hello");
		enterTextInput(/message/i, "Hello from John");
		send();

		cy.wait("@emailjs");
	});
});
