import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">Last updated: July 27, 2025</p>
      
      <p className="mb-4">
        At Branflu, we respect your privacy and are committed to protecting your personal data.
        This Privacy Policy explains how we collect, use, and safeguard your information when you
        use our platform, including login via Facebook/Instagram.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. What Data We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Your public profile info (name, email, profile picture)</li>
        <li>Instagram account details like follower count (with your permission)</li>
        <li>Technical data like IP address, browser type, etc.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Data</h2>
      <p className="mb-4">We use your data to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Personalize your experience on Branflu</li>
        <li>Analyze engagement and improve features</li>
        <li>Secure your account and prevent misuse</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We do not sell your data. We may share it with trusted third parties only to the extent necessary
        for hosting, analytics, or legal compliance.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Data Deletion</h2>
      <p className="mb-4">
        You can request deletion of your data by contacting us at: 
        <a href="mailto:atharvagawande19@gmail.com" className="text-blue-600 underline"> atharvagawande19@gmail.com</a>
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Updates</h2>
      <p className="mb-4">
        We may update this policy from time to time. The updated version will be posted on this page.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
