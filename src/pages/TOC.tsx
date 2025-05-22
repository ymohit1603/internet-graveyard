import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TermsConditionsPage = () => (
  <div className="container mx-auto py-8 px-4">
    <Card className="border shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
          <p className="text-white/80">Last updated: May 18, 2025</p>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}>
          <div className="space-y-6">
    <p>Please read these terms and conditions carefully before using Our Service.</p>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Interpretation and Definitions</h2>
              <h3 className="text-xl font-medium mt-4 mb-2">Interpretation</h3>
    <p>
      The words of which the initial letter is capitalized have meanings defined under the
      following conditions. The following definitions shall have the same meaning regardless
      of whether they appear in singular or in plural.
    </p>
              
              <h3 className="text-xl font-medium mt-4 mb-2">Definitions</h3>
    <p>For the purposes of these Terms and Conditions:</p>
              <ul className="list-disc pl-6 my-3 space-y-2">
      <li>
        <strong>Affiliate</strong> means an entity that controls, is controlled by or is under
                  common control with a party, where "control" means ownership of 50% or more of the
        shares, equity interest or other securities entitled to vote for election of directors
        or other managing authority.
      </li>
      <li>
        <strong>Country</strong> refers to: Haryana, India.
      </li>
      <li>
                  <strong>Company</strong> (referred to as "the Company", "We", "Us" or "Our" in this
        Agreement) refers to ideas-in-graveyard.
      </li>
      <li>
        <strong>Device</strong> means any device that can access the Service such as a computer,
        a cellphone or a digital tablet.
      </li>
      <li>
        <strong>Service</strong> refers to the Website.
      </li>
      <li>
                  <strong>Terms and Conditions</strong> (also referred to as "Terms") mean these Terms and
        Conditions that form the entire agreement between You and the Company regarding the use
        of the Service. This Terms and Conditions agreement has been created with the help of
        the{' '}
        <a
          href="https://www.freeprivacypolicy.com/free-terms-and-conditions-generator/"
          target="_blank"
          rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
        >
          Free Terms and Conditions Generator
        </a>.
      </li>
      <li>
        <strong>Third-party Social Media Service</strong> means any services or content
        (including data, information, products or services) provided by a third-party that may be
        displayed, included or made available by the Service.
      </li>
      <li>
        <strong>Website</strong> refers to ideas-in-graveyard, accessible from{' '}
        <a
          href="https://ideas-in-graveyard.space"
          target="_blank"
          rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
        >
          https://ideas-in-graveyard.space
        </a>.
      </li>
      <li>
        <strong>You</strong> means the individual accessing or using the Service, or the company,
        or other legal entity on behalf of which such individual is accessing or using the
        Service, as applicable.
      </li>
    </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Acknowledgment</h2>
    <p>
      These are the Terms and Conditions governing the use of this Service and the agreement that
      operates between You and the Company. These Terms and Conditions set out the rights and
      obligations of all users regarding the use of the Service.
    </p>
              <p className="mt-3">
      Your access to and use of the Service is conditioned on Your acceptance of and compliance
      with these Terms and Conditions. These Terms and Conditions apply to all visitors, users
      and others who access or use the Service.
    </p>
              <p className="mt-3">
      By accessing or using the Service You agree to be bound by these Terms and Conditions. If
      You disagree with any part of these Terms and Conditions then You may not access the
      Service.
    </p>
              <p className="mt-3">
      You represent that you are over the age of 18. The Company does not permit those under 18
      to use the Service.
    </p>
              <p className="mt-3">
      Your access to and use of the Service is also conditioned on Your acceptance of and
      compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies
      and procedures on the collection, use and disclosure of Your personal information when You
      use the Application or the Website and tells You about Your privacy rights and how the law
      protects You. Please read Our Privacy Policy carefully before using Our Service.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Links to Other Websites</h2>
    <p>
      Our Service may contain links to third-party websites or services that are not owned or
      controlled by the Company.
    </p>
              <p className="mt-3">
      The Company has no control over, and assumes no responsibility for, the content, privacy
      policies, or practices of any third-party websites or services. You further acknowledge and
      agree that the Company shall not be responsible or liable, directly or indirectly, for any
      damage or loss caused or alleged to be caused by or in connection with the use of or
      reliance on any such content, goods or services available on or through any such websites
      or services.
    </p>
              <p className="mt-3">
      We strongly advise You to read the terms and conditions and privacy policies of any
      third-party websites or services that You visit.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Termination</h2>
    <p>
      We may terminate or suspend Your access immediately, without prior notice or liability,
      for any reason whatsoever, including without limitation if You breach these Terms and
      Conditions.
    </p>
              <p className="mt-3">
      Upon termination, Your right to use the Service will cease immediately.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Limitation of Liability</h2>
    <p>
      Notwithstanding any damages that You might incur, the entire liability of the Company and
      any of its suppliers under any provision of this Terms and Your exclusive remedy for all of
      the foregoing shall be limited to the amount actually paid by You through the Service or 100
      USD if You haven't purchased anything through the Service.
    </p>
              <p className="mt-3">
      To the maximum extent permitted by applicable law, in no event shall the Company or its
      suppliers be liable for any special, incidental, indirect, or consequential damages
                whatsoever.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
    <p>
                The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects
                without warranty of any kind.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Governing Law</h2>
    <p>
      The laws of the Country, excluding its conflicts of law rules, shall govern these Terms
      and Your use of the Service. Your use of the Application may also be subject to other local,
      state, national, or international laws.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Dispute Resolution</h2>
    <p>
      If You have any concern or dispute about the Service, You agree to first try to resolve the
      dispute informally by contacting the Company.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">For European Union (EU) Users</h2>
    <p>
      If You are a European Union consumer, you will benefit from any mandatory provisions of
      the law of the country in which You are resident.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">United States Legal Compliance</h2>
    <p>
      You represent and warrant that (i) You are not located in a country that is subject to the
      United States government embargo, or that has been designated by the United States
                government as a "terrorist supporting" country, and (ii) You are not listed on any
      United States government list of prohibited or restricted parties.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Severability and Waiver</h2>
              <h3 className="text-xl font-medium mt-4 mb-2">Severability</h3>
    <p>
      If any provision of these Terms is held to be unenforceable or invalid, such provision
      will be changed and interpreted to accomplish the objectives of such provision to the
      greatest extent possible under applicable law and the remaining provisions will continue
      in full force and effect.
    </p>
              <h3 className="text-xl font-medium mt-4 mb-2">Waiver</h3>
    <p>
      Except as provided herein, the failure to exercise a right or to require performance of an
      obligation under these Terms shall not affect a party's ability to exercise such right or
      require such performance at any time thereafter nor shall the waiver of a breach
      constitute a waiver of any subsequent breach.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Changes to These Terms and Conditions</h2>
    <p>
      We reserve the right, at Our sole discretion, to modify or replace these Terms at any
      time. If a revision is material We will make reasonable efforts to provide at least 30
      days' notice prior to any new terms taking effect. What constitutes a material change will
      be determined at Our sole discretion.
    </p>
              <p className="mt-3">
      By continuing to access or use Our Service after those revisions become effective, You
      agree to be bound by the revised terms. If You do not agree to the new terms, in whole or
      in part, please stop using the website and the Service.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Contact Us</h2>
    <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>By email: <a href="mailto:mohityadav0330@gmail.com" className="text-blue-600 hover:underline">mohityadav0330@gmail.com</a></li>
    </ul>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TermsConditionsPage;
