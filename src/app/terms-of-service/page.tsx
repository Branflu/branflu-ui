"use client";

import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm mb-6">Effective Date: July 27, 2025</p>

      <p className="mb-4">
        Welcome to Branflu! By using our platform, you agree to the following Terms of Service. If you do not agree with these terms, please do not use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Description of Service</h2>
      <p className="mb-4">
        Branflu is a platform that connects influencers and brands for collaborations and campaigns. The platform offers tools for profile management, analytics, and communication.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You must be at least 13 years old to use this platform.</li>
        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        <li>You agree not to use the platform for any unlawful or harmful activity.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your account if we find that you have violated our terms or engaged in inappropriate behavior on the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Privacy</h2>
      <p className="mb-4">
        We collect and use your data in accordance with our{" "}
        <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>.
        By using our platform, you consent to such collection and use.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
      <p className="mb-4">
        Branflu is not liable for any indirect, incidental, or consequential damages resulting from your use of the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. You will be notified of significant changes via email or on the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us at:{" "}
        <a href="mailto:atharvagawande19@gmail.com" className="text-blue-600 underline">
          atharvagawande19@gmail.com
        </a>
      </p>

      <p className="mt-8">Thank you for using Branflu!</p>
    </div>
  );
};

export default Terms;
