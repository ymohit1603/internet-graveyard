import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background text-foreground overflow-y-auto">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 pb-16">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center mb-8 text-purple-500 hover:text-purple-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        {/* Header */}
        <div className="mb-12 border-b border-border pb-6">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to <span className="font-semibold">Ideas-in-Graveyard</span>. By using our website and services, 
            you agree to comply with and be bound by the following terms and conditions.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Ideas-in-Graveyard, you agree to be legally bound by these Terms of Service, our Privacy
              Policy, and Refund Policy. If you do not agree with any part, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">2. Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We respect your privacy. Any personal information you provide while using Ideas-in-Graveyard is collected, stored, 
              and processed according to our Privacy Policy:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>We collect only the information necessary to provide and improve our services.</li>
              <li>We do not sell or share your personal information with third parties without your consent, except as required by law.</li>
              <li>We use cookies and similar technologies to enhance user experience.</li>
              <li>You may request access to, correction, or deletion of your personal data by contacting us.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              For more details, please contact us at <a href="mailto:mohityadav0330@gmail.com" className="text-purple-600 hover:underline">mohityadav0330@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">3. Refund Policy</h2>
            <p className="text-muted-foreground mb-4">
              Ideas-in-Graveyard provides digital content and services. Due to the nature of digital goods:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>All sales are final.</li>
              <li>We do not offer refunds once the product or service is delivered.</li>
              <li>If you experience technical issues, please contact our support team and we will assist you promptly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">4. Use of Service</h2>
            <p className="text-muted-foreground mb-4">
              You agree to use Ideas-in-Graveyard only for lawful purposes. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Violate any applicable laws or regulations.</li>
              <li>Engage in any activity that could damage, disable, or impair the website or interfere with others' use.</li>
              <li>Attempt to gain unauthorized access to any part of the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on Ideas-in-Graveyard, including text, images, logos, and software, is the property of Ideas-in-Graveyard or
              its licensors and is protected by copyright laws. You may not reproduce or distribute any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Ideas-in-Graveyard is provided "as is" without warranties of any kind. We do not guarantee the accuracy or completeness of content.
              Under no circumstances will we be liable for any damages arising from the use of the site or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with an updated date.
              Your continued use of the service constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-600">8. Contact Us</h2>
            <p className="text-muted-foreground mb-2">
              If you have any questions or concerns about these Terms, Privacy Policy, or Refund Policy, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold">Email:</span> <a href="mailto:mohityadav0330@gmail.com" className="text-purple-600 hover:underline">mohityadav0330@gmail.com</a>
            </p>
          </section>

          <div className="border-t border-border pt-6 mt-12">
            <p className="text-sm text-muted-foreground italic">
              Last Updated: May 17, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
