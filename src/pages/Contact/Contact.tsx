import type { SyntheticEvent } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import type { EmailJSResponseStatus } from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
	const sendEmail = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;

		emailjs
			.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				form,
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			)
			.then(
				(result: EmailJSResponseStatus) => {
					console.log(result.text);
					toast.success("Email sent successfully", { theme: "dark" });
					form.reset();
				},
				(error) => {
					console.log(error);
					toast.error("Email sending failed", { theme: "dark" });
				}
			);
	};

	return (
		<div className="form-container">
			<form className="form-wrapper" onSubmit={sendEmail}>
				<p title="Contact us" className="form-text">
					Contact us&#58;
				</p>

				<div className="form-group">
					<label htmlFor="username" title="Full name">
						Full name
					</label>
					<input
						type="text"
						id="username"
						name="username"
						minLength={2}
						maxLength={20}
						required
						placeholder="Enter your full name"
						autoComplete="username"
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="email" title="Email">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						maxLength={20}
						required
						placeholder="Enter your email"
						autoComplete="email"
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="subject" title="subject">
						Subject
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						minLength={2}
						maxLength={50}
						required
						placeholder="Enter a subject"
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="message" title="message">
						Message
					</label>
					<textarea
						id="message"
						name="message"
						minLength={2}
						maxLength={420}
						required
						placeholder="Enter your message"
						className="form-input textarea"
					/>
				</div>

				<button title="Send" type="submit" className="form-btn">
					Send
				</button>

				<ToastContainer />
			</form>
		</div>
	);
}
