import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const RefundPolicyPage = () => (
  <div className="container mx-auto py-8 px-4">
    <Card className="border shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-amber-500 to-red-600 p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
          <p className="text-white/80">Last updated: May 18, 2025</p>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}>
          <div className="space-y-6">
    <p>
      Thank you for purchasing our digital products through Paddle. Due to the nature of
      our offerings which are delivered instantly and permanently licensed upon purchase,
      all sales are final and we do not provide refunds.
    </p>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Scope</h2>
    <p>
      This Refund Policy applies to all transactions processed by Paddle on behalf of
      ideas-in-graveyard, regardless of payment method or country of purchase.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">No Refunds</h2>
    <p>
      As our products are digital and delivered immediately, we do not offer refunds or
      exchanges after purchase. By completing your purchase, you acknowledge and agree
      that you will not request a refund from Paddle or ideas-in-graveyard.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Exceptions Required by Law</h2>
    <p>
      If you are located in the European Economic Area (EEA), you may have a legal right
      to withdraw from a distance contract within 14 days without giving any reason. This
      right does not apply once the digital content has been unsealed, downloaded, or
      streamed, and delivery has begun with your prior express consent. By purchasing,
      you consent to immediate performance and acknowledge that your right of withdrawal
      will be lost.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">How to Contact Us</h2>
    <p>
      If you believe you have a special circumstance that warrants an exception, please
                contact our support team at <a href="mailto:mohityadav0330@gmail.com" className="text-blue-600 hover:underline">mohityadav0330@gmail.com</a>.
      All inquiries will be handled on a case-by-case basis at our sole discretion.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Paddle Processing</h2>
    <p>
      All payments are processed via Paddle, a secure third-party payment processor. Any
      questions about charges or billing should first be directed to our support email.
      Paddle will not issue a refund without our authorization.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Changes to This Refund Policy</h2>
    <p>
      We reserve the right to modify this Refund Policy at any time. Changes will be
      effective immediately upon posting on this page with an updated "Last updated" date.
      Your continued use of our products following those changes constitutes your
      acceptance of the new policy.
    </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 border-b pb-2">Governing Law</h2>
    <p>
      This Refund Policy is governed by the laws of Haryana, India, without regard to its
      conflict of laws principles.
    </p>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default RefundPolicyPage;
