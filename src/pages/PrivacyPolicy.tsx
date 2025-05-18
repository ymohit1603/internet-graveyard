import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => (
  <div className="p-8 max-w-3xl mx-auto">
    <Link to="/" className="inline-flex items-center mb-6 text-purple-500 hover:text-purple-600">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to home
    </Link>
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="text-muted-foreground mb-4">
      We collect only essential personal data to improve your experience. We do not sell or share your data with third parties, except as required by law.
    </p>
    <p className="text-muted-foreground">For privacy-related concerns, contact <a href="mailto:mohityadav0330@gmail.com" className="text-purple-600 underline">mohityadav0330@gmail.com</a></p>
  </div>
);

export default PrivacyPolicy;
