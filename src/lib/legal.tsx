// src/lib/legal.ts

import React from 'react';

const LegalSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
        <div className="space-y-3 text-dark-text">{children}</div>
    </div>
);

export const termsOfServiceContent = (
    <>
        <p className="text-sm text-gray-400 mb-6">Last Updated: October 26, 2025</p>
        <LegalSection title="1. Acceptance of Terms">
            <p>By accessing or using the TutorDeck platform and its services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you may not use our services.</p>
        </LegalSection>

        <LegalSection title="2. User Conduct and Responsibilities">
            <p>You agree to use TutorDeck's services for their intended educational and community service purposes. You are solely responsible for your conduct and any data you submit.</p>
            <p>The following actions are strictly prohibited:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Falsification of Information:</strong> Intentionally submitting false, inaccurate, or misleading information, including but not limited to, faking volunteer hours, misrepresenting tutoring sessions, or providing fraudulent proof of activity.</li>
                <li><strong>Academic Dishonesty:</strong> Completing assignments, writing essays, taking tests, or otherwise doing work on behalf of a student. The role of a tutor is to guide and support, not to commit academic fraud.</li>
                <li><strong>Harassment and Abuse:</strong> Engaging in any form of harassment, bullying, discrimination, or threatening behavior towards any user.</li>
                <li><strong>Unlawful Activities:</strong> Using the service for any illegal or unauthorized purpose.</li>
            </ul>
        </LegalSection>

        <LegalSection title="3. Volunteer Hour Verification and Enforcement">
            <p>TutorDeck is built on a foundation of trust and integrity. We take the accuracy of volunteer hours very seriously as they are a reflection of our community's impact.</p>
            <p>We reserve the right, at our sole discretion, to audit, investigate, and verify any volunteer hours or activities logged on our platform. If an activity is found to be fraudulent, falsified, or in violation of these Terms, we may take actions including, but not limited to:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Permanent removal of the fraudulent hours from your record.</li>
                <li>Issuing a formal warning.</li>
                <li>Temporary suspension of your account.</li>
                <li>Permanent termination of your account and a ban from all future TutorDeck activities.</li>
            </ul>
        </LegalSection>

        <LegalSection title="4. Termination">
            <p>We reserve the right to suspend or terminate your access to our services at any time, without notice, for any reason, including for a breach of these Terms.</p>
        </LegalSection>

        <LegalSection title="5. Disclaimer of Warranties">
            <p>The TutorDeck service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee any specific academic outcomes or results from using our services.</p>
        </LegalSection>
    </>
);

export const privacyPolicyContent = (
    <>
        <p className="text-sm text-gray-400 mb-6">Last Updated: October 26, 2025</p>
        <LegalSection title="1. Introduction">
            <p>This Privacy Policy describes how TutorDeck ("we," "us," or "our") collects, uses, and shares information about you when you use our website, services, and platform. By using our services, you agree to the collection and use of information in accordance with this policy.</p>
        </LegalSection>

        <LegalSection title="2. Information We Collect">
            <p>We collect information to provide and improve our services. The types of information we may collect include:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Personal Information You Provide:</strong> This includes your name, email address, school, and any other information you provide when you create an account or communicate with us.</li>
                <li><strong>Volunteer Activity Data:</strong> We collect all data related to your volunteer activities, such as activity type, date, duration (hours), and any proof or verification links you submit.</li>
                <li><strong>Usage Information:</strong> We automatically collect information about your interactions with our services, such as your IP address, browser type, device information, and pages visited.</li>
            </ul>
        </LegalSection>

        <LegalSection title="3. How We Use Your Information">
            <p>We may use the information we collect for a wide range of purposes, at our discretion, to operate and grow our initiative. These purposes include, but are not limited to, the following:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li>To operate, maintain, and provide the features of our service, including tracking your volunteer hours and generating transcripts.</li>
                <li>To communicate with you, including sending service-related announcements and responding to inquiries.</li>
                <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                <li><strong>For Research and Statistical Analysis:</strong> We may use, process, and share your data, particularly volunteer activity data, in an aggregated, anonymized, or de-identified format for statistical analysis, academic research, impact reporting, and to study educational trends.</li>
                <li><strong>For Promotional and Marketing Purposes:</strong> We may use aggregated data and testimonials to promote our organization, showcase our impact to potential partners, and for fundraising efforts.</li>
                <li>To enforce our Terms of Service, prevent fraud, and ensure the security and integrity of our platform.</li>
                <li>For any other purpose for which the information was collected, or for any other purpose with your consent.</li>
            </ul>
        </LegalSection>

        <LegalSection title="4. How We Share Your Information">
            <p>We may share your information in the following circumstances:</p>
             <ul className="list-disc list-inside pl-4 space-y-2">
                <li>With third-party vendors and service providers who need access to such information to carry out work on our behalf (e.g., cloud hosting).</li>
                <li>We may share aggregated, anonymized, or de-identified data publicly and with third parties, such as partners, sponsors, or researchers.</li>
                <li>In response to a legal request if we believe disclosure is required by law.</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of TutorDeck or others.</li>
            </ul>
        </LegalSection>
        
        <LegalSection title="5. Your Consent">
            <p>By using our services, you consent to the collection, use, processing, and sharing of your information as described in this Privacy Policy. You acknowledge that our use of data, including for statistical and promotional purposes, is essential to the operation and mission of our non-profit initiative.</p>
        </LegalSection>
    </>
);
