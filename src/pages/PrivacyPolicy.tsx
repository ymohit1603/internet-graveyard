import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border shadow-lg">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-white/80">Last updated: May 18, 2025</p>
          </div>
          
          <div className="p-6 max-h-[70vh] overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          }}>
            <div className="space-y-6">
              <p>
                This Terms of Service describes Our policies and procedures on the collection, use and disclosure of Your
                information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>
              <p>
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
                collection and use of information in accordance with this Terms of Service. This Terms of Service has been
                created with the help of the Free Terms of Service Generator.
              </p>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Interpretation and Definitions</h2>
                <h3 className="text-xl font-medium mt-4 mb-2">Interpretation</h3>
                <p>
                  The words of which the initial letter is capitalized have meanings defined under the following conditions.
                  The following definitions shall have the same meaning regardless of whether they appear in singular or in
                  plural.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">Definitions</h3>
                <p>For the purposes of this Privacy Policy:</p>
                <ul className="list-disc pl-6 my-3 space-y-2">
                  <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                  <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a
                    party, where "control" means ownership of 50% or more of the shares, equity interest or other securities
                    entitled to vote for election of directors or other managing authority.
                  </li>
                  <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement)
                    refers to ideas-in-graveyard.
                  </li>
                  <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device
                    by a website, containing the details of Your browsing history on that website among its many uses.
                  </li>
                  <li><strong>Country</strong> refers to: Haryana, India.</li>
                  <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone, or a
                    digital tablet.
                  </li>
                  <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                  <li><strong>Service</strong> refers to the Website.</li>
                  <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of
                    the Company.
                  </li>
                  <li><strong>Third-party Social Media Service</strong> refers to any website or any social network website
                    through which a User can log in or create an account to use the Service.
                  </li>
                  <li><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the
                    Service or from the Service infrastructure itself.
                  </li>
                  <li><strong>Website</strong> refers to ideas-in-graveyard, accessible from https://ideas-in-graveyard.space</li>
                  <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other
                    legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Collecting and Using Your Personal Data</h2>
                <h3 className="text-xl font-medium mt-4 mb-2">Types of Data Collected</h3>
                <h4 className="text-lg font-medium mt-3 mb-2">Personal Data</h4>
                <p className="mb-3">
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information that
                  can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 my-3">
                  <li>Email address</li>
                  <li>Usage Data</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Use of Your Personal Data</h2>
                <p>
                  We may use Your Personal Data for:
                </p>
                <ul className="list-disc pl-6 my-3">
                  <li>Providing and maintaining our Service.</li>
                  <li>Managing Your Account.</li>
                  <li>Performance of a contract.</li>
                  <li>Contacting You with updates and information.</li>
                  <li>Providing news, special offers, and general information.</li>
                  <li>Managing Your requests.</li>
                  <li>Business transfers (e.g., mergers or asset sales).</li>
                  <li>Other purposes like data analysis and improving our Service.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Sharing Your Personal Data</h2>
                <p>
                  We may share Your information with:
                </p>
                <ul className="list-disc pl-6 my-3">
                  <li>Service Providers, to facilitate and improve our Service.</li>
                  <li>Affiliates and business partners, under privacy obligations.</li>
                  <li>Other users, if You interact publicly or via social features.</li>
                  <li>Successors in business transfers.</li>
                  <li>With Your consent.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Retention of Your Personal Data</h2>
                <p>
                  We retain Personal Data only as long as necessary for the purposes outlined and to comply with legal
                  obligations.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Transfer of Your Personal Data</h2>
                <p>
                  Data may be processed in locations outside Your jurisdiction. We take reasonable measures to ensure data
                  is treated securely and in accordance with this Policy.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Delete Your Personal Data</h2>
                <p>
                  You have the right to delete or request deletion of Your Personal Data. You can manage Your data via
                  account settings or by contacting us.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Disclosure of Your Personal Data</h2>
                <h3 className="text-xl font-medium mt-4 mb-2">Business Transactions</h3>
                <p>
                  In the event of a merger or sale, Your data may be transferred. We will notify You before any transfer.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-medium mt-4 mb-2">Law Enforcement</h3>
                <p>
                  We may disclose Your data if required by law or valid requests from authorities.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Security of Your Personal Data</h2>
                <p>
                  We use commercially acceptable means to protect Your Personal Data, but cannot guarantee absolute
                  security.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Children's Privacy</h2>
                <p>
                  Our Service does not address anyone under 13. We do not knowingly collect data from children under 13.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Links to Other Websites</h2>
                <p>
                  Our Service may contain links to third-party sites. We are not responsible for their content or privacy
                  practices. Please review their policies.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Changes to this Privacy Policy</h2>
                <p>
                  We may update this Policy periodically. We will notify You by posting the new Policy on this page with
                  an updated "Last updated" date.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Contact Us</h2>
                <p className="mt-2 mb-2">If you have any questions about this Privacy Policy, You can contact us:</p>
                <ul className="list-disc pl-6">
                  <li>By email: <a href="mailto:mohityadav0330@gmail.com" className="text-blue-600 hover:underline">mohityadav0330@gmail.com</a></li>
                </ul>
              </section>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;